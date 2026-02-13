"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function CreateJobPage() {
  const [skills, setSkills] = useState([
    "Solidity",
    "EVM Architecture",
    "Cryptography",
  ]);
  const router = useRouter();

  // navigate to benefits page on next step
  const handleNext = () => {
    router.push("/users/system/jobs/create/benefits");
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl overflow-hidden">
      {/* --- Sticky Progress Header --- */}
      <header className="">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-center">
          <div className="flex items-center justify-between w-full max-w-3xl relative">
            <StepItem icon="description" label="Details" active />
            <StepLine  />
            <StepItem icon="card_giftcard" label="Benefits" />
            <StepLine />
            <StepItem icon="payments" label="Comp" />
            <StepLine />
            <StepItem icon="visibility" label="Preview" />
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="col-span-12 lg:col-span-8 glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl"
          >
            <div className="mb-10 pb-6 border-b border-[var(--border-subtle)]">
              <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 uppercase tracking-tighter">
                Job Details
              </h1>
              <p className="text-[var(--text-muted)] font-medium">
                Define the core aspects of the role for our AI recruitment
                protocol.
              </p>
            </div>

            <div className="space-y-8">
              {/* Job Title */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Job Title
                </label>
                <input
                  className="w-full bg-black/10 dark:bg-black/40 border border-[var(--border-subtle)] rounded-2xl py-4 px-6 text-xl font-bold text-[var(--text-main)] outline-none glow-input transition-all"
                  placeholder="e.g. Lead Blockchain Engineer"
                  defaultValue=""
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Department */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                    Department
                  </label>
                  <div className="relative">
                    <select className="w-full bg-black/10 dark:bg-black/40 border border-[var(--border-subtle)] rounded-2xl py-3.5 px-6 text-[var(--text-main)] font-bold outline-none appearance-none cursor-pointer glow-input">
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Design</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Location Type */}
                <div className="space-y-3">
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
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Required Expertise
                </label>
                <div className="bg-black/10 dark:bg-black/40 border border-[var(--border-subtle)] rounded-2xl p-4 min-h-[160px] glow-input">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black"
                      >
                        {skill.toUpperCase()}
                        <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-white transition-colors">
                          close
                        </span>
                      </div>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] bg-transparent border-none text-[var(--text-main)] font-bold text-sm outline-none px-2"
                      placeholder="Add expert skill..."
                    />
                  </div>
                  <div className="border-t border-[var(--border-subtle)] pt-4">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Suggested by AI
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Hardhat", "Rust", "Go", "Web3.js"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] text-[10px] font-black hover:border-primary hover:text-primary transition-all"
                        >
                          + {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                  Job Context
                </label>
                <div className="glass-panel rounded-2xl overflow-hidden group focus-within:ring-1 focus-within:ring-primary/50">
                  <div className="flex items-center gap-4 px-4 py-2 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                    <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary">
                      format_bold
                    </span>
                    <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary">
                      format_list_bulleted
                    </span>
                    <div className="h-4 w-px bg-[var(--border-subtle)] mx-1"></div>
                    <div className="flex items-center gap-2 text-primary cursor-pointer group/ai">
                      <span className="material-symbols-outlined animate-pulse">
                        auto_fix_high
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        AI Refine
                      </span>
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none text-[var(--text-main)] p-6 outline-none resize-none leading-relaxed font-medium"
                    rows={6}
                    placeholder="Describe the mission and daily protocol..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Sidepanel */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-4 lg:sticky lg:top-32"
          >
            <div className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full"></div>

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] tracking-tight">
                      AI Assistant
                    </h3>
                    <p className="text-[10px] text-primary font-black animate-pulse uppercase">
                      Protocol Analyzing...
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] mb-4 uppercase tracking-[0.2em]">
                      Market Velocity
                    </h4>
                    <div className="bg-black/10 dark:bg-black/40 rounded-xl p-4 border border-[var(--border-subtle)]">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-[var(--text-muted)]">
                          Candidate Demand
                        </span>
                        <span className="text-accent">Extreme</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed">
                      "Market data suggests including **Rust** expertise to
                      attract high-tier Web3 engineers for this specific title."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* --- Sticky Footer Actions --- */}
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => {
              router.back();
            }}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase hover:bg-[var(--surface)] transition-all">
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-10 py-3 rounded-xl text-white font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => {
                handleNext();
              }}
            >
              Next Step
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
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          active
            ? "bg-primary text-white shadow-glow"
            : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)]"
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine({ active = false }: any) {
  return (
    <div className="flex-1 h-px bg-[var(--border-subtle)] mx-2 overflow-hidden">
      {active && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          className="h-full bg-primary"
        />
      )}
    </div>
  );
}

function TypeButton({ icon, label, active = false }: any) {
  return (
    <button
      type="button"
      className={`flex-1 py-3 px-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${
        active
          ? "border-primary bg-primary/10 text-primary shadow-glow"
          : "border-[var(--border-subtle)] bg-black/5 text-[var(--text-muted)] hover:border-primary/50"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="text-[9px] font-bold uppercase">{label}</span>
    </button>
  );
}
