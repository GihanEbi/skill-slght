"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CompensationPage() {
  const router = useRouter();

  // --- States ---
  const [currency, setCurrency] = useState("USD");
  const [minSalary, setMinSalary] = useState(120000);
  const [maxSalary, setMaxSalary] = useState(180000);
  const [financialTags, setFinancialTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");

  const [showAiModal, setShowAiModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [toggles, setToggles] = useState({
    bonus: true,
    signing: false,
    equity: true,
  });

  // --- Logic ---
  const aiFinancialSuggestions = [
    "401k Matching (up to 4%)",
    "Relocation Assistance",
    "Performance-based Tokens",
    "Quarterly Profit Sharing",
    "Referral Bonus Program",
  ];

  // Currency logic: 1 USD = 300 LKR
  const handleCurrencyChange = (newCurr: string) => {
    if (newCurr === currency) return;

    // Extract code from string (e.g., "USD - US Dollar" -> "USD")
    const currCode = newCurr.split(" ")[0];

    if (currCode === "LKR") {
      setMinSalary((prev) => prev * 300);
      setMaxSalary((prev) => prev * 300);
    } else {
      setMinSalary((prev) => Math.round(prev / 300));
      setMaxSalary((prev) => Math.round(prev / 300));
    }
    setCurrency(currCode);
  };

  const symbol = currency === "USD" ? "$" : "LKR ";
  const sliderMax = currency === "USD" ? 300000 : 90000000;
  const sliderMin = currency === "USD" ? 50000 : 15000000;
  const sliderStep = currency === "USD" ? 5000 : 1500000;

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !financialTags.includes(trimmed)) {
      setFinancialTags([trimmed, ...financialTags]);
      setNewTagInput("");
    }
  };

  const handleAiGenerateClick = async () => {
    setIsAiGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAiGenerating(false);
    setShowAiModal(true);
  };

  const handleNext = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaved(true);
    setTimeout(() => router.push("/users/system/jobs/create/preview"), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl no-scrollbar bg-[var(--background)]">
      {/* --- Full Page Loader --- */}

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
                    ? "Redirecting to Preview..."
                    : "Updating recruitment composition..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- AI Suggestions Modal --- */}
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
                AI Financial Suggestions
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6 font-medium">
                Add market-standard incentives.
              </p>
              <div className="space-y-3">
                {aiFinancialSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      handleAddTag(s);
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
          <StepItem icon="check_circle" label="Benefits" completed />
          <StepLine active />
          <StepItem icon="payments" label="Compensation" active />
          <StepLine />
          <StepItem icon="visibility" label="Preview" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-32 lg:pb-0">
          <div className="col-span-1 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-xl"
            >
              <div className="mb-10 border-b border-[var(--border-subtle)] pb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                  Compensation & Financials
                </h1>
                <p className="text-sm text-[var(--text-muted)] font-medium">
                  Establish the baseline salary and incentives.
                </p>
              </div>

              <div className="space-y-12">
                {/* Salary Range Section */}
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-6 ml-1">
                    Salary Range
                  </label>
                  <div className="p-6 md:p-8 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-[2rem] space-y-10">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* --- CUSTOM CURRENCY DROPDOWN --- */}
                      <div className="w-full md:flex-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                          Currency
                        </span>
                        <ModernDropdown
                          selected={currency === "USD" ? "USD" : "LKR"}
                          setSelected={handleCurrencyChange}
                          options={["USD", "LKR"]}
                        />
                      </div>

                      <div className="flex-[2] space-y-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                          Min Base
                        </span>
                        <div className="relative">
                          <span
                            className={`absolute ${currency === "LKR" ? "left-3 text-[10px]" : "left-4 text-sm"} top-1/2 -translate-y-1/2 text-primary font-bold`}
                          >
                            {symbol}
                          </span>
                          <input
                            type="text"
                            value={minSalary.toLocaleString()}
                            readOnly
                            className={`premium-input rounded-xl py-3 ${currency === "LKR" ? "pl-14" : "pl-8"} pr-4 text-lg font-bold bg-[var(--surface)] w-full`}
                          />
                        </div>
                      </div>

                      <div className="flex-[2] space-y-2">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider ml-1">
                          Max Base
                        </span>
                        <div className="relative">
                          <span
                            className={`absolute ${currency === "LKR" ? "left-3 text-[10px]" : "left-4 text-sm"} top-1/2 -translate-y-1/2 text-primary font-bold`}
                          >
                            {symbol}
                          </span>
                          <input
                            type="text"
                            value={maxSalary.toLocaleString()}
                            readOnly
                            className={`premium-input rounded-xl py-3 ${currency === "LKR" ? "pl-14" : "pl-8"} pr-4 text-lg font-bold bg-[var(--surface)] w-full`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Salary Slider */}
                    <div className="px-4">
                      <div className="relative h-2 bg-primary/10 rounded-full">
                        <input
                          type="range"
                          min={sliderMin}
                          max={sliderMax}
                          step={sliderStep}
                          value={minSalary}
                          onChange={(e) =>
                            setMinSalary(
                              Math.min(
                                Number(e.target.value),
                                maxSalary - sliderStep,
                              ),
                            )
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20 slider-thumb-visible"
                        />
                        <input
                          type="range"
                          min={sliderMin}
                          max={sliderMax}
                          step={sliderStep}
                          value={maxSalary}
                          onChange={(e) =>
                            setMaxSalary(
                              Math.max(
                                Number(e.target.value),
                                minSalary + sliderStep,
                              ),
                            )
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none z-20 slider-thumb-visible"
                        />
                        <div
                          className="absolute h-full bg-primary rounded-full transition-all duration-75"
                          style={{
                            left: `${((minSalary - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
                            right: `${100 - ((maxSalary - sliderMin) / (sliderMax - sliderMin)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-6 text-[11px] font-bold text-[var(--text-muted)] opacity-60">
                        <span>
                          {symbol}
                          {sliderMin.toLocaleString()}
                        </span>
                        <span>
                          {symbol}
                          {sliderMax.toLocaleString()}+
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-2 ml-1">
                    Bonus & Equity
                  </label>
                  <ToggleRow
                    icon="trending_up"
                    title="Performance Bonus"
                    desc="Annual reward based on milestones"
                    enabled={toggles.bonus}
                    onClick={() =>
                      setToggles({ ...toggles, bonus: !toggles.bonus })
                    }
                  />
                  <ToggleRow
                    icon="verified"
                    title="Signing Bonus"
                    desc="One-time joining bonus"
                    enabled={toggles.signing}
                    onClick={() =>
                      setToggles({ ...toggles, signing: !toggles.signing })
                    }
                  />
                  <ToggleRow
                    icon="pie_chart"
                    title="Stock Options"
                    desc="Standard 4-year vesting"
                    enabled={toggles.equity}
                    onClick={() =>
                      setToggles({ ...toggles, equity: !toggles.equity })
                    }
                  />
                </div>

                {/* Additional Financial Details */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[var(--text-muted)] ml-1">
                    Additional Financial Details
                  </label>
                  <div className="glass-panel rounded-2xl border-[var(--border-subtle)] relative overflow-hidden focus-within:ring-1 focus-within:ring-primary/30 transition-all">
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
                              Identifying high-retention Benchmarking Market...
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between px-5 py-3 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Offer Add-ons
                      </span>
                      <button
                        onClick={handleAiGenerateClick}
                        className="flex items-center gap-2 text-primary hover:opacity-80 transition-all bg-transparent border-none outline-none"
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
                        {financialTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {financialTags.map((tag) => (
                              <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
                              >
                                {tag}
                                <span
                                  onClick={() =>
                                    setFinancialTags(
                                      financialTags.filter((t) => t !== tag),
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
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddTag(newTagInput)
                          }
                          placeholder="Add financial detail..."
                          className="flex-1 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary/40 transition-all placeholder:opacity-30"
                        />
                        <button
                          onClick={() => handleAddTag(newTagInput)}
                          className="px-5 py-3 rounded-xl bg-primary/10 text-primary font-bold text-xs border border-primary/20 hover:bg-primary/20 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-8 shadow-glow relative overflow-hidden border-primary/10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-2xl">
                      analytics
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)]">
                      Market Insights
                    </h3>
                    <p className="text-[11px] text-primary font-bold tracking-tight">
                      Live Benchmarks
                    </p>
                  </div>
                </div>
                <div className="space-y-6 pt-6 border-t border-[var(--border-subtle)]">
                  <MarketBenchmark
                    location="San Francisco, CA"
                    range="$165k - $210k"
                  />
                  <MarketBenchmark
                    location="Remote (Global)"
                    range="$130k - $175k"
                  />
                  <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 italic text-xs text-[var(--text-muted)] leading-relaxed text-center font-medium">
                    "Your range is{" "}
                    <span className="text-primary font-bold">12% above</span>{" "}
                    market average."
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--background)]/80 backdrop-blur-md z-[90]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-sm"
            onClick={() => router.push("/users/system/jobs/create/benefits")}
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

      {/* Slider Styling */}
      <style jsx>{`
        .slider-thumb-visible::-webkit-slider-thumb {
          pointer-events: all;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10b981;
          cursor: pointer;
          appearance: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
}

// --- Helper Components ---

function ModernDropdown({ label, selected, setSelected, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl px-4 h-[52px] flex items-center justify-between gap-3 hover:border-primary/50 transition-all shadow-sm"
      >
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-bold text-[var(--text-muted)] opacity-60 leading-none mb-1 uppercase tracking-tight">
            {label}
          </span>
          <span className="text-xs font-bold text-[var(--text-main)]">
            {selected}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="material-symbols-outlined text-primary text-xl"
        >
          expand_more
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 right-0 mt-2 glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1 z-[999]"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs font-semibold rounded-xl transition-colors ${
                  selected === opt
                    ? "text-primary bg-primary/10"
                    : "text-[var(--text-main)] hover:bg-primary/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-glow ring-4 ring-primary/10" : completed ? "bg-primary/20 text-primary border border-primary/10" : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50"}`}
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
    <div className="flex-1 h-[1px] bg-[var(--border-subtle)] mx-2 translate-y-[-14px]" />
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
          <p className="text-sm font-bold text-[var(--text-main)] mb-1">
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
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${enabled ? "bg-primary shadow-glow" : "bg-black/20 dark:bg-white/10"}`}
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
    <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--border-subtle)]">
      <p className="text-xs font-bold text-[var(--text-main)] mb-1">
        {location}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">
          Avg. Base
        </p>
        <p className="text-sm font-bold text-primary tracking-tight">{range}</p>
      </div>
    </div>
  );
}
