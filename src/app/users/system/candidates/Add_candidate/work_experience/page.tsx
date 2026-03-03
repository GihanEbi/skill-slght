"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkExperienceStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();

  const addExperience = () => {
    const newExp = {
      companyName: "",
      jobTitle: "",
      startDate: new Date(),
      isCurrent: false,
      location: "",
      description: "",
      id: Math.random().toString(36).substr(2, 9),
    };
    updateStepData("step4", {
      workExperience: [...formData.step4.workExperience, newExp],
    });
  };

  const updateExperience = (index: number, data: any) => {
    const list = [...formData.step4.workExperience];
    list[index] = { ...list[index], ...data };
    updateStepData("step4", { workExperience: list });
  };

  const removeExperience = (index: number) => {
    updateStepData("step4", {
      workExperience: formData.step4.workExperience.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleNext = () => {
    syncToMaster();
    const nextPath = "/users/system/candidates/Add_candidate/education";
    router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
  };

  const handleBack = () => {
    const prevPath = "/users/system/candidates/Add_candidate/skills";
    router.push(editId ? `${prevPath}?id=${editId}` : prevPath);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            <div className="mb-10 pb-4 border-b border-(--border-subtle)">
              <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
                Work Experience
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Map out the professional timeline and key contributions.
              </p>
            </div>

            <div className="space-y-10">
              <AnimatePresence>
                {formData.step4.workExperience.map(
                  (exp: any, index: number) => (
                    <motion.div
                      key={exp.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle) relative group bg-(--surface) shadow-sm"
                    >
                      <button
                        onClick={() => removeExperience(index)}
                        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/20"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>

                      <h3 className="text-xs font-black uppercase tracking-[2.5px] text-primary/80 mb-8 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center text-[11px]">
                          {index + 1}
                        </span>
                        Experience Block
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={exp.companyName}
                            onChange={(e) =>
                              updateExperience(index, {
                                companyName: e.target.value,
                              })
                            }
                            className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                            placeholder="e.g. OpenAI"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) =>
                              updateExperience(index, {
                                jobTitle: e.target.value,
                              })
                            }
                            className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                            placeholder="e.g. Lead Engineer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={
                              exp.startDate
                                ? new Date(exp.startDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              updateExperience(index, {
                                startDate: new Date(e.target.value),
                              })
                            }
                            className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                            End Date
                          </label>
                          <input
                            type="date"
                            disabled={exp.isCurrent}
                            value={
                              exp.endDate
                                ? new Date(exp.endDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              updateExperience(index, {
                                endDate: new Date(e.target.value),
                              })
                            }
                            className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                          <label className="flex items-center gap-2 mt-2 ml-1 cursor-pointer group/check">
                            <input
                              type="checkbox"
                              checked={!!exp.isCurrent}
                              onChange={(e) =>
                                updateExperience(index, {
                                  isCurrent: e.target.checked,
                                })
                              }
                              className="hidden"
                            />
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                exp.isCurrent
                                  ? "bg-primary border-primary"
                                  : "border-(--border-subtle)"
                              }`}
                            >
                              {exp.isCurrent && (
                                <span className="material-symbols-outlined text-[10px] text-white">
                                  check
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-(--text-muted) group-hover/check:text-primary transition-colors">
                              I currently work here
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                          Role Contribution
                        </label>
                        <textarea
                          value={exp.description || ""}
                          onChange={(e) =>
                            updateExperience(index, {
                              description: e.target.value,
                            })
                          }
                          className="premium-input rounded-xl py-4 px-5 text-sm font-medium text-(--text-main) min-h-[120px] leading-relaxed resize-none"
                          placeholder="Detailed highlight of your engineering feats..."
                        />
                      </div>
                    </motion.div>
                  ),
                )}
              </AnimatePresence>

              <button
                onClick={addExperience}
                className="w-full py-6 rounded-3xl bg-primary/5 text-primary font-bold text-sm border-2 border-dashed border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Register Additional Experience Block
              </button>
            </div>
          </motion.div>

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
                      work_history
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      Tenure Analysis
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Active Timeline
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed font-medium">
                    {formData.step4.workExperience.length > 0
                      ? `${formData.step4.workExperience.length} professional blocks defined.`
                      : "Add work history to analyze professional growth."}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                History Summary
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Latest Company"
                  value={formData.step4.workExperience[0]?.companyName || "—"}
                />
                <SummaryRow
                  label="Latest Role"
                  value={formData.step4.workExperience[0]?.jobTitle || "—"}
                />
                <SummaryRow
                  label="Total Items"
                  value={formData.step4.workExperience.length.toString()}
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

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
            Next: Academic Background
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
