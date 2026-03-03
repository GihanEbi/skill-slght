"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { motion, AnimatePresence } from "framer-motion";

const proficiencies = ["beginner", "intermediate", "advanced", "expert"];

export default function SkillsStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();
  const [skillInput, setSkillInput] = useState("");
  const [proficiency, setProficiency] = useState("intermediate");
  const [years, setYears] = useState<number>(3);

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const newSkill = {
        skillName: skillInput.trim(),
        proficiency: proficiency as any,
        yearsOfExperience: years,
      };
      updateStepData("step3", {
        skills: [...formData.step3.skills, newSkill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    updateStepData("step3", {
      skills: formData.step3.skills.filter((_, i) => i !== index),
    });
  };

  const handleNext = () => {
    syncToMaster();
    const nextPath = "/users/system/candidates/Add_candidate/work_experience";
    router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
  };

  const handleBack = () => {
    const prevPath =
      "/users/system/candidates/Add_candidate/current_role_availability";
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
                Skills Inventory
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Categorize the candidate's core competencies for semantic
                matching with job requirements.
              </p>
            </div>

            <div className="space-y-12">
              <section className="space-y-8 glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle) bg-(--surface)/40 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. React.js, Python"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Years Exp.
                    </label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                    Proficiency Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {proficiencies.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProficiency(p)}
                        className={`flex-1 min-w-[100px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          proficiency === p
                            ? "bg-primary text-white shadow-glow border-primary"
                            : "bg-(--surface) text-(--text-muted) border-(--border-subtle) hover:border-primary/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddSkill}
                  className="w-full py-4 rounded-2xl bg-primary/5 text-primary font-bold text-sm border-2 border-dashed border-primary/20 hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Inject Skill Definition
                </button>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-primary/80 ml-1">
                  Active Skill Set ({formData.step3.skills.length})
                </h3>
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence mode="popLayout">
                    {formData.step3.skills.map((s, i) => (
                      <motion.div
                        key={i}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="group flex flex-col p-4 rounded-2xl bg-(--surface) border border-(--border-subtle) hover:border-primary/40 transition-all min-w-[140px] shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-(--text-main) truncate max-w-[100px]">
                            {s.skillName}
                          </span>
                          <button
                            onClick={() => removeSkill(i)}
                            className="text-(--text-muted) hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
                            {s.proficiency}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-(--border-subtle)" />
                          <span className="text-[9px] font-bold text-(--text-muted) uppercase tracking-widest">
                            {s.yearsOfExperience}y Exp
                          </span>
                        </div>
                        <div className="w-full h-1 bg-(--background) rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-primary shadow-glow"
                            style={{
                              width: `${s.proficiency === "expert" ? 100 : s.proficiency === "advanced" ? 75 : s.proficiency === "intermediate" ? 50 : 25}%`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
                      app_registration
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      Competency
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Skill Matrix
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed font-medium">
                    {formData.step3.skills.length > 0
                      ? `${formData.step3.skills.length} skills indexed. High compatibility detected.`
                      : "Define competencies to calculate candidate-job fit score."}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Skill Dashboard
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Expert"
                  value={formData.step3.skills
                    .filter((s) => s.proficiency === "expert")
                    .length.toString()}
                />
                <SummaryRow
                  label="Advanced"
                  value={formData.step3.skills
                    .filter((s) => s.proficiency === "advanced")
                    .length.toString()}
                />
                <SummaryRow
                  label="Total Skills"
                  value={formData.step3.skills.length.toString()}
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
            Next: Work History
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
      <span className="text-xs font-bold text-(--text-main) text-right">
        {value}
      </span>
    </div>
  );
}
