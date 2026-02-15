"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BenefitsPage() {
  const [activeBenefits, setActiveBenefits] = useState(["Health Insurance"]);
  const [customPerks, setCustomPerks] = useState<string[]>([]);
  const [newPerkInput, setNewPerkInput] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiGenerateClick = async () => {
    setIsAiGenerating(true);
    // Simulate AI "Thinking" time
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsAiGenerating(false);
    setShowAiModal(true);
  };

  const [toggles, setToggles] = useState({
    flexible: true,
    remote: true,
    mental: false,
  });
  const router = useRouter();

  // AI Recommendations Data
  const aiSuggestions = [
    "Token Allocation (0.1% - 0.5%)",
    "Home Office Stipend ($1.5k)",
    "Learning & Development Budget",
    "Gym & Wellness Membership",
    "Annual Company Retreat",
  ];

  const handleAddPerk = (perk: string) => {
    const trimmed = perk.trim();
    if (trimmed && !customPerks.includes(trimmed)) {
      setCustomPerks([trimmed, ...customPerks]); // Shows at the top
      setNewPerkInput("");
    }
  };

  const toggleBenefit = (name: string) => {
    setActiveBenefits((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  };

  const handleNext = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/create/comp"), 1000);
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
              {/* The Loader Ring */}
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
                      {/* Outer Spinning Ring */}
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      {/* Inner Icon */}
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

              {/* Status Text */}
              <div className="text-center">
                <motion.h3
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[var(--text-main)] font-bold text-lg tracking-tight"
                >
                  {isSaved ? "Protocol Secured" : "Synchronizing Details"}
                </motion.h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                  {isSaved
                    ? "Redirecting to Benefits..."
                    : "Updating recruitment benefits..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- AI Recommendations Modal --- */}
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
                      handleAddPerk(s);
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

      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="check_circle" label="Details" completed />
          <StepLine active />
          <StepItem icon="card_giftcard" label="Benefits" active />
          <StepLine />
          <StepItem icon="payments" label="Compensation" />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32 lg:pb-0">
          <div className="col-span-1 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl"
            >
              <div className="mb-10 border-b border-[var(--border-subtle)] pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                  Benefits & Perks
                </h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">
                  Define the unique value propositions that make this role stand
                  out.
                </p>
              </div>

              <div className="space-y-10">
                {/* Benefits Buttons */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-5 ml-1 tracking-tight">
                    Standard Benefits
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <BenefitCard
                      icon="health_and_safety"
                      label="Health Insurance"
                      isActive={activeBenefits.includes("Health Insurance")}
                      onClick={() => toggleBenefit("Health Insurance")}
                    />
                    <BenefitCard
                      icon="event_available"
                      label="Unlimited PTO"
                      isActive={activeBenefits.includes("Paid Time Off")}
                      onClick={() => toggleBenefit("Paid Time Off")}
                    />
                    <BenefitCard
                      icon="savings"
                      label="401k Matching"
                      isActive={activeBenefits.includes("401k Matching")}
                      onClick={() => toggleBenefit("401k Matching")}
                    />
                    <BenefitCard
                      icon="family_restroom"
                      label="Parental Leave"
                      isActive={activeBenefits.includes("Parental Leave")}
                      onClick={() => toggleBenefit("Parental Leave")}
                    />
                  </div>
                </div>

                {/* Work Life Flexibility */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-5 ml-1 tracking-tight">
                    Work Life & Flexibility
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    <ToggleRow
                      icon="schedule"
                      title="Flexible Hours"
                      desc="Autonomy to set your own working schedule"
                      enabled={toggles.flexible}
                      onClick={() =>
                        setToggles({ ...toggles, flexible: !toggles.flexible })
                      }
                    />
                    <ToggleRow
                      icon="public"
                      title="Remote First"
                      desc="Work from anywhere in the world"
                      enabled={toggles.remote}
                      onClick={() =>
                        setToggles({ ...toggles, remote: !toggles.remote })
                      }
                    />
                    <ToggleRow
                      icon="self_improvement"
                      title="Mental Health Days"
                      desc="Dedicated quarterly rejuvenation leave"
                      enabled={toggles.mental}
                      onClick={() =>
                        setToggles({ ...toggles, mental: !toggles.mental })
                      }
                    />
                  </div>
                </div>

                {/* --- Additional Perks Interactive Card --- */}
                <div className="space-y-3">
                  {/* <label className="block text-xs font-bold text-[var(--text-muted)] ml-1">
                    Additional Perks
                  </label> */}
                  <div className="glass-panel rounded-2xl overflow-hidden border-[var(--border-subtle)] focus-within:ring-1 focus-within:ring-primary/30 transition-all relative">
                    {/* --- Localized AI Loader --- */}
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

                    {/* Card Header */}
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

                    {/* Card Body */}
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
                                  onClick={() =>
                                    setCustomPerks(
                                      customPerks.filter((p) => p !== perk),
                                    )
                                  }
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
                            e.key === "Enter" && handleAddPerk(newPerkInput)
                          }
                        />
                        <button
                          onClick={() => handleAddPerk(newPerkInput)}
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

          {/* AI Sidebar */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden border-primary/10"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
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
                      Recommendation
                    </h4>
                    <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-primary/20">
                      <p className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">
                          token
                        </span>
                        Token Allocation
                      </p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                        90% of engineers at this level expect token grants.
                        Adding this increases reach by 45%.
                      </p>
                    </div>
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
                        animate={{ width: "66%" }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-xs text-[var(--text-muted)] italic leading-relaxed text-center font-medium">
                      "Including Learning stipends would place this package in
                      the{" "}
                      <span className="text-primary font-bold">top 15%</span> of
                      Web3 protocols."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md z-[90]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm"
            onClick={() => router.push("/users/system/jobs/create/details")}
          >
            <span className="material-symbols-outlined">arrow_back</span>Back
          </button>
          <div className="flex gap-4">
            <button className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm">
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

function StepItem({ icon, label, active = false, completed = false }: any) {
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
        className={`text-[10px] font-bold hidden sm:block tracking-tight ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepLine({ active = false }: any) {
  return (
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-2 translate-y-[-12px] sm:translate-y-[-14px]" />
  );
}

function BenefitCard({ icon, label, isActive, onClick }: any) {
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
        className={`material-symbols-outlined text-2xl transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-bold tracking-tight leading-tight">
        {label}
      </span>
    </button>
  );
}

function ToggleRow({ icon, title, desc, enabled, onClick }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl">
      <div className="flex items-center gap-4">
        <span
          className={`material-symbols-outlined ${enabled ? "text-primary" : "text-slate-400"} text-xl transition-colors`}
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
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 flex-shrink-0 ${enabled ? "bg-primary shadow-glow" : "bg-black/20 dark:bg-white/10"}`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
