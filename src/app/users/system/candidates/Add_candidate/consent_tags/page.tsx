"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, resetForm, updateStepData } = useAddCandidate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const existingData = localStorage.getItem("all-candidates");
      let allCandidates = [];

      if (existingData) {
        try {
          allCandidates = JSON.parse(existingData);
          if (!Array.isArray(allCandidates)) allCandidates = [];
        } catch (e) {
          allCandidates = [];
        }
      }

      // Map Step-based Form Data to Core Candidate Model
      const isEditing = !!formData.id;
      const candidateProfile = {
        id:
          formData.id ||
          `CAND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        firstName: formData.step1.firstName,
        lastName: formData.step1.lastName,
        email: formData.step1.email,
        phone: formData.step1.phone,
        country: formData.step1.country,
        status: formData.step2.status, // Uses CandidateStatus enum
        skills: formData.step3.skills,
        workExperience: formData.step4.workExperience,
        education: formData.step5.education,
        profilePhotoUrl: "/images/avatar-img/avatar-1.jpg",
        createdAt: isEditing
          ? allCandidates.find((c: any) => c.id === formData.id)?.createdAt ||
            new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Keep step structure for easier future edits
        ...formData,
      };

      if (isEditing) {
        const index = allCandidates.findIndex((c: any) => c.id === formData.id);
        if (index !== -1) {
          allCandidates[index] = candidateProfile;
        } else {
          allCandidates.push(candidateProfile);
        }
      } else {
        allCandidates.push(candidateProfile);
      }
      localStorage.setItem("all-candidates", JSON.stringify(allCandidates));

      await new Promise((r) => setTimeout(r, 2000));
      setIsSuccess(true);
      await new Promise((r) => setTimeout(r, 1200));

      resetForm();
      router.push("/users/system/candidates/all_candidates");
    } catch (error) {
      console.error("Submission Error", error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const prevPath = "/users/system/candidates/Add_candidate/document_resume";
    router.push(editId ? `${prevPath}?id=${editId}` : prevPath);
  };

  const getEditPath = (path: string) => {
    return editId ? `${path}?id=${editId}` : path;
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* ── Submission Overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 bg-(--background)/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            {!isSuccess ? (
              <div className="flex flex-col items-center gap-8">
                <div className="w-24 h-24 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                    cloud_upload
                  </span>
                </div>
                <h3 className="text-2xl font-black text-(--text-main) tracking-widest uppercase mb-1">
                  Indexing Candidate Profile
                </h3>
                <p className="text-(--text-muted) font-bold uppercase text-[10px] tracking-[4px]">
                  Syncing to Talent Discovery Layer
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-glow">
                  <span className="material-symbols-outlined text-5xl text-white">
                    how_to_reg
                  </span>
                </div>
                <h3 className="text-3xl font-black text-(--text-main) tracking-tight uppercase mb-1">
                  Profile Synchronized
                </h3>
                <p className="text-(--text-muted) font-medium">
                  Redirecting to candidate intelligence pool...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 md:p-10 pb-32">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="mb-14 pb-6 border-b border-(--border-subtle) text-center">
            <h1 className="text-3xl md:text-5xl font-black text-(--text-main) mb-4 tracking-tight uppercase">
              Review Final Protocol
            </h1>
            <p className="text-sm text-(--text-muted) font-bold uppercase tracking-[4px]">
              Confirm information accuracy before deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReviewCard
              title="Identity & Contact"
              icon="fingerprint"
              items={[
                {
                  label: "Full Name",
                  value: `${formData.step1.firstName} ${formData.step1.lastName}`,
                },
                { label: "Primary Email", value: formData.step1.email },
                { label: "Region", value: formData.step1.country },
              ]}
              onEdit={() =>
                router.push(
                  getEditPath(
                    "/users/system/candidates/Add_candidate/basic_info",
                  ),
                )
              }
            />
            <ReviewCard
              title="Status & Logistics"
              icon="calendar_today"
              items={[
                {
                  label: "Availability",
                  value: formData.step2.availabilityStatus?.replace("_", " "),
                },
                {
                  label: "Salary Anchor",
                  value: formData.step2.currentSalary
                    ? `${formData.step2.currentSalary} ${formData.step2.currentSalaryCurrency}`
                    : "Not Disclosed",
                },
                {
                  label: "Current Node",
                  value: formData.step2.currentCompany || "N/A",
                },
              ]}
              onEdit={() =>
                router.push(
                  getEditPath(
                    "/users/system/candidates/Add_candidate/current_role_availability",
                  ),
                )
              }
            />
            <ReviewCard
              title="Intelligence Core"
              icon="psychology"
              items={[
                {
                  label: "Mapped Skills",
                  value: `${formData.step3.skills.length} competencies registered`,
                },
                {
                  label: "Top Skill",
                  value: formData.step3.skills[0]?.skillName || "N/A",
                },
                {
                  label: "Total Tenure",
                  value: `${formData.step4.workExperience.length} professional blocks`,
                },
              ]}
              onEdit={() =>
                router.push(
                  getEditPath("/users/system/candidates/Add_candidate/skills"),
                )
              }
            />
            <ReviewCard
              title="Evidence Pack"
              icon="verified"
              items={[
                {
                  label: "Resume Status",
                  value: (formData.step6 as any).resume
                    ? "Encrypted & Loaded"
                    : "Missing",
                },
                {
                  label: "ID Verification",
                  value: (formData.step6 as any).idProof ? "Supplied" : "Pending",
                },
                { label: "GDPR Clause", value: "Signed & Timstamped" },
              ]}
              onEdit={() =>
                router.push(
                  getEditPath(
                    "/users/system/candidates/Add_candidate/document_resume",
                  ),
                )
              }
            />
          </div>

          <section className="glass-panel rounded-4xl p-10 border-(--border-subtle) space-y-8 bg-(--surface) shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[3px] text-primary/80 mb-2">
              Final Consents & Data Handling
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/20">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg text-white">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-black text-(--text-main) uppercase tracking-wider mb-1">
                  GDPR & Compliance Protocol
                </p>
                <p className="text-[10px] text-(--text-muted) font-medium">
                  Candidate has consented to data indexing for 24 months as per
                  recruitment guidelines.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center ml-auto sm:ml-0">
                <span className="material-symbols-outlined text-2xl">
                  check_circle
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-(--text-muted) ml-1 uppercase tracking-wider">
                Internal Recruiter Notes
              </label>
              <textarea
                value={formData.step7.internalNotes || ""}
                onChange={(e) =>
                  updateStepData("step7", { internalNotes: e.target.value })
                }
                className="premium-input rounded-3xl py-6 px-7 text-sm font-medium text-(--text-main) min-h-[160px] leading-relaxed resize-none transition-all"
                placeholder="Provide additional analyst intelligence on the candidate..."
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-(--border-subtle) bg-(--background)/95 backdrop-blur-xl z-90 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-(--text-muted) font-bold text-sm hover:text-(--text-main) transition-all group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform text-lg">
              arrow_back
            </span>
            Back to Documents
          </button>
          <button
            onClick={handleSubmit}
            className="active-tab-gradient px-12 md:px-20 py-4 rounded-2xl text-white font-black text-sm flex items-center gap-4 hover:-translate-y-px transition-all shadow-premium"
          >
            Deploy Profile to Talent Pool
            <span className="material-symbols-outlined text-lg">
              rocket_launch
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

function ReviewCard({
  title,
  icon,
  items,
  onEdit,
}: {
  title: string;
  icon: string;
  items: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <div className="glass-panel rounded-4xl p-8 border-(--border-subtle) group flex flex-col h-full bg-(--surface) shadow-sm">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <h4 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[2px]">
            {title}
          </h4>
        </div>
        <button
          onClick={onEdit}
          className="p-2 rounded-xl hover:bg-primary/5 text-[var(--text-muted)] hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">
              {item.label}
            </span>
            <span className="text-sm font-bold text-[var(--text-main)] truncate">
              {item.value || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
