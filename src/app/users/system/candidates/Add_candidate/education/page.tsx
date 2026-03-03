"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { motion, AnimatePresence } from "framer-motion";

export default function EducationStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();

  const addEducation = () => {
    const newEdu = {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
    };
    updateStepData("step5", {
      education: [...formData.step5.education, newEdu],
    });
  };

  const updateEducation = (index: number, data: any) => {
    const list = [...formData.step5.education];
    list[index] = { ...list[index], ...data };
    updateStepData("step5", { education: list });
  };

  const removeEducation = (index: number) => {
    updateStepData("step5", {
      education: formData.step5.education.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    syncToMaster();
    const nextPath = "/users/system/candidates/Add_candidate/document_resume";
    router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
  };

  const handleBack = () => {
    const prevPath = "/users/system/candidates/Add_candidate/work_experience";
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
                Academic Background
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Verify educational milestones and academic focus.
              </p>
            </div>

            <div className="space-y-10">
              <AnimatePresence>
                {formData.step5.education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle) relative group bg-(--surface) shadow-sm"
                  >
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-6 right-6 w-8 h-8 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/20"
                    >
                      <span className="material-symbols-outlined text-sm">
                        close
                      </span>
                    </button>

                    <h3 className="text-[10px] font-black uppercase tracking-[2.5px] text-primary/80 mb-8 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                        0{index + 1}
                      </span>
                      Academic Block
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                          Institution Name
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(index, {
                              institution: e.target.value,
                            })
                          }
                          className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                          placeholder="e.g. Stanford University"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                          Degree / Qualification
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, { degree: e.target.value })
                          }
                          className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                          placeholder="e.g. Master of Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(index, {
                              fieldOfStudy: e.target.value,
                            })
                          }
                          className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div className="space-y-2 text-right">
                        <label className="text-[10px] font-bold text-(--text-muted) mr-1 uppercase tracking-wider">
                          Grade / GPA
                        </label>
                        <input
                          type="text"
                          value={edu.grade || ""}
                          onChange={(e) =>
                            updateEducation(index, { grade: e.target.value })
                          }
                          className="premium-input rounded-xl py-3 px-5 text-sm font-bold text-(--text-main) transition-all text-right placeholder:opacity-30"
                          placeholder="e.g. 4.0/4.0"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={addEducation}
                className="w-full py-6 rounded-3xl bg-primary/5 text-primary font-bold text-sm border-2 border-dashed border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">school</span>
                Log Additional Degree Block
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
                      school
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      Scholarly Depth
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Active Verifier
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed font-medium">
                    {formData.step5.education.length > 0
                      ? `${formData.step5.education.length} academic milestones logged.`
                      : "Record education history."}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Academic Summary
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Primary Inst."
                  value={formData.step5.education[0]?.institution || "—"}
                />
                <SummaryRow
                  label="Highest Degree"
                  value={formData.step5.education[0]?.degree || "—"}
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
            Next: Supporting Documents
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
