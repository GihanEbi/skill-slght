"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BenefitsPage() {
  const [activeBenefits, setActiveBenefits] = useState(["Health Insurance"]);
  const [toggles, setToggles] = useState({
    flexible: true,
    remote: true,
    mental: false,
  });

  const toggleBenefit = (name: string) => {
    setActiveBenefits((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name],
    );
  };

  const router = useRouter();

  // navigate to benefits page on next step
  const handleNext = () => {
    router.push("/users/system/jobs/create/comp");
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl overflow-hidden">
      {/* --- Progress Stepper --- */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-8">
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <StepItem icon="check_circle" label="Details" completed/>
            <StepLine active />
            <StepItem icon="card_giftcard" label="Benefits" active />
            <StepLine />
            <StepItem icon="payments" label="Comp" />
            <StepLine />
            <StepItem icon="visibility" label="Preview" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start mb-24">
          {/* Main Form Area */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="mb-8 border-b border-[var(--border-subtle)] pb-6">
                <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 uppercase tracking-tighter">
                  Benefits & Perks
                </h1>
                <p className="text-[var(--text-muted)] font-medium">
                  Outline the unique value propositions for this role.
                </p>
              </div>

              <form className="space-y-10">
                {/* Standard Benefits Grid */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-5 uppercase tracking-[0.2em]">
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
                      label="Paid Time Off"
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
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-5 uppercase tracking-[0.2em]">
                    Work Life & Flexibility
                  </label>
                  <div className="space-y-4">
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
                      desc="Fully remote with no office requirement"
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

                {/* Custom Perks AI Input */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-3 uppercase tracking-[0.2em]">
                    Custom Perks
                  </label>
                  <div className="bg-black/10 dark:bg-black/40 border border-[var(--border-subtle)] rounded-2xl overflow-hidden focus-within:border-primary transition-all">
                    <div className="flex items-center gap-4 px-4 py-2 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                      <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary transition-colors">
                        format_bold
                      </span>
                      <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary transition-colors">
                        format_list_bulleted
                      </span>
                      <div className="h-4 w-px bg-[var(--border-subtle)] mx-2"></div>
                      <div className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-lg animate-pulse">
                          auto_fix_high
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Generate with AI
                        </span>
                      </div>
                    </div>
                    <textarea
                      className="w-full bg-transparent border-none text-[var(--text-main)] p-4 outline-none resize-none leading-relaxed placeholder:text-[var(--text-muted)]"
                      placeholder="Add gym memberships, stipends, or token allocations..."
                      rows={5}
                    ></textarea>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="col-span-12 lg:col-span-4 sticky top-24">
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
                      insights
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] uppercase tracking-wider text-xs">
                      Benefit Insights
                    </h3>
                    <p className="text-[10px] text-primary font-black animate-pulse">
                      COMPETITIVE ANALYSIS...
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] mb-4 uppercase tracking-[0.2em]">
                      Recommended for Web3
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-black/20 rounded-xl border border-primary/10">
                        <p className="text-xs font-black text-accent mb-1 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">
                            token
                          </span>{" "}
                          Token Allocation
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          90% of engineers expect equity/token grants.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-subtle)]">
                    <h4 className="text-[10px] font-black text-[var(--text-muted)] mb-3 uppercase tracking-widest">
                      Industry Ranking
                    </h4>
                    <div className="bg-black/20 rounded-xl p-3 border border-primary/5">
                      <div className="flex justify-between text-[10px] font-bold mb-2">
                        <span className="text-[var(--text-muted)] uppercase">
                          Perk Competitiveness
                        </span>
                        <span className="text-accent">Standard</span>
                      </div>
                      <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "66%" }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed">
                      "Adding Learning stipends would place this role in the top
                      15% of compensation packages."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- Sticky Footer --- */}
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => {
              router.push("/users/system/jobs/create/details");
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

function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          active
            ? "bg-primary text-white shadow-glow"
            : completed
              ? "bg-black/40 border border-primary/40 text-primary"
              : "bg-black/40 border border-[var(--border-subtle)] text-slate-500"
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-primary" : "text-slate-500"}`}
      >
        {label}
      </span>
    </div>
  );
}

function BenefitCard({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group ${
        isActive
          ? "border-primary bg-primary/10 text-[var(--text-main)] shadow-glow"
          : "border-[var(--border-subtle)] bg-black/10 hover:border-primary/50 text-[var(--text-muted)]"
      }`}
    >
      <span
        className={`material-symbols-outlined text-2xl transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`}
      >
        {icon}
      </span>
      <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
        {label}
      </span>
    </button>
  );
}

function ToggleRow({ icon, title, desc, enabled, onClick }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-black/10 dark:bg-black/30 border border-[var(--border-subtle)] rounded-2xl">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary/60">
          {icon}
        </span>
        <div>
          <p className="text-sm font-black text-[var(--text-main)]">{title}</p>
          <p className="text-[11px] text-[var(--text-muted)] font-medium">
            {desc}
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${enabled ? "bg-primary" : "bg-black/40 border border-[var(--border-subtle)]"}`}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
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
