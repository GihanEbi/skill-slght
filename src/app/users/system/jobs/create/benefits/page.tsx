"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BenefitsPage() {
  const [activeBenefits, setActiveBenefits] = useState(["Health Insurance"]);
  const [toggles, setToggles] = useState({
    flexible: true,
    remote: true,
    mental: false,
  });

  const router = useRouter();

  const toggleBenefit = (name: string) => {
    setActiveBenefits((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  };

  const handleNext = () => {
    router.push("/users/system/jobs/create/comp");
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* --- Progress Stepper --- */}
      <header className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative px-2">
          <StepItem icon="check_circle" label="Details" completed />
          <StepLine active />
          <StepItem icon="card_giftcard" label="Benefits" active />
          <StepLine />
          <StepItem icon="payments" label="Comp" />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start pb-32 lg:pb-0">
          {/* Main Form Area */}
          <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl"
            >
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-6">
                <h1 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-1 uppercase tracking-tighter">
                  Benefits & Perks
                </h1>
                <p className="text-xs md:text-sm text-[var(--text-muted)] font-medium">
                  Outline the unique value propositions for this role.
                </p>
              </div>

              <form className="space-y-8 md:space-y-10">
                {/* Standard Benefits Grid */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-5 uppercase tracking-[0.2em]">
                    Standard Benefits
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <BenefitCard
                      icon="health_and_safety"
                      label="Health"
                      isActive={activeBenefits.includes("Health Insurance")}
                      onClick={() => toggleBenefit("Health Insurance")}
                    />
                    <BenefitCard
                      icon="event_available"
                      label="PTO"
                      isActive={activeBenefits.includes("Paid Time Off")}
                      onClick={() => toggleBenefit("Paid Time Off")}
                    />
                    <BenefitCard
                      icon="savings"
                      label="401k"
                      isActive={activeBenefits.includes("401k Matching")}
                      onClick={() => toggleBenefit("401k Matching")}
                    />
                    <BenefitCard
                      icon="family_restroom"
                      label="Family"
                      isActive={activeBenefits.includes("Parental Leave")}
                      onClick={() => toggleBenefit("Parental Leave")}
                    />
                  </div>
                </div>

                {/* Work Life Flexibility */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-5 uppercase tracking-[0.2em]">
                    Work Life & Flexibility
                  </label>
                  <div className="space-y-3 md:space-y-4">
                    <ToggleRow
                      icon="schedule"
                      title="Flexible Hours"
                      desc="Set your own schedule"
                      enabled={toggles.flexible}
                      onClick={() =>
                        setToggles({ ...toggles, flexible: !toggles.flexible })
                      }
                    />
                    <ToggleRow
                      icon="public"
                      title="Remote First"
                      desc="No office requirement"
                      enabled={toggles.remote}
                      onClick={() =>
                        setToggles({ ...toggles, remote: !toggles.remote })
                      }
                    />
                    <ToggleRow
                      icon="self_improvement"
                      title="Mental Health"
                      desc="Quarterly rejuvenation leave"
                      enabled={toggles.mental}
                      onClick={() =>
                        setToggles({ ...toggles, mental: !toggles.mental })
                      }
                    />
                  </div>
                </div>

                {/* Custom Perks AI Input */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-3 uppercase tracking-[0.2em]">
                    Custom Perks
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
                      <div className="flex items-center gap-1.5 text-primary cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-sm animate-pulse">
                          auto_fix_high
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest">
                          AI Generate
                        </span>
                      </div>
                    </div>
                    <textarea
                      className="w-full bg-transparent border-none text-[var(--text-main)] p-4 md:p-6 outline-none resize-none leading-relaxed text-sm md:text-base font-medium placeholder:text-slate-400"
                      placeholder="Add stipends, token allocations, etc..."
                      rows={4}
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-6 md:p-8 shadow-glow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-xl">
                      insights
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] text-sm tracking-tight uppercase">
                      AI Assistant
                    </h3>
                    <p className="text-[8px] text-primary font-black animate-pulse uppercase tracking-widest">
                      Analyzing Benefits...
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-[var(--border-subtle)]">
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] mb-4 uppercase tracking-[0.2em]">
                      Recommended
                    </h4>
                    <div className="p-3 bg-[var(--input-bg)] rounded-xl border border-primary/10">
                      <p className="text-xs font-black text-accent mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">
                          token
                        </span>{" "}
                        Token Allocation
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                        90% of engineers expect equity/token grants in this
                        seniority level.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <div className="bg-[var(--input-bg)] rounded-xl p-3 border border-primary/5">
                      <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                        <span className="text-[var(--text-muted)]">
                          Perk Ranking
                        </span>
                        <span className="text-accent">Standard</span>
                      </div>
                      <div className="w-full h-1 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "66%" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed text-center">
                      "Adding Learning stipends would place this role in the top
                      15% of compensation packages."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- Sticky Footer --- */}
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-1 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => router.push("/users/system/jobs/create/details")}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-sm">
              arrow_back
            </span>
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="hidden sm:block px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase hover:bg-black/5">
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-6 md:px-10 py-3 rounded-xl text-white font-black text-[10px] tracking-[0.1em] uppercase flex items-center gap-2 shadow-premium hover:scale-[1.02] active:scale-95 transition-all"
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

function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5 z-10">
      <div
        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all ${
          active
            ? "bg-primary text-white shadow-glow scale-110"
            : completed
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50"
        }`}
      >
        <span className="material-symbols-outlined text-lg md:text-xl">
          {icon}
        </span>
      </div>
      <span
        className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest hidden sm:block ${active ? "text-primary" : "text-[var(--text-muted)]"}`}
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

function BenefitCard({ icon, label, isActive, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border transition-all gap-1.5 md:gap-2 group ${
        isActive
          ? "border-primary bg-primary/10 text-[var(--text-main)] shadow-glow"
          : "border-[var(--border-subtle)] bg-[var(--input-bg)] hover:border-primary/50 text-[var(--text-muted)]"
      }`}
    >
      <span
        className={`material-symbols-outlined text-xl md:text-2xl transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}
      >
        {icon}
      </span>
      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tight leading-tight">
        {label}
      </span>
    </button>
  );
}

function ToggleRow({ icon, title, desc, enabled, onClick }: any) {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl">
      <div className="flex items-center gap-3">
        <span
          className={`material-symbols-outlined ${enabled ? "text-primary" : "text-slate-400"} text-lg md:text-xl transition-colors`}
        >
          {icon}
        </span>
        <div className="text-left">
          <p className="text-xs md:text-sm font-black text-[var(--text-main)] leading-none mb-1">
            {title}
          </p>
          <p className="text-[9px] md:text-[11px] text-[var(--text-muted)] font-medium leading-tight">
            {desc}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClick}
        className={`w-10 h-5 md:w-11 md:h-6 rounded-full transition-colors relative flex items-center px-1 flex-shrink-0 ${enabled ? "bg-primary shadow-glow" : "bg-black/20 dark:bg-white/10"}`}
      >
        <motion.div
          animate={{
            x: enabled
              ? typeof window !== "undefined" && window.innerWidth < 768
                ? 18
                : 20
              : 0,
          }}
          className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
