"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [hiringType, setHiringType] = useState<"internal" | "external">(
    "internal",
  );
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(
    "Alex Rivera (Product Lead)",
  );

  const router = useRouter();
  const managers = [
    "Alex Rivera (Product Lead)",
    "Sarah Chen (Engineering Manager)",
    "James Wilson (Talent Acquisition)",
  ];

  const handleNext = () => setShowPublishModal(true);

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* --- PUBLISH MODAL --- */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPublishModal(false);
                setIsDropdownOpen(false);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel rounded-[2rem] p-6 md:p-10 shadow-premium border-primary/20 overflow-visible max-h-[95vh] overflow-y-auto"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl font-black text-[var(--text-main)] dark:text-white uppercase tracking-tighter mb-6">
                  Deployment Settings
                </h2>

                <div className="space-y-6">
                  {/* Hiring Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                      Hiring Protocol
                    </label>
                    <div className="flex gap-3">
                      <TypeButtonSmall
                        label="Internal"
                        active={hiringType === "internal"}
                        onClick={() => setHiringType("internal")}
                      />
                      <TypeButtonSmall
                        label="External"
                        active={hiringType === "external"}
                        onClick={() => setHiringType("external")}
                      />
                    </div>
                  </div>

                  {/* Platforms (Conditional) */}
                  <AnimatePresence>
                    {hiringType === "external" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                          Target Platforms
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["LinkedIn", "Indeed", "Glassdoor"].map((p) => (
                            <button
                              key={p}
                              onClick={() => togglePlatform(p)}
                              className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${platforms.includes(p) ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-slate-500"}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CUSTOM HIRING MANAGER DROPDOWN */}
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                      Hiring Manager
                    </label>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl py-3.5 px-4 text-sm font-bold text-[var(--text-main)] flex items-center justify-between hover:border-primary/50 transition-all"
                    >
                      <span>{selectedManager}</span>
                      <motion.span
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        className="material-symbols-outlined text-primary"
                      >
                        expand_more
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 5 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute w-full z-[110] glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1"
                        >
                          {managers.map((manager) => (
                            <button
                              key={manager}
                              onClick={() => {
                                setSelectedManager(manager);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors rounded-xl ${selectedManager === manager ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                            >
                              {manager}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Save as Template */}
                  <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[var(--text-main)] uppercase tracking-widest">
                        Save as template?
                      </span>
                      <button
                        onClick={() => setSaveAsTemplate(!saveAsTemplate)}
                        className={`w-12 h-6 rounded-full transition-all relative ${saveAsTemplate ? "bg-primary shadow-glow" : "bg-black/20 dark:bg-white/10"}`}
                      >
                        <motion.div
                          animate={{ x: saveAsTemplate ? 26 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                    {saveAsTemplate && (
                      <motion.input
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        placeholder="Protocol Name"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl py-3 px-4 text-sm font-bold text-[var(--text-main)] outline-none focus:border-primary transition-all"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => router.push("/users/system/jobs/active_jobs")}
                    className="flex-[2] active-tab-gradient py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-glow order-1 sm:order-2"
                  >
                    Confirm & Publish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PROGRESS STEPPER --- */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="check_circle" label="Details" completed />
          <StepLine active />
          <StepItem icon="check_circle" label="Benefits" completed />
          <StepLine active />
          <StepItem icon="check_circle" label="Comp" completed />
          <StepLine active />
          <StepItem icon="visibility" label="Preview" active />
        </div>
      </header>

      {/* --- PREVIEW CONTENT --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start pb-32 lg:pb-0">
          <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-5 md:p-10 shadow-xl"
            >
              <div className="mb-6 border-b border-[var(--border-subtle)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-1 uppercase tracking-tighter">
                    Review Job Posting
                  </h1>
                  <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
                    Finalize how the job appears on your careers page.
                  </p>
                </div>

                <div className="flex items-center bg-black/5 dark:bg-black/40 p-1 rounded-xl border border-[var(--border-subtle)] self-start">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 uppercase tracking-wider transition-all ${viewMode === "desktop" ? "bg-primary text-white shadow-glow" : "text-[var(--text-muted)]"}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 uppercase tracking-wider transition-all ${viewMode === "mobile" ? "bg-primary text-white shadow-glow" : "text-[var(--text-muted)]"}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* Responsive Mockup Container */}
              <motion.div
                animate={{ width: viewMode === "desktop" ? "100%" : "375px" }}
                className="mx-auto rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0f0f13] shadow-premium transition-all duration-500"
              >
                <div className="bg-white/5 px-6 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="mx-auto bg-white/5 px-3 py-1 rounded text-[9px] text-slate-500 font-mono truncate max-w-[70%]">
                    careers.skill-slight.com/jobs/senior-ux-designer
                  </div>
                </div>
                <div className="p-8 md:p-12 space-y-8 bg-gradient-to-b from-transparent to-black/40">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                        Full-Time
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/20">
                        Design
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight tracking-tighter">
                      Senior Product Designer, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        User Experience
                      </span>
                    </h2>
                    <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          location_on
                        </span>{" "}
                        San Francisco, CA (Hybrid)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          payments
                        </span>{" "}
                        $165k — $210k • Equity
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-[var(--border-subtle)]"></div>
                  <div
                    className={`grid gap-8 ${viewMode === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}
                  >
                    <div className="md:col-span-2 space-y-6 text-sm leading-relaxed text-slate-400">
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                          About the Role
                        </h3>
                        <p>
                          We are looking for a visionary Senior Product
                          Designer. You will define the future of AI-driven
                          recruitment workflows.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                          Key Qualifications
                        </h3>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>5+ years of experience.</li>
                          <li>Expertise in Figma.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <SidebarStat
                        title="Core Skills"
                        items={["UX Research", "Visual Design", "Prototyping"]}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <BenefitBadge icon="health_and_safety" label="Health" />
                        <BenefitBadge icon="flight_takeoff" label="PTO" />
                        <BenefitBadge icon="laptop_mac" label="Hardware" />
                        <BenefitBadge icon="savings" label="401(k)" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* AI Checklist Sidebar */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-6 shadow-glow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white">
                      fact_check
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] uppercase tracking-wider text-xs">
                      Publish Checklist
                    </h3>
                    <p className="text-[10px] text-accent font-black">
                      READY TO DEPLOY
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <CheckItem label="All fields completed" />
                  <CheckItem label="Salary benchmarked" />
                  <CheckItem label="Keyword optimized" />
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed text-center">
                    "Everything looks solid! Expect matches within 24 hours."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-1 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => router.push("/users/system/jobs/create/comp")}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-sm">
              arrow_back
            </span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase hover:bg-black/5">
              Draft
            </button>
            <button
              className="active-tab-gradient px-6 md:px-10 py-3 rounded-xl text-white font-black text-[10px] tracking-[0.15em] uppercase flex items-center gap-2 shadow-premium"
              onClick={handleNext}
            >
              Publish{" "}
              <span className="material-symbols-outlined text-sm">
                rocket_launch
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarStat({ title, items }: any) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((i: any) => (
          <span
            key={i}
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitBadge({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <span>{label}</span>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function TypeButtonSmall({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${active ? "bg-primary text-white shadow-glow border-primary" : "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--text-muted)]"}`}
    >
      {label}
    </button>
  );
}
function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5 z-10">
      <div
        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-glow scale-110" : completed ? "bg-primary/20 text-primary border border-primary/30" : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50"}`}
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
function StepLine({ active = false }: any) {
  return (
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-1 md:mx-2 translate-y-[-10px] sm:translate-y-[-12px]" />
  );
}
function CheckItem({ label }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--input-bg)] rounded-xl border border-emerald-500/10">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
        <span className="material-symbols-outlined text-xs">check</span>
      </div>
      <span className="text-[11px] font-bold text-[var(--text-main)]">
        {label}
      </span>
    </div>
  );
}
