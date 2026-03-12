"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getDraft,
  saveDraft,
  fetchBenefits,
  fetchAiPerkSuggestions,
  JobDraft,
} from "@/services/jobService";
import { Benefit } from "@/types/job_types";
import { UUID } from "@/types/common_types";

// Work-life toggle config (UI-only, stored as booleans in JobDraft)
const WORK_LIFE_OPTIONS = [
  {
    id: "flexible" as const,
    icon: "schedule",
    title: "Flexible Hours",
    desc: "Employees choose their own working schedule.",
    draftKey: "work_life_flexible_hours" as keyof JobDraft,
  },
  {
    id: "remote" as const,
    icon: "home_work",
    title: "Remote-First",
    desc: "Full remote work supported globally.",
    draftKey: "work_life_remote_first" as keyof JobDraft,
  },
  {
    id: "mental" as const,
    icon: "self_improvement",
    title: "Mental Health Days",
    desc: "Dedicated paid days for mental wellbeing.",
    draftKey: "work_life_mental_health_days" as keyof JobDraft,
  },
];

export default function BenefitsPage() {
  // ── Fetched data ──────────────────────────────────────────────────────
  const [availableBenefits, setAvailableBenefits] = useState<Benefit[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ── Form state ────────────────────────────────────────────────────────
  const [selectedBenefitIds, setSelectedBenefitIds] = useState<UUID[]>([]);
  const [selectedBenefitNames, setSelectedBenefitNames] = useState<string[]>(
    [],
  );
  const [customPerks, setCustomPerks] = useState<string[]>([]);
  const [newPerkInput, setNewPerkInput] = useState("");
  const [flexibleHours, setFlexibleHours] = useState(false);
  const [remoteFirst, setRemoteFirst] = useState(false);
  const [mentalHealthDays, setMentalHealthDays] = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────
  const [showAiModal, setShowAiModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const router = useRouter();

  // ── Load data ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const benefits = await fetchBenefits();
        setAvailableBenefits(benefits);
      } catch (err) {
        console.error("Failed to load benefits:", err);
      } finally {
        setIsDataLoading(false);
      }
    };
    load();
  }, []);

  // ── Hydrate from draft ────────────────────────────────────────────────
  useEffect(() => {
    const draft = getDraft();
    setSelectedBenefitIds(draft.benefit_ids);
    setSelectedBenefitNames(draft.benefit_names);
    setCustomPerks(draft.custom_perks);
    setFlexibleHours(draft.work_life_flexible_hours);
    setRemoteFirst(draft.work_life_remote_first);
    setMentalHealthDays(draft.work_life_mental_health_days);
  }, []);

  // ── Toggle benefit ────────────────────────────────────────────────────
  const toggleBenefit = (benefit: Benefit) => {
    const isSelected = selectedBenefitIds.includes(benefit.id);
    if (isSelected) {
      setSelectedBenefitIds((prev) => prev.filter((id) => id !== benefit.id));
      setSelectedBenefitNames((prev) => prev.filter((n) => n !== benefit.name));
    } else {
      setSelectedBenefitIds((prev) => [...prev, benefit.id]);
      setSelectedBenefitNames((prev) => [...prev, benefit.name]);
    }
  };

  // ── Perk helpers ──────────────────────────────────────────────────────
  const addPerk = (perk: string) => {
    const trimmed = perk.trim();
    if (trimmed && !customPerks.includes(trimmed)) {
      setCustomPerks((prev) => [trimmed, ...prev]);
      setNewPerkInput("");
    }
  };
  const removePerk = (perk: string) =>
    setCustomPerks((prev) => prev.filter((p) => p !== perk));

  // ── AI generate perks ─────────────────────────────────────────────────
  const handleAiGenerateClick = async () => {
    setIsAiGenerating(true);
    try {
      const suggestions = await fetchAiPerkSuggestions();
      setAiSuggestions(suggestions);
      setShowAiModal(true);
    } catch (err) {
      console.error("Failed to get AI suggestions:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ── Build patch ───────────────────────────────────────────────────────
  const buildPatch = (): Partial<JobDraft> => ({
    benefit_ids: selectedBenefitIds,
    benefit_names: selectedBenefitNames,
    custom_perks: customPerks,
    work_life_flexible_hours: flexibleHours,
    work_life_remote_first: remoteFirst,
    work_life_mental_health_days: mentalHealthDays,
  });

  // ── Save handlers ─────────────────────────────────────────────────────
  const handleNext = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1400));
    saveDraft(buildPatch());
    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/create/comp"), 900);
  };

  const handleSaveDraft = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    saveDraft({ ...buildPatch(), status: "DRAFT" as any });
    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/active_jobs"), 800);
  };

  // ── Benefit icon helper ───────────────────────────────────────────────
  const getBenefitIcon = (b: Benefit) => b.icon_url ?? "redeem";

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* Processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)]/40 backdrop-blur-md"
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
                  {isSaved ? "Benefits Saved" : "Saving Benefits..."}
                </motion.h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                  {isSaved
                    ? "Redirecting to Compensation..."
                    : "Updating recruitment benefits..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestions Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md glass-panel rounded-[2rem] p-8 shadow-2xl border-primary/20"
            >
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
                AI Perk Suggestions
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6 font-medium">
                Click a suggestion to add it to your pipeline.
              </p>
              <div className="space-y-3">
                {aiSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      addPerk(s);
                      setShowAiModal(false);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-primary/50 transition-all font-semibold text-sm text-[var(--text-main)] flex justify-between items-center group"
                  >
                    {s}
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      add_circle
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-full mt-6 py-3 font-bold text-[var(--text-muted)] text-sm"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Step header */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="check_circle" label="Details" completed />
          <StepLine />
          <StepItem icon="card_giftcard" label="Benefits" active />
          <StepLine />
          <StepItem icon="payments" label="Compensation" />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32 lg:pb-0">
          {/* Form */}
          <div className="col-span-1 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl"
            >
              <div className="mb-10 border-b border-[var(--border-subtle)] pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                  Benefits & Perks
                </h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">
                  Define the unique value propositions that make this role stand
                  out.
                </p>
              </div>

              <div className="space-y-10">
                {/* Standard Benefits */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-5 ml-1 tracking-tight">
                    Standard Benefits
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isDataLoading ? (
                      <div className="col-span-full py-8 text-center text-[var(--text-muted)] font-bold italic opacity-40">
                        Loading benefits...
                      </div>
                    ) : (
                      availableBenefits.map((b) => (
                        <BenefitCard
                          key={b.id}
                          icon={getBenefitIcon(b)}
                          label={b.name}
                          isActive={selectedBenefitIds.includes(b.id)}
                          onClick={() => toggleBenefit(b)}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Work Life & Flexibility */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-5 ml-1 tracking-tight">
                    Work Life & Flexibility
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    <ToggleRow
                      icon={WORK_LIFE_OPTIONS[0].icon}
                      title={WORK_LIFE_OPTIONS[0].title}
                      desc={WORK_LIFE_OPTIONS[0].desc}
                      enabled={flexibleHours}
                      onClick={() => setFlexibleHours((v) => !v)}
                    />
                    <ToggleRow
                      icon={WORK_LIFE_OPTIONS[1].icon}
                      title={WORK_LIFE_OPTIONS[1].title}
                      desc={WORK_LIFE_OPTIONS[1].desc}
                      enabled={remoteFirst}
                      onClick={() => setRemoteFirst((v) => !v)}
                    />
                    <ToggleRow
                      icon={WORK_LIFE_OPTIONS[2].icon}
                      title={WORK_LIFE_OPTIONS[2].title}
                      desc={WORK_LIFE_OPTIONS[2].desc}
                      enabled={mentalHealthDays}
                      onClick={() => setMentalHealthDays((v) => !v)}
                    />
                  </div>
                </div>

                {/* Additional Perks */}
                <div className="space-y-3">
                  <div className="glass-panel rounded-2xl overflow-hidden border-[var(--border-subtle)] focus-within:ring-1 focus-within:ring-primary/30 transition-all relative">
                    <AnimatePresence>
                      {isAiGenerating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-20 bg-[var(--surface)]/60 backdrop-blur-md flex flex-col items-center justify-center gap-3"
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
                              Scanning Market Trends
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)] font-medium">
                              Identifying high-retention perks...
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-5 px-5 py-2.5 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Additional Perks
                      </span>
                      <div className="flex-1" />
                      <button
                        onClick={handleAiGenerateClick}
                        disabled={isAiGenerating}
                        className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-all bg-transparent border-none outline-none disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-lg">
                          auto_fix_high
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          AI Generate
                        </span>
                      </button>
                    </div>

                    <div className="p-6">
                      <AnimatePresence>
                        {customPerks.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {customPerks.map((perk) => (
                              <motion.div
                                key={perk}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm"
                              >
                                {perk}
                                <span
                                  onClick={() => removePerk(perk)}
                                  className="material-symbols-outlined text-sm cursor-pointer opacity-70 hover:opacity-100"
                                >
                                  close
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          className="flex-1 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                          placeholder="Type a custom perk (e.g. Free Lunch)..."
                          value={newPerkInput}
                          onChange={(e) => setNewPerkInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && addPerk(newPerkInput)
                          }
                        />
                        <button
                          onClick={() => addPerk(newPerkInput)}
                          className="px-5 py-3 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all border border-primary/20 whitespace-nowrap"
                        >
                          Add Perk
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden border-primary/10"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      insights
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)]">
                      AI Assistant
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Analyzing benefits...
                    </p>
                  </div>
                </div>
                <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-muted)] mb-4 tracking-tight">
                      Selected Benefits
                    </h4>
                    {selectedBenefitNames.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedBenefitNames.map((n) => (
                          <span
                            key={n}
                            className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold border border-primary/20"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] italic font-medium">
                        No benefits selected yet.
                      </p>
                    )}
                  </div>
                  <div className="bg-[var(--input-bg)] rounded-xl p-4 border border-[var(--border-subtle)]">
                    <div className="flex justify-between text-[11px] font-bold mb-2">
                      <span className="text-[var(--text-muted)]">
                        Perk Competitiveness
                      </span>
                      <span className="text-accent">Market Standard</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            30 +
                              selectedBenefitIds.length * 10 +
                              customPerks.length * 5,
                            100,
                          )}%`,
                        }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-[var(--text-muted)] italic leading-relaxed text-center font-medium">
                      "Including Learning stipends would place this package in
                      the{" "}
                      <span className="text-primary font-bold">top 15%</span> of
                      tech protocols."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md z-[90]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm hover:text-[var(--text-main)] transition-all"
            onClick={() => router.push("/users/system/jobs/create/details")}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <div className="flex gap-4">
            <button
              onClick={handleSaveDraft}
              className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm"
            >
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-12 py-3 rounded-xl text-white font-bold text-sm shadow-premium"
              onClick={handleNext}
              disabled={isProcessing}
            >
              Continue
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
function StepItem({
  icon,
  label,
  active = false,
  completed = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
          active
            ? "bg-primary text-white shadow-glow ring-4 ring-primary/10"
            : completed
              ? "bg-primary/20 text-primary border border-primary/10"
              : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[10px] font-bold hidden sm:block tracking-tight ${
          active ? "text-primary" : "text-[var(--text-muted)]"
        }`}
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

function BenefitCard({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all gap-2 group ${
        isActive
          ? "border-primary bg-primary/10 text-[var(--text-main)]"
          : "border-[var(--border-subtle)] bg-[var(--input-bg)] hover:border-primary/40 text-[var(--text-muted)]"
      }`}
    >
      <span
        className={`material-symbols-outlined text-2xl transition-colors ${
          isActive ? "text-primary" : "group-hover:text-primary"
        }`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-bold tracking-tight leading-tight text-center">
        {label}
      </span>
    </button>
  );
}

function ToggleRow({
  icon,
  title,
  desc,
  enabled,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-5 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl">
      <div className="flex items-center gap-4">
        <span
          className={`material-symbols-outlined ${
            enabled ? "text-primary" : "text-slate-400"
          } text-xl transition-colors`}
        >
          {icon}
        </span>
        <div className="text-left">
          <p className="text-sm font-bold text-[var(--text-main)] leading-none mb-1.5">
            {title}
          </p>
          <p className="text-xs text-[var(--text-muted)] font-medium leading-tight">
            {desc}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 flex-shrink-0 ${
          enabled ? "bg-primary shadow-glow" : "bg-black/20 dark:bg-white/10"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
