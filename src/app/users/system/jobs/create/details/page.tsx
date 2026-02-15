"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const jobTemplates = [
  { id: 1, title: "Blockchain Engineer", dept: "Engineering", icon: "hub" },
  { id: 2, title: "Product Designer", dept: "Product", icon: "palette" },
  { id: 3, title: "Smart Auditor", dept: "Security", icon: "verified_user" },
  { id: 4, title: "Frontend Lead", dept: "Engineering", icon: "terminal" },
];

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Security",
];

export default function CreateJobPage() {
  const [showModal, setShowModal] = useState(true);
  const [skills, setSkills] = useState([
    "Solidity",
    "EVM Architecture",
    "Cryptography",
  ]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState(""); // State for textarea
  const router = useRouter();

  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("Engineering");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false); // AI Loading state

  const handleAiRefine = async () => {
    setIsAiGenerating(true);

    // Simulate AI generation time
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const generatedText = `We are seeking a visionary ${jobTitle || "Protocol Engineer"} to join our core team. In this role, you will architect scalable ${selectedDept} solutions, focusing on low-level optimization and high-security standards. You will collaborate with our cross-functional teams to deploy next-generation protocols and lead technical discussions in our decentralized environment.`;

    setJobDescription(generatedText);
    setIsAiGenerating(false);
  };

  const handleNext = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaved(true);
    setTimeout(() => {
      router.push("/users/system/jobs/create/benefits");
    }, 1000);
  };

  const selectTemplate = (title: string) => {
    setJobTitle(title);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* --- Full Page Loader Overlay --- */}
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
                      key="loading-spinner"
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
                      key="saved-check"
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
                  {isSaved ? "Job Post Secured" : "Synchronizing Details"}
                </motion.h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                  {isSaved
                    ? "Redirecting to Benefits..."
                    : "Updating recruitment details..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Template Selection Popup --- */}
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
                  <span className="material-symbols-outlined text-primary text-2xl">
                    auto_awesome
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] tracking-tight mb-2">
                  Start with a{" "}
                  <span className="text-primary font-extrabold">Template</span>
                </h2>
                <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto text-sm">
                  Choose a pre-configured job post to accelerate your hiring
                  process.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {jobTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template.title)}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-primary/50 hover:bg-[var(--surface)] transition-all text-left shadow-sm"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[var(--surface)] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-[var(--border-subtle)]">
                      <span className="material-symbols-outlined text-xl">
                        {template.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">
                        {template.title}
                      </p>
                      <p className="text-[11px] font-semibold text-[var(--text-muted)] opacity-70 tracking-tight">
                        {template.dept}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 rounded-xl active-tab-gradient text-white font-bold text-sm shadow-glow"
                >
                  Create Blank Job
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32 lg:pb-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="col-span-1 lg:col-span-8 glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl order-2 lg:order-1"
          >
            <div className="mb-10 pb-2 border-b border-[var(--border-subtle)]">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Job Details
              </h1>
              <p className="text-sm text-[var(--text-muted)] font-medium">
                Define the core parameters for your AI-driven recruitment.
              </p>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                  Job Title
                </label>
                <input
                  className="premium-input rounded-xl md:rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-lg md:text-xl font-bold text-[var(--text-main)] transition-all placeholder:font-medium placeholder:opacity-30"
                  placeholder="e.g. Lead Blockchain Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3 relative">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                    Department
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                    className="premium-input rounded-xl py-3.5 px-5 font-semibold text-[var(--text-main)] flex items-center justify-between hover:border-primary/50 transition-all text-sm md:text-base"
                  >
                    <span>{selectedDept}</span>
                    <motion.span
                      animate={{ rotate: isDeptOpen ? 180 : 0 }}
                      className="material-symbols-outlined text-primary"
                    >
                      expand_more
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isDeptOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute w-full z-[110] bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden p-1"
                      >
                        {departments.map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setSelectedDept(dept);
                              setIsDeptOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors rounded-xl ${selectedDept === dept ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                          >
                            {dept}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                    Location Type
                  </label>
                  <div className="flex gap-2 h-[52px]">
                    <TypeButton icon="home" label="Remote" />
                    <TypeButton icon="apartment" label="Hybrid" active />
                    <TypeButton icon="corporate_fare" label="Onsite" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                  Required Expertise
                </label>
                <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl p-5 min-h-[140px] focus-within:border-primary/40 transition-all shadow-sm">
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold"
                      >
                        {skill}
                        <span
                          className="material-symbols-outlined text-sm cursor-pointer opacity-70 hover:opacity-100"
                          onClick={() =>
                            setSkills(skills.filter((s) => s !== skill))
                          }
                        >
                          close
                        </span>
                      </div>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] bg-transparent border-none text-[var(--text-main)] font-semibold text-sm outline-none px-1"
                      placeholder="Add custom skill..."
                    />
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-tight mb-3">
                      AI Recommendations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Hardhat", "Rust", "Go"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] text-[11px] font-bold hover:border-primary/40 hover:text-primary transition-all"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Context & Mission Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-muted)] ml-1">
                  Job Description
                </label>
                <div className="glass-panel rounded-2xl overflow-hidden border-[var(--border-subtle)] focus-within:ring-1 focus-within:ring-primary/30 transition-all relative">
                  {/* --- AI Description Loader --- */}
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
                            AI is Drafting Mission
                          </p>
                          <p className="text-[9px] text-[var(--text-muted)] font-medium">
                            Generating context...
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-5 px-5 py-2.5 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer">
                      format_bold
                    </span>
                    <span className="material-symbols-outlined text-slate-400 text-lg cursor-pointer">
                      format_list_bulleted
                    </span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={handleAiRefine}
                      disabled={isAiGenerating}
                      className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-lg animate-pulse">
                        auto_fix_high
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        AI Generate
                      </span>
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none text-[var(--text-main)] p-6 outline-none resize-none text-base font-medium leading-relaxed placeholder:opacity-40"
                    rows={6}
                    placeholder="Describe the mission, challenges, and daily protocol..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2"
          >
            <div className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden border-primary/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
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
                    <h4 className="text-xs font-bold text-[var(--text-muted)] mb-4 tracking-tight">
                      Market Velocity
                    </h4>
                    <div className="bg-[var(--input-bg)] rounded-xl p-4 border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-[11px] font-bold mb-2">
                        <span className="text-[var(--text-muted)]">Demand</span>
                        <span className="text-accent">High Potential</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-[var(--text-muted)] italic leading-relaxed text-center font-medium">
                      "Including{" "}
                      <span className="text-primary font-bold">Rust</span> and{" "}
                      <span className="text-primary font-bold">Go</span>{" "}
                      expertise typically increases candidate quality by 40% for
                      this role."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

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
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm hover:bg-black/5 transition-all">
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:translate-y-[-1px] transition-all shadow-premium"
              onClick={handleNext}
              disabled={isProcessing}
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

function StepItem({ icon, label, active = false }: any) {
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

function TypeButton({ icon, label, active = false }: any) {
  return (
    <button
      type="button"
      className={`flex-1 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
        active
          ? "border-primary bg-primary/10 text-primary shadow-glow"
          : "border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-muted)] opacity-70 hover:opacity-100 hover:border-primary/30"
      }`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span className="text-[10px] font-bold tracking-tight">{label}</span>
    </button>
  );
}
