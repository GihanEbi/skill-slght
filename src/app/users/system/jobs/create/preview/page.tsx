"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type FlowState = "idle" | "publishing" | "success";

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>("idle");

  const [hiringType, setHiringType] = useState<"internal" | "external">(
    "internal",
  );
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
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

  const handleStartPublish = () => {
    setShowPublishModal(false);
    setFlowState("publishing");
    setTimeout(() => setFlowState("success"), 2000);
  };

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p],
    );
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* --- 1. PUBLISH SETTINGS MODAL --- */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPublishModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel rounded-[2rem] p-8 md:p-10 shadow-2xl border-primary/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight mb-6">
                  Deployment Settings
                </h2>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[var(--text-muted)]">
                      Hiring Protocol
                    </label>
                    <div className="flex gap-3">
                      <TypeButtonSmall
                        label="Internal Only"
                        active={hiringType === "internal"}
                        onClick={() => setHiringType("internal")}
                      />
                      <TypeButtonSmall
                        label="External Public"
                        active={hiringType === "external"}
                        onClick={() => setHiringType("external")}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {hiringType === "external" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="text-xs font-bold text-[var(--text-muted)]">
                          Target Platforms
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["LinkedIn", "Indeed", "Glassdoor"].map((p) => (
                            <button
                              key={p}
                              onClick={() => togglePlatform(p)}
                              className={`px-4 py-2 rounded-xl border text-[11px] font-bold transition-all ${platforms.includes(p) ? "bg-primary/20 border-primary text-primary" : "bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-muted)]"}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3 relative">
                    <label className="text-xs font-bold text-[var(--text-muted)]">
                      Hiring Manager
                    </label>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="premium-input rounded-2xl py-3.5 px-5 text-sm font-semibold text-[var(--text-main)] flex items-center justify-between hover:border-primary/50 transition-all bg-[var(--surface)]"
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
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 5 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute w-full z-[110] rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden bg-[var(--surface)] p-1 mt-2"
                        >
                          {managers.map((m) => (
                            <button
                              key={m}
                              onClick={() => {
                                setSelectedManager(m);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl ${selectedManager === m ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                            >
                              {m}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--text-main)]">
                        Save as reusable template?
                      </span>
                      <button
                        onClick={() => setSaveAsTemplate(!saveAsTemplate)}
                        className={`w-11 h-6 rounded-full transition-all relative flex items-center px-1 ${saveAsTemplate ? "bg-primary shadow-glow" : "bg-black/10 dark:bg-white/10"}`}
                      >
                        <motion.div
                          animate={{ x: saveAsTemplate ? 20 : 0 }}
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="flex-1 py-3.5 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartPublish}
                    className="flex-[2] active-tab-gradient py-3.5 rounded-2xl text-white font-bold text-sm shadow-glow order-1 sm:order-2"
                  >
                    Confirm & Publish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 2. MODERN LOADER SCREEN --- */}
      <AnimatePresence>
        {flowState === "publishing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--background)]"
          >
            <div className="relative w-28 h-28">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-full h-full border-4 border-primary/10 border-t-primary rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl animate-pulse">
                  rocket_launch
                </span>
              </div>
            </div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-8 text-xs font-bold text-primary tracking-[0.3em] uppercase"
            >
              Publishing Job Post...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 3. SUCCESS MODAL --- */}
      <AnimatePresence>
        {flowState === "success" && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm glass-panel rounded-[2.5rem] p-10 text-center shadow-2xl border-primary/20"
            >
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-glow">
                <span className="material-symbols-outlined text-primary text-4xl">
                  verified
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Job Post Live
              </h2>
              <p className="text-sm text-[var(--text-muted)] font-medium mb-8">
                Successfully Published. Candidates can now initialize
                applications.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/users/system/jobs/active_jobs")}
                  className="w-full active-tab-gradient py-4 rounded-2xl text-white text-sm font-bold shadow-glow"
                >
                  View Active Listing
                </button>
                <button
                  onClick={() => router.push("/users/system/dashboard")}
                  className="w-full py-4 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MAIN PAGE CONTENT --- */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="check_circle" label="Details" completed />
          <StepLine active />
          <StepItem icon="check_circle" label="Benefits" completed />
          <StepLine active />
          <StepItem icon="check_circle" label="Compensation" completed />
          <StepLine active />
          <StepItem icon="visibility" label="Preview" active />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32">
          <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-xl border-[var(--border-subtle)]"
            >
              <div className="mb-8 flex flex-col md:flex-row justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] tracking-tight">
                    Review Job Post
                  </h1>
                  <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
                    Final visual validation before publishing.
                  </p>
                </div>
                <div className="flex bg-[var(--input-bg)] p-1.5 rounded-2xl border border-[var(--border-subtle)] self-start shadow-sm">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "desktop" ? "bg-primary text-white shadow-glow" : "text-[var(--text-muted)] hover:text-primary"}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "mobile" ? "bg-primary text-white shadow-glow" : "text-[var(--text-muted)] hover:text-primary"}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* BROWSER MOCKUP */}
              <motion.div
                animate={{ width: viewMode === "desktop" ? "100%" : "375px" }}
                className="mx-auto rounded-[2rem] overflow-hidden border border-[var(--border-subtle)] bg-[#0a0a0c] shadow-2xl transition-all duration-500"
              >
                <div className="bg-white/5 px-6 py-4 flex items-center gap-3 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                  </div>
                  <div className="mx-auto bg-white/5 px-4 py-1.5 rounded-lg text-[10px] text-slate-500 font-mono truncate max-w-[75%] border border-white/5">
                    careers.skill-slight.com/protocol-829
                  </div>
                </div>

                <div className="p-8 md:p-14 space-y-10 bg-gradient-to-b from-transparent to-primary/5">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold tracking-tight border border-primary/20">
                        Full-Time
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-tight border border-emerald-500/20">
                        Engineering
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight">
                      Senior Blockchain Engineer, <br />
                      <span className="text-primary">EVM Specialist</span>
                    </h2>
                    <div className="flex flex-wrap gap-8 text-slate-400 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">
                          location_on
                        </span>
                        Remote, Global
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">
                          payments
                        </span>
                        $145k — $190k • Equity
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div
                    className={`grid gap-10 ${viewMode === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}
                  >
                    <div className="md:col-span-2 space-y-8 text-slate-400 leading-relaxed text-sm">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">
                          Mission Overview
                        </h3>
                        <p>
                          Join our core engineering cell to optimize low-level
                          EVM protocols and scale decentralized intelligence
                          nodes across global networks.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-3">
                          Protocol Expertise
                        </h3>
                        <ul className="space-y-3 list-disc pl-5 marker:text-primary">
                          <li>Advanced proficiency in Rust and Solidity.</li>
                          <li>
                            Deep understanding of Zero-Knowledge proof
                            implementation.
                          </li>
                          <li>Experience architecting L2 scaling solutions.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <SidebarPreviewStat
                        title="Key Expertise"
                        items={["Rust", "Solidity", "ZK-Rollups"]}
                      />
                      <div className="grid grid-cols-1 gap-3">
                        <BenefitBadgePreview
                          icon="health_and_safety"
                          label="Global Health Insurance"
                        />
                        <BenefitBadgePreview
                          icon="flight_takeoff"
                          label="Unlimited Paid Leave"
                        />
                        <BenefitBadgePreview
                          icon="savings"
                          label="Equity & Token Grants"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* AI CHECKLIST SIDEPANEL - KEPT THE SHINE */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2.5rem] p-8 shadow-glow relative overflow-hidden border-primary/10"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      fact_check
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)] text-sm">
                      Publish Checklist
                    </h3>
                    <p className="text-[11px] text-primary font-bold tracking-tight">
                      System Ready
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <CheckItem label="Protocol fields verified" />
                  <CheckItem label="Compensation benchmarked" />
                  <CheckItem label="Candidate pipeline active" />
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-[var(--text-muted)] italic leading-relaxed font-medium">
                    "Everything looks optimized. Publishing will trigger 24-hour
                    review."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md z-[90]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm hover:text-[var(--text-main)] transition-all"
            onClick={() => router.back()}
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Back
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="active-tab-gradient px-12 py-3 rounded-xl text-white font-bold text-sm shadow-premium flex items-center gap-3 hover:translate-y-[-1px] transition-all"
          >
            Publish Job Post{" "}
            <span className="material-symbols-outlined text-lg">
              rocket_launch
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

// --- REFINED HELPER COMPONENTS ---

function TypeButtonSmall({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl border transition-all text-xs font-bold ${active ? "bg-primary text-white shadow-glow border-primary" : "bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-primary/40"}`}
    >
      {label}
    </button>
  );
}

function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-glow ring-4 ring-primary/10" : completed ? "bg-primary/20 text-primary border border-primary/10" : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"}`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[10px] font-bold hidden sm:block ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine({ active = false }: any) {
  return (
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-2 translate-y-[-14px]" />
  );
}

function CheckItem({ label }: any) {
  return (
    <div className="flex items-center gap-3 p-3.5 bg-[var(--input-bg)] rounded-2xl border border-emerald-500/10">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
        <span className="material-symbols-outlined text-[14px] font-bold">
          check
        </span>
      </div>
      <span className="text-[12px] font-semibold text-[var(--text-main)]">
        {label}
      </span>
    </div>
  );
}

function SidebarPreviewStat({ title, items }: any) {
  return (
    <div>
      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2.5">
        {items.map((i: any) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 transition-colors hover:border-primary/40"
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitBadgePreview({ icon, label }: any) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <span>{label}</span>
    </div>
  );
}
