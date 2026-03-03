"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { CandidateStatus } from "@/types/candidate_types";
import { motion, AnimatePresence } from "framer-motion";

const currencies = ["USD", "LKR", "EUR", "GBP", "INR", "AUD", "CAD"];

export default function CurrentRoleStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!formData.step2.availabilityStatus)
      newErrors.availabilityStatus = "Availability is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      syncToMaster(); // Auto-save to master database if editing
      const nextPath = "/users/system/candidates/Add_candidate/skills";
      router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
    }
  };

  const handleBack = () => {
    const prevPath = "/users/system/candidates/Add_candidate/basic_info";
    router.push(editId ? `${prevPath}?id=${editId}` : prevPath);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    updateStepData("step2", { [name]: value });
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateStepData("step2", {
      [name]: value === "" ? undefined : Number(value),
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Form Panel (8 cols) ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            <div className="mb-10 pb-4 border-b border-(--border-subtle)">
              <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
                Current Role & Availability
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Specify the candidate's professional status, financial
                expectations, and notice period.
              </p>
            </div>

            <div className="space-y-12">
              {/* Current Position Section */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Current Employment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Current Job Title
                    </label>
                    <input
                      type="text"
                      name="currentJobTitle"
                      value={formData.step2.currentJobTitle || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Current Company
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.step2.currentCompany || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. Techneura Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Current Salary
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        name="currentSalary"
                        value={formData.step2.currentSalary || ""}
                        onChange={handleNumericChange}
                        className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 pr-20"
                        placeholder="0.00"
                      />
                      <div className="absolute right-2 px-2">
                        <button
                          type="button"
                          onClick={() => setIsCurrencyOpen((o) => !o)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-primary/10 transition-colors text-primary font-bold text-xs"
                        >
                          {formData.step2.currentSalaryCurrency || "USD"}
                          <motion.span
                            animate={{ rotate: isCurrencyOpen ? 180 : 0 }}
                            className="material-symbols-outlined text-sm"
                          >
                            expand_more
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {isCurrencyOpen && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 4, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-24 z-110 bg-(--surface) rounded-xl border border-(--glass-border) shadow-2xl overflow-hidden p-1"
                              >
                                {currencies.map((curr) => (
                                  <button
                                    key={curr}
                                    type="button"
                                    onClick={() => {
                                      updateStepData("step2", {
                                        currentSalaryCurrency: curr,
                                      });
                                      setIsCurrencyOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-[11px] font-bold transition-colors rounded-lg ${formData.step2.currentSalaryCurrency === curr ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
                                  >
                                    {curr}
                                  </button>
                                ))}
                              </motion.div>
                              <div
                                className="fixed inset-0 z-100"
                                onClick={() => setIsCurrencyOpen(false)}
                              />
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Logistics & Timing Section */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Logistics & Timing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Availability Status{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsAvailabilityOpen((o) => !o)}
                        className={`w-full premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) flex items-center justify-between hover:border-primary/50 transition-all ${errors.availabilityStatus ? "border-red-400/60" : ""}`}
                      >
                        <span className="capitalize">
                          {formData.step2.availabilityStatus?.replace("_", " ")}
                        </span>
                        <motion.span
                          animate={{ rotate: isAvailabilityOpen ? 180 : 0 }}
                          className="material-symbols-outlined text-primary"
                        >
                          expand_more
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isAvailabilityOpen && (
                          <>
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 4 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute w-full z-110 bg-(--surface) rounded-2xl border border-(--glass-border) shadow-2xl overflow-hidden p-1 max-h-64 overflow-y-auto"
                            >
                              {[
                                "immediately",
                                "2_weeks",
                                "1_month",
                                "3_months",
                                "not_available",
                              ].map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    updateStepData("step2", {
                                      availabilityStatus: status,
                                    });
                                    setIsAvailabilityOpen(false);
                                    setErrors(
                                      ({ availabilityStatus, ...p }) => p,
                                    );
                                  }}
                                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors rounded-xl capitalize ${formData.step2.availabilityStatus === status ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
                                >
                                  {status.replace("_", " ")}
                                </button>
                              ))}
                            </motion.div>
                            <div
                              className="fixed inset-0 z-100"
                              onClick={() => setIsAvailabilityOpen(false)}
                            />
                          </>
                        )}
                      </AnimatePresence>
                      {errors.availabilityStatus && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] font-semibold text-red-500 ml-1 mt-2 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">
                            error
                          </span>
                          {errors.availabilityStatus}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Earliest Start Date
                    </label>
                    <input
                      type="date"
                      name="earliestStartDate"
                      value={
                        formData.step2.earliestStartDate
                          ? new Date(formData.step2.earliestStartDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                    Pipeline Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {Object.values(CandidateStatus).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateStepData("step2", { status })}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          formData.step2.status === status
                            ? "bg-primary text-white shadow-glow border-primary"
                            : "bg-(--surface) text-(--text-muted) border-(--border-subtle) hover:border-primary/30"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </motion.div>

          {/* ── Sidebar (4 cols) ───────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-10 space-y-6"
          >
            <div className="glass-panel rounded-4xl p-8 shadow-glow relative overflow-hidden border-primary/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      event_available
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      Readiness
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Status Monitor
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed font-medium">
                    The candidate is currently marked as{" "}
                    <span className="text-primary font-bold">
                      "{formData.step2.availabilityStatus?.replace("_", " ")}"
                    </span>{" "}
                    available.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Availability Summary
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Current Title"
                  value={formData.step2.currentJobTitle || "—"}
                />
                <SummaryRow
                  label="Notice"
                  value={
                    formData.step2.availabilityStatus?.replace("_", " ") || "—"
                  }
                />
                <SummaryRow
                  label="Salary"
                  value={
                    formData.step2.currentSalary
                      ? `${formData.step2.currentSalary} ${formData.step2.currentSalaryCurrency}`
                      : "—"
                  }
                />
                <SummaryRow
                  label="Start Date"
                  value={
                    formData.step2.earliestStartDate
                      ? new Date(
                          formData.step2.earliestStartDate,
                        ).toLocaleDateString()
                      : "Flexible"
                  }
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* ── Sticky Footer ────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-(--border-subtle) bg-(--background)/80 backdrop-blur-md z-90 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-(--text-muted) font-bold text-sm hover:text-(--text-main) transition-all group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-lg">
              arrow_back
            </span>
            Back
          </button>
          <button
            onClick={handleNext}
            className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:-translate-y-px transition-all shadow-premium"
          >
            Next: Skills Configuration
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
        {label}
      </span>
      <span className="text-xs font-bold text-(--text-main) text-right truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
