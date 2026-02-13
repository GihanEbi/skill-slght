"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
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
  const router = useRouter();

  // Custom Dropdown State
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("Engineering");

  const handleNext = () => router.push("/users/system/jobs/create/benefits");
  const selectTemplate = (title: string) => {
    setJobTitle(title);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-[2rem] p-6 md:p-10 shadow-premium overflow-hidden border-primary/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 text-center mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    auto_awesome
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-2">
                  Start with a <span className="text-primary">Template</span>
                </h2>
                <p className="text-[var(--text-muted)] font-medium max-w-md mx-auto text-xs md:text-sm">
                  Choose a configured protocol to accelerate your hiring.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {jobTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template.title)}
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-subtle)] hover:border-primary transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        {template.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-main)] uppercase leading-none mb-1">
                        {template.title}
                      </p>
                      <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                        {template.dept}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow"
                >
                  Create Blank
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black/5"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Stepper Header --- */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="description" label="Details" active />
          <StepLine />
          <StepItem icon="card_giftcard" label="Benefits" />
          <StepLine />
          <StepItem icon="payments" label="Comp" />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      {/* --- Form Main Area --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start pb-32 lg:pb-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="col-span-1 lg:col-span-8 glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl order-2 lg:order-1 overflow-visible"
          >
            <div className="mb-8 pb-6 border-b border-[var(--border-subtle)]">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-1 uppercase tracking-tighter">
                Job Details
              </h1>
              <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
                Define the core aspects for AI recruitment.
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Job Title
                </label>
                <input
                  className="premium-input rounded-xl md:rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-lg md:text-xl font-bold text-[var(--text-main)] transition-all"
                  placeholder="e.g. Lead Blockchain Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              {/* Grid: Dept & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 overflow-visible">
                {/* --- CUSTOM DEPARTMENT DROPDOWN --- */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                    Department
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsDeptOpen(!isDeptOpen)}
                    className="premium-input rounded-xl py-3.5 px-5 font-bold text-[var(--text-main)] flex items-center justify-between hover:border-primary transition-all text-sm md:text-base"
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
                        className="absolute w-full z-[110] glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1"
                      >
                        {departments.map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setSelectedDept(dept);
                              setIsDeptOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors rounded-xl ${selectedDept === dept ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                          >
                            {dept}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                    Location Type
                  </label>
                  <div className="flex gap-2">
                    <TypeButton icon="home" label="Remote" />
                    <TypeButton icon="apartment" label="Hybrid" active />
                    <TypeButton icon="corporate_fare" label="Onsite" />
                  </div>
                </div>
              </div>

              {/* Skills Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Required Expertise
                </label>
                <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl p-4 min-h-[140px] focus-within:border-primary/50 transition-all">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase"
                      >
                        {skill}
                        <span
                          className="material-symbols-outlined text-sm cursor-pointer"
                          onClick={() =>
                            setSkills(skills.filter((s) => s !== skill))
                          }
                        >
                          close
                        </span>
                      </div>
                    ))}
                    <input
                      className="flex-1 min-w-[100px] bg-transparent border-none text-[var(--text-main)] font-bold text-sm outline-none px-1"
                      placeholder="Add skill..."
                    />
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      AI Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Hardhat", "Rust", "Go"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] text-[9px] font-black uppercase hover:border-primary hover:text-primary transition-all"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Area */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Job Context
                </label>
                <div className="glass-panel rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                  <div className="flex items-center gap-4 px-4 py-2 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    <span className="material-symbols-outlined text-slate-500 text-sm">
                      format_bold
                    </span>
                    <span className="material-symbols-outlined text-slate-500 text-sm">
                      format_list_bulleted
                    </span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1.5 text-primary cursor-pointer">
                      <span className="material-symbols-outlined text-sm animate-pulse">
                        auto_fix_high
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        AI Refine
                      </span>
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none text-[var(--text-main)] p-4 md:p-6 outline-none resize-none text-sm md:text-base font-medium leading-relaxed"
                    rows={5}
                    placeholder="Describe the mission and daily protocol..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Sidepanel */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2"
          >
            <div className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] tracking-tight">
                      AI Assistant
                    </h3>
                    <p className="text-[10px] text-primary font-black animate-pulse uppercase">
                      Analyzing...
                    </p>
                  </div>
                </div>
                <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] mb-4 uppercase tracking-[0.2em]">
                      Market Velocity
                    </h4>
                    <div className="bg-[var(--input-bg)] rounded-xl p-4 border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                        <span className="text-[var(--text-muted)]">Demand</span>
                        <span className="text-accent">Extreme</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed text-center">
                      "Rust expertise is recommended to attract top Web3
                      engineers."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => router.back()}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase hover:bg-black/5 transition-all">
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-6 md:px-10 py-3 rounded-xl text-white font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-premium"
              onClick={handleNext}
            >
              Next Step{" "}
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

// --- Helper Components ---
function StepItem({ icon, label, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5 z-10">
      <div
        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-glow" : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50"}`}
      >
        <span className="material-symbols-outlined text-lg md:text-xl">
          {icon}
        </span>
      </div>
      <span
        className={`text-[8px] font-black uppercase tracking-widest hidden sm:block ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine() {
  return (
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-1 md:mx-2 translate-y-[-10px] sm:translate-y-[-12px]" />
  );
}

function TypeButton({ icon, label, active = false }: any) {
  return (
    <button
      type="button"
      className={`flex-1 py-2 md:py-3 px-1 rounded-xl border transition-all flex flex-col items-center gap-1 ${active ? "border-primary bg-primary/10 text-primary shadow-glow" : "border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-muted)]"}`}
    >
      <span className="material-symbols-outlined text-base md:text-lg">
        {icon}
      </span>
      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tight">
        {label}
      </span>
    </button>
  );
}
