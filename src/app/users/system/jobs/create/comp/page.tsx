"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CompensationPage() {
  const [minSalary, setMinSalary] = useState(120000);
  const [maxSalary, setMaxSalary] = useState(180000);
  const [toggles, setToggles] = useState({
    bonus: true,
    signing: false,
    equity: true,
  });

  const router = useRouter();

  // navigate to benefits page on next step
  const handleNext = () => {
    router.push("/users/system/jobs/create/preview");
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl overflow-hidden">
      {/* --- Progress Stepper --- */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-8">
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <StepItem icon="check_circle" label="Details" completed />
            <StepLine active />
            <StepItem icon="card_giftcard" label="Benefits" completed />
            <StepLine active />
            <StepItem icon="payments" label="Comp" active />
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
                  Compensation & Financials
                </h1>
                <p className="text-[var(--text-muted)] font-medium">
                  Provide salary range, bonuses, and equity details.
                </p>
              </div>

              <form className="space-y-10">
                {/* Salary Range Section */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-6 uppercase tracking-[0.2em]">
                    Salary Range
                  </label>
                  <div className="space-y-8 p-6 bg-black/20 dark:bg-black/40 rounded-2xl border border-primary/10">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="w-full md:flex-1">
                        <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-black uppercase tracking-wider">
                          Currency
                        </label>
                        <select className="w-full bg-black/20 border border-primary/20 rounded-xl py-3 px-4 text-[var(--text-main)] text-sm focus:border-primary outline-none">
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>
                      <div className="w-full md:flex-[2]">
                        <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-black uppercase tracking-wider">
                          Minimum Salary
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                            $
                          </span>
                          <input
                            className="w-full bg-black/20 border border-primary/20 rounded-xl py-3 pl-7 pr-4 text-[var(--text-main)] text-sm focus:border-primary outline-none font-bold"
                            type="number"
                            value={minSalary}
                            onChange={(e) =>
                              setMinSalary(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="w-full md:flex-[2]">
                        <label className="block text-[10px] text-[var(--text-muted)] mb-1 font-black uppercase tracking-wider">
                          Maximum Salary
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">
                            $
                          </span>
                          <input
                            className="w-full bg-black/20 border border-primary/20 rounded-xl py-3 pl-7 pr-4 text-[var(--text-main)] text-sm focus:border-primary outline-none font-bold"
                            type="number"
                            value={maxSalary}
                            onChange={(e) =>
                              setMaxSalary(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Visual Range Slider */}
                    <div className="px-2">
                      <div className="relative h-2 bg-primary/10 rounded-full w-full">
                        <div className="absolute inset-0 bg-primary/40 rounded-full left-[25%] right-[35%]"></div>
                        <div className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -top-1.5 left-[25%] cursor-pointer shadow-lg hover:scale-110 transition-transform"></div>
                        <div className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full -top-1.5 right-[35%] cursor-pointer shadow-lg hover:scale-110 transition-transform"></div>
                      </div>
                      <div className="flex justify-between mt-4 text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest">
                        <span>$50k</span>
                        <span>$150k</span>
                        <span>$250k+</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bonus & Equity Toggles */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-5 uppercase tracking-[0.2em]">
                    Bonus & Equity
                  </label>
                  <div className="space-y-4">
                    <ToggleRow
                      icon="trending_up"
                      title="Performance Bonus"
                      desc="Annual reward based on targets"
                      enabled={toggles.bonus}
                      onClick={() =>
                        setToggles({ ...toggles, bonus: !toggles.bonus })
                      }
                    />
                    <ToggleRow
                      icon="verified"
                      title="Signing Bonus"
                      desc="One-time payment upon joining"
                      enabled={toggles.signing}
                      onClick={() =>
                        setToggles({ ...toggles, signing: !toggles.signing })
                      }
                    />
                    <ToggleRow
                      icon="pie_chart"
                      title="Stock Options / Equity"
                      desc="Standard 4-year vesting schedule"
                      enabled={toggles.equity}
                      onClick={() =>
                        setToggles({ ...toggles, equity: !toggles.equity })
                      }
                    />
                  </div>
                </div>

                {/* AI Input */}
                <div>
                  <label className="block text-[10px] font-black text-[var(--text-muted)] mb-3 uppercase tracking-[0.2em]">
                    Additional Financial Details
                  </label>
                  <div className="bg-black/10 dark:bg-black/40 border border-primary/20 rounded-2xl overflow-hidden focus-within:border-primary transition-all">
                    <div className="flex items-center gap-4 px-4 py-2 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                      <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary transition-colors">
                        format_bold
                      </span>
                      <span className="material-symbols-outlined text-[var(--text-muted)] cursor-pointer hover:text-primary transition-colors">
                        link
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
                      placeholder="Describe 401k match, relocation assistance, etc..."
                      rows={5}
                    ></textarea>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>

          {/* AI Market Data Sidebar */}
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
                      analytics
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] uppercase tracking-wider text-xs">
                      Market Data
                    </h3>
                    <p className="text-[10px] text-primary font-black animate-pulse uppercase">
                      Live Benchmarks...
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
                  <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                    Global Ranges
                  </h4>

                  <MarketBenchmark
                    location="San Francisco, CA"
                    range="$165k - $210k"
                  />
                  <MarketBenchmark
                    location="Remote (Global)"
                    range="$130k - $175k"
                  />

                  <div className="pt-6 border-t border-[var(--border-subtle)]">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-[var(--text-muted)]">
                        Offer Strength
                      </span>
                      <span className="text-accent">Top 15%</span>
                    </div>
                    <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed text-center">
                      "Your current range is highly competitive. Increasing
                      equity by 0.1% puts this in the 95th percentile."
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
              router.push("/users/system/jobs/create/benefits");
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

function MarketBenchmark({ location, range }: any) {
  return (
    <div className="p-3 bg-black/20 rounded-xl border border-primary/10">
      <p className="text-xs font-black text-[var(--text-main)] mb-1 uppercase tracking-tight">
        {location}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">
          Avg. Base Salary
        </p>
        <p className="text-xs font-black text-accent">{range}</p>
      </div>
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
