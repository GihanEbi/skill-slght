"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

import { createBlankJob } from "@/models/Job";
import type {
  Department,
  Job,
  JobCategory,
  LocationType,
} from "@/types/job_types";
import {
  fetchDepartments,
  fetchLocationTypes,
  fetchJobTemplates,
  fetchAiSkillSuggestions,
  JobTemplate,
  LS_KEY,
} from "@/services/jobService";

const LOCATION_TYPE_ICONS: Record<string, string> = {
  Remote: "home",
  Hybrid: "apartment",
  Onsite: "corporate_fare",
};

// JOB_TEMPLATES is now fetched from the service

// AI Skill Suggestions are now fetched from the service

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function CreateJobDetailsPage() {
  const router = useRouter();

  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    [],
  );
  const [availableLocationTypes, setAvailableLocationTypes] = useState<
    string[]
  >([]);
  const [availableTemplates, setAvailableTemplates] = useState<JobTemplate[]>(
    [],
  );
  const [availableSkillSuggestions, setAvailableSkillSuggestions] = useState<
    string[]
  >([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ── Form State (maps directly to Partial<Job>) ───────────────────────────
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<Department>(
    "Engineering" as Department,
  );
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState<LocationType>("Hybrid");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // ── Dynamic data fetching ──────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, locs, temps, skillsFetched] = await Promise.all([
          fetchDepartments(),
          fetchLocationTypes(),
          fetchJobTemplates(),
          fetchAiSkillSuggestions(),
        ]);
        setAvailableDepartments(depts);
        setAvailableLocationTypes(locs);
        setAvailableTemplates(temps);
        setAvailableSkillSuggestions(skillsFetched);
      } catch (err) {
        console.error("Failed to load constant data:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, []);

  // ── UI State ─────────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(true);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Job, string>>>({});

  const skillInputRef = useRef<HTMLInputElement>(null);
  const descEditorRef = useRef<HTMLDivElement>(null);

  // ── Rich-text editor format state ────────────────────────────────────────
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState("3"); // Default execCommand size
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const fontSizeRef = useRef<HTMLDivElement>(null);

  /** Re-check active formats whenever the selection changes inside the editor */
  const updateFormatState = useCallback(() => {
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));

    // font size is trickier with queryCommandValue
    const size = document.queryCommandValue("fontSize");
    if (size) setFontSize(size);
  }, []);

  // Close custom font size dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fontSizeRef.current &&
        !fontSizeRef.current.contains(e.target as Node)
      ) {
        setIsFontSizeOpen(false);
      }
    };
    if (isFontSizeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFontSizeOpen]);

  /** Apply a formatting command and keep the editor focused */
  const handleFormat = useCallback(
    (command: string, value?: string) => {
      descEditorRef.current?.focus();
      document.execCommand(command, false, value);
      updateFormatState();
      // Sync HTML back to state
      const html = descEditorRef.current?.innerHTML ?? "";
      setDescription(html);
      setErrors((p) => ({ ...p, description: undefined }));
    },
    [updateFormatState],
  );

  // Hydrate from localStorage on mount (resume draft)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved: Partial<Job> = JSON.parse(raw);
        if (saved.title) setTitle(saved.title);
        if (saved.department) setDepartment(saved.department);
        if (saved.location) setLocation(saved.location);
        if (saved.locationType) setLocationType(saved.locationType);
        if (saved.description) setDescription(saved.description);
        if (saved.skills?.length) setSkills(saved.skills);
        // Only skip template modal if a title already exists
        if (saved.title) setShowModal(false);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Sync description state → rich-text editor DOM
  // (triggered by AI generate or localStorage hydration)
  useEffect(() => {
    const el = descEditorRef.current;
    if (!el) return;
    // Only update DOM if the content actually differs to avoid cursor jumps
    if (el.innerHTML !== description) {
      el.innerHTML = description;
    }
  }, [description]);

  // ── Skill Helpers ─────────────────────────────────────────────────────────
  const addSkill = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === "Backspace" && skillInput === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  // ── Template Select ───────────────────────────────────────────────────────
  const selectTemplate = (tmpl: { title: string; dept: Department }) => {
    setTitle(tmpl.title);
    setDepartment(tmpl.dept);
    setShowModal(false);
  };

  // ── AI Generate Description ───────────────────────────────────────────────
  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setDescription(
      `We are seeking a visionary ${title || "specialist"} to join our ${department} team. ` +
        `You will design and deliver scalable solutions, collaborating cross-functionally ` +
        `to drive measurable impact. Strong expertise in ${skills.slice(0, 3).join(", ") || "the relevant stack"} ` +
        `is required. This ${locationType.toLowerCase()} role offers the opportunity to shape ` +
        `the future of our engineering landscape.`,
    );
    setIsAiGenerating(false);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<Record<keyof Job, string>> = {};
    if (!title.trim()) errs.title = "Job title is required.";
    if (!department) errs.department = "Please select a department.";
    if (!location.trim()) errs.location = "Location is required.";
    if (skills.length === 0) errs.skills = "Add at least one required skill.";
    if (!description.trim()) errs.description = "Job description is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Save Draft (no validation) ────────────────────────────────────────────
  const handleSaveDraft = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const existingRaw = localStorage.getItem(LS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : createBlankJob();

      const updated = {
        ...existing,
        ...buildPayload(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save draft", e);
    }

    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/active_jobs"), 800);
  };

  // ── Build Payload ─────────────────────────────────────────────────────────
  const buildPayload = () => {
    return {
      title,
      department,
      location,
      locationType,
      description,
      skills,
      status: "Draft" as const,
    };
  };

  // ── Continue ──────────────────────────────────────────────────────────────
  const handleContinue = async () => {
    if (!validate()) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const existingRaw = localStorage.getItem(LS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : createBlankJob();

      const updated = {
        ...existing,
        ...buildPayload(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save details", e);
    }

    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/create/benefits"), 900);
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* ── Full-page Save Overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)]/50 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isSaved ? (
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-2xl animate-pulse">
                        database
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-glow"
                    >
                      <span className="material-symbols-outlined text-white text-4xl font-bold">
                        check
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-center">
                <motion.h3
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[var(--text-main)] font-bold text-lg tracking-tight"
                >
                  {isSaved ? "Details Saved" : "Saving Details..."}
                </motion.h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                  {isSaved
                    ? "Redirecting to Benefits..."
                    : "Storing your job data..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Template Selection Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-[2rem] p-6 md:p-10 shadow-2xl border-[var(--glass-border)] max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 text-center mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-2xl">
                    auto_awesome
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] tracking-tight mb-2">
                  Start with a{" "}
                  <span className="text-primary font-extrabold">Template</span>
                </h2>
                <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto text-sm">
                  Choose a pre-configured job post to accelerate your hiring, or
                  start blank.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {isDataLoading ? (
                  <div className="col-span-full py-12 text-center text-[var(--text-muted)] font-bold italic opacity-40">
                    Loading templates...
                  </div>
                ) : (
                  availableTemplates.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => selectTemplate(tmpl)}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-primary/50 hover:bg-[var(--surface)] transition-all text-left shadow-sm"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[var(--surface)] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-[var(--border-subtle)]">
                        <span className="material-symbols-outlined text-xl">
                          {tmpl.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">
                          {tmpl.title}
                        </p>
                        <p className="text-[11px] font-semibold text-[var(--text-muted)] opacity-70">
                          {tmpl.dept}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 rounded-xl active-tab-gradient text-white font-bold text-sm shadow-glow"
                >
                  Create Blank Job
                </button>
                <button
                  onClick={() => router.push("/users/system/jobs/active_jobs")}
                  className="w-full py-3.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Step Progress ──────────────────────────────────────────────────── */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="description" label="Details" active />
          <StepLine />
          <StepItem icon="card_giftcard" label="Benefits" />
          <StepLine />
          <StepItem icon="payments" label="Compensation" />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32 lg:pb-0">
          {/* ── Form Panel ─────────────────────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="col-span-1 lg:col-span-8 glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl order-2 lg:order-1"
          >
            <div className="mb-10 pb-4 border-b border-[var(--border-subtle)]">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Job Details
              </h1>
              <p className="text-sm text-[var(--text-muted)] font-medium">
                Define the core parameters for your AI-driven recruitment
                protocol.
              </p>
            </div>

            <div className="space-y-8">
              {/* ── Job Title ─────────────────────────────────────────────── */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1 flex items-center gap-1">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="job-title"
                  className={`premium-input rounded-xl md:rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-lg md:text-xl font-bold text-[var(--text-main)] transition-all placeholder:font-medium placeholder:opacity-30 ${errors.title ? "border-red-400/60 focus:border-red-400" : ""}`}
                  placeholder="e.g. Lead Blockchain Engineer"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((p) => ({ ...p, title: undefined }));
                  }}
                />
                {errors.title && <FieldError msg={errors.title} />}
              </div>

              {/* ── Department + Category ─────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Department Dropdown */}
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1 flex items-center gap-1">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDeptOpen((o) => !o)}
                    className={`w-full premium-input rounded-xl py-3.5 px-5 font-semibold text-[var(--text-main)] flex items-center justify-between hover:border-primary/50 transition-all text-sm ${errors.department ? "border-red-400/60" : ""}`}
                  >
                    <span>{department}</span>
                    <motion.span
                      animate={{ rotate: isDeptOpen ? 180 : 0 }}
                      className="material-symbols-outlined text-primary"
                    >
                      expand_more
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isDeptOpen && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 4 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute w-full z-[110] bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden p-1 max-h-56 overflow-y-auto"
                        >
                          {availableDepartments.map((dept) => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => {
                                setDepartment(dept as Department);
                                setIsDeptOpen(false);
                                setErrors((p) => ({
                                  ...p,
                                  department: undefined,
                                }));
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors rounded-xl ${department === dept ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                            >
                              {dept}
                            </button>
                          ))}
                        </motion.div>
                        <div
                          className="fixed inset-0 z-[100]"
                          onClick={() => setIsDeptOpen(false)}
                        />
                      </>
                    )}
                  </AnimatePresence>
                  {errors.department && <FieldError msg={errors.department} />}
                </div>
              </div>

              {/* ── Location + Location Type ───────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Location Text */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1 flex items-center gap-1">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {/* <span className="material-symbols-outlined absolute left-4 text-[var(--text-muted)] text-lg opacity-60 pointer-events-none">
                      location_on
                    </span> */}
                    <input
                      id="job-location"
                      className={`premium-input rounded-xl md:rounded-2xl py-3.5 px-5 md:py-4 md:px-6 font-bold text-md md:text-md text-[var(--text-main)] transition-all placeholder:font-medium placeholder:opacity-30 ${errors.title ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. Remote / Lisbon, PT"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setErrors((p) => ({ ...p, location: undefined }));
                      }}
                    />
                  </div>
                  {errors.location && <FieldError msg={errors.location} />}
                </div>

                {/* Location Type Buttons */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                    Work Arrangement
                  </label>
                  <div className="flex gap-2 h-[52px]">
                    {availableLocationTypes.map((lt) => (
                      <button
                        key={lt}
                        type="button"
                        onClick={() => setLocationType(lt as LocationType)}
                        className={`flex-1 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                          locationType === lt
                            ? "border-primary bg-primary/10 text-primary shadow-glow"
                            : "border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-muted)] opacity-70 hover:opacity-100 hover:border-primary/30"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {LOCATION_TYPE_ICONS[lt]}
                        </span>
                        <span className="text-[10px] font-bold tracking-tight">
                          {lt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Required Skills ────────────────────────────────────────── */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1 flex items-center gap-1">
                  Required Skills <span className="text-red-400">*</span>
                </label>
                <div
                  className={`bg-[var(--input-bg)] border rounded-2xl p-5 min-h-[120px] focus-within:border-primary/40 transition-all shadow-sm cursor-text ${errors.skills ? "border-red-400/60" : "border-[var(--input-border,var(--border-subtle))]"}`}
                  onClick={() => skillInputRef.current?.focus()}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <AnimatePresence>
                      {skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold"
                        >
                          {skill}
                          <span
                            className="material-symbols-outlined text-sm cursor-pointer opacity-60 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSkill(skill);
                            }}
                          >
                            close
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <input
                      ref={skillInputRef}
                      className="flex-1 min-w-[140px] bg-transparent border-none text-[var(--text-main)] font-semibold text-sm outline-none px-1 placeholder:opacity-40"
                      placeholder={
                        skills.length === 0
                          ? "Type a skill and press Enter..."
                          : "Add more..."
                      }
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setErrors((p) => ({ ...p, skills: undefined }));
                      }}
                      onKeyDown={handleSkillKeyDown}
                      onBlur={() => {
                        if (skillInput.trim()) addSkill(skillInput);
                      }}
                    />
                  </div>

                  {/* AI Suggestions */}
                  <div className="border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-tight mb-2.5">
                      AI Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {isDataLoading ? (
                        <div className="text-[10px] italic text-[var(--text-muted)] opacity-50">
                          Loading suggestions...
                        </div>
                      ) : (
                        availableSkillSuggestions
                          .filter((s) => !skills.includes(s))
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                addSkill(s);
                                setErrors((p) => ({ ...p, skills: undefined }));
                              }}
                              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] text-[11px] font-bold hover:border-primary/40 hover:text-primary transition-all"
                            >
                              + {s}
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                </div>
                {errors.skills && <FieldError msg={errors.skills} />}
              </div>

              {/* ── Job Description ────────────────────────────────────────── */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1 flex items-center gap-1">
                  Job Description <span className="text-red-400">*</span>
                </label>
                <div
                  className={`glass-panel rounded-2xl overflow-hidden border-[var(--border-subtle)] focus-within:ring-1 focus-within:ring-primary/30 transition-all relative ${errors.description ? "border-red-400/60" : ""}`}
                >
                  {/* AI Generating Overlay */}
                  <AnimatePresence>
                    {isAiGenerating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-[var(--surface)]/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "linear",
                            }}
                            className="w-12 h-12 border-2 border-primary/10 border-t-primary rounded-full"
                          />
                          <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-xl animate-pulse">
                            psychology
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
                            AI Drafting Mission
                          </p>
                          <p className="text-[9px] text-[var(--text-muted)] font-medium">
                            Generating context...
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 px-4 py-2 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    {/* Bold */}
                    <button
                      type="button"
                      title="Bold (Ctrl+B)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("bold");
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isBold
                          ? "bg-primary/15 text-primary"
                          : "text-slate-400 hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        format_bold
                      </span>
                    </button>

                    {/* Italic */}
                    <button
                      type="button"
                      title="Italic (Ctrl+I)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("italic");
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isItalic
                          ? "bg-primary/15 text-primary"
                          : "text-slate-400 hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        format_italic
                      </span>
                    </button>

                    {/* Underline */}
                    <button
                      type="button"
                      title="Underline (Ctrl+U)"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("underline");
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isUnderline
                          ? "bg-primary/15 text-primary"
                          : "text-slate-400 hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        format_underlined
                      </span>
                    </button>

                    <div className="w-px h-5 bg-[var(--border-subtle)] mx-1" />

                    {/* Alignment */}
                    <button
                      type="button"
                      title="Align Left"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("justifyLeft");
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)] transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        format_align_left
                      </span>
                    </button>
                    <button
                      type="button"
                      title="Align Center"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleFormat("justifyCenter");
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)] transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">
                        format_align_center
                      </span>
                    </button>

                    <div className="w-px h-5 bg-[var(--border-subtle)] mx-1" />

                    {/* Font Size Selector */}
                    <div className="relative" ref={fontSizeRef}>
                      <button
                        type="button"
                        onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-bold text-[var(--text-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-main)] transition-all"
                      >
                        <span>
                          {fontSize === "1"
                            ? "Small"
                            : fontSize === "3"
                              ? "Normal"
                              : fontSize === "5"
                                ? "Large"
                                : fontSize === "7"
                                  ? "Huge"
                                  : "Size"}
                        </span>
                        <span className="material-symbols-outlined text-xs">
                          expand_more
                        </span>
                      </button>

                      <AnimatePresence>
                        {isFontSizeOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute left-0 top-full z-[120] min-w-[100px] bg-[var(--surface)] border border-[var(--glass-border)] rounded-xl shadow-2xl p-1 overflow-hidden"
                          >
                            {[
                              { label: "Small", val: "1" },
                              { label: "Normal", val: "3" },
                              { label: "Large", val: "5" },
                              { label: "Huge", val: "7" },
                            ].map((opt) => (
                              <button
                                key={opt.val}
                                type="button"
                                onClick={() => {
                                  handleFormat("fontSize", opt.val);
                                  setIsFontSizeOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                                  fontSize === opt.val
                                    ? "bg-primary/15 text-primary"
                                    : "text-[var(--text-muted)] hover:bg-primary/5 hover:text-[var(--text-main)]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleAiGenerate}
                      disabled={isAiGenerating}
                      className="flex items-center gap-2 text-primary hover:opacity-70 transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-lg animate-pulse">
                        auto_fix_high
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        AI Generate
                      </span>
                    </button>
                  </div>

                  {/* Rich-text editor */}
                  <div
                    id="job-description"
                    ref={descEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const html = (e.currentTarget as HTMLDivElement)
                        .innerHTML;
                      setDescription(html);
                      setErrors((p) => ({ ...p, description: undefined }));
                    }}
                    onKeyUp={updateFormatState}
                    onMouseUp={updateFormatState}
                    onSelect={updateFormatState}
                    onKeyDown={(e) => {
                      // Shortcuts
                      if (e.ctrlKey || e.metaKey) {
                        if (e.key === "b") {
                          e.preventDefault();
                          handleFormat("bold");
                        }
                        if (e.key === "i") {
                          e.preventDefault();
                          handleFormat("italic");
                        }
                        if (e.key === "u") {
                          e.preventDefault();
                          handleFormat("underline");
                        }
                      }
                    }}
                    className={`min-h-[196px] w-full bg-transparent text-[var(--text-main)] p-6 outline-none text-base font-medium leading-relaxed
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:list-outside
                      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:list-outside
                      [&_li]:mb-1
                      [&_strong]:font-bold [&_b]:font-bold
                      empty:before:content-[attr(data-placeholder)] empty:before:opacity-40 empty:before:pointer-events-none`}
                    data-placeholder="Describe the mission, responsibilities, and day-to-day challenges..."
                  />
                </div>
                {errors.description && <FieldError msg={errors.description} />}
              </div>
            </div>
          </motion.div>

          {/* ── AI Sidebar ──────────────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2 space-y-5"
          >
            {/* AI Assistant Card */}
            <div className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden border-primary/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)]">
                      AI Assistant
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Real-time analysis active
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-muted)] mb-3 tracking-tight">
                      Market Demand
                    </h4>
                    <div className="bg-[var(--input-bg)] rounded-xl p-4 border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-[11px] font-bold mb-2">
                        <span className="text-[var(--text-muted)]">
                          Demand Score
                        </span>
                        <span className="text-accent">High Potential</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-[var(--text-muted)] italic leading-relaxed text-center font-medium">
                      {skills.length > 0
                        ? `Including "${skills[0]}" expertise typically increases candidate quality by 40%.`
                        : "Add required skills to get AI-powered market insights."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Summary Card */}
            <div className="glass-panel rounded-[2rem] p-6 border-[var(--border-subtle)] shadow-sm">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                Live Summary
              </h4>
              <div className="space-y-3">
                <SummaryRow label="Title" value={title || "—"} />
                <SummaryRow label="Department" value={department || "—"} />
                <SummaryRow label="Location" value={location || "—"} />
                <SummaryRow label="Arrangement" value={locationType || "—"} />
                <SummaryRow
                  label="Skills"
                  value={
                    skills.length > 0 ? `${skills.length} added` : "None yet"
                  }
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* ── Sticky Footer ──────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md z-[90]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm hover:text-[var(--text-main)] transition-all group"
            onClick={() => router.push("/users/system/jobs/active_jobs")}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-lg">
              arrow_back
            </span>
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm hover:border-primary/30 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Save Draft
            </button>
            <button
              onClick={handleContinue}
              disabled={isProcessing}
              className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:translate-y-[-1px] transition-all shadow-premium disabled:opacity-60"
            >
              Continue
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldError({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[11px] font-semibold text-red-400 ml-1 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-sm">error</span>
      {msg}
    </motion.p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs font-semibold text-[var(--text-main)] text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}

function StepItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          active
            ? "bg-primary text-white shadow-glow ring-4 ring-primary/10"
            : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[10px] font-bold hidden sm:block tracking-tight ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine() {
  return (
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-2 translate-y-[-12px] sm:translate-y-[-14px]" />
  );
}
