"use client";

import React, { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { motion, AnimatePresence } from "framer-motion";

function DocumentCard({
  label,
  icon,
  status,
  onClick,
}: {
  label: string;
  icon: string;
  status: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="p-6 rounded-4xl bg-(--surface) border border-(--border-subtle) hover:border-primary/30 shadow-sm transition-all cursor-pointer group flex items-center gap-5"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-all flex items-center justify-center">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-black text-(--text-main) uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            status === "Pending"
              ? "text-(--text-muted) opacity-60"
              : "text-primary animate-pulse"
          }`}
        >
          {status}
        </p>
      </div>
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

export default function DocumentUploadStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, isParsing, setIsParsing, syncToMaster } =
    useAddCandidate();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const certificationsInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  const simulateAiParsing = async (file: File) => {
    setIsParsing(true);
    updateStepData("step6", { resume: file });
    await new Promise((r) => setTimeout(r, 2200));
    setIsParsing(false);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateAiParsing(file);
  };

  const handleFileChange =
    (field: string, isMulti: boolean = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (isMulti) {
        const currentFiles = (formData.step6 as any)[field] || [];
        updateStepData("step6", {
          [field]: [...currentFiles, ...Array.from(files)],
        });
      } else {
        updateStepData("step6", { [field]: files[0] });
      }
    };

  const handleNext = () => {
    syncToMaster();
    const nextPath = "/users/system/candidates/Add_candidate/consent_tags";
    router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
  };

  const handleBack = () => {
    const prevPath = "/users/system/candidates/Add_candidate/education";
    router.push(editId ? `${prevPath}?id=${editId}` : prevPath);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <AnimatePresence>
        {isParsing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-(--background)/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-[3px] border-primary/10 border-t-primary rounded-full"
              />
              <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-5xl text-primary animate-pulse shadow-glow">
                psychology
              </span>
            </div>
            <h2 className="text-3xl font-black text-(--text-main) mb-3 tracking-tight uppercase">
              Neural Parsing Active
            </h2>
            <p className="text-(--text-muted) font-medium max-w-md mx-auto leading-relaxed">
              Our AI is currently deconstructing the resume to map professional
              nodes and calculate cross-alignment scores.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            <div className="mb-10 pb-4 border-b border-(--border-subtle)">
              <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
                Supporting Evidence
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Verify credentials via documentation and use AI to accelerate
                profile registration.
              </p>
            </div>

            <div className="space-y-10">
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[2px] text-primary/80 ml-1">
                  Universal Resume Input
                </h3>
                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className={`relative p-12 border-2 border-dashed rounded-4xl flex flex-col items-center justify-center gap-6 transition-all cursor-pointer group ${
                    formData.step6.resume
                      ? "border-primary bg-primary/5 shadow-glow"
                      : "border-(--border-subtle) hover:border-primary/50 bg-(--surface)/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={resumeInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />
                  <div
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                      formData.step6.resume
                        ? "bg-primary text-white shadow-lg scale-110"
                        : "bg-(--surface) text-(--text-muted) group-hover:scale-110 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 border border-transparent"
                    }`}
                  >
                    <span className="material-symbols-outlined text-4xl">
                      {formData.step6.resume ? "verified_user" : "upload_file"}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-(--text-main) mb-1">
                      {formData.step6.resume
                        ? (formData.step6.resume as File).name
                        : "Transmit Resume Pack"}
                    </p>
                    <p className="text-xs text-(--text-muted) font-medium tracking-wide">
                      {formData.step6.resume
                        ? "Analysis 100% Complete"
                        : "PDF, DOCX up to 15MB. AI will analyze professional nodes."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="file"
                  ref={coverLetterInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange("coverLetter")}
                />
                <input
                  type="file"
                  ref={portfolioInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileChange("portfolioFiles", true)}
                />
                <input
                  type="file"
                  ref={certificationsInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileChange("certifications", true)}
                />
                <input
                  type="file"
                  ref={idProofInputRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange("idProof")}
                />

                <DocumentCard
                  label="Cover Letter"
                  icon="history_edu"
                  status={formData.step6.coverLetter ? "Uploaded" : "Pending"}
                  onClick={() => coverLetterInputRef.current?.click()}
                />
                <DocumentCard
                  label="Portfolio Bundle"
                  icon="folder_special"
                  status={
                    formData.step6.portfolioFiles?.length
                      ? `${formData.step6.portfolioFiles.length} files`
                      : "Pending"
                  }
                  onClick={() => portfolioInputRef.current?.click()}
                />
                <DocumentCard
                  label="Certifications"
                  icon="new_releases"
                  status={
                    formData.step6.certifications?.length
                      ? `${formData.step6.certifications.length} docs`
                      : "Pending"
                  }
                  onClick={() => certificationsInputRef.current?.click()}
                />
                <DocumentCard
                  label="Identity Proof"
                  icon="id_card"
                  status={formData.step6.idProof ? "Uploaded" : "Pending"}
                  onClick={() => idProofInputRef.current?.click()}
                />
              </section>
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
              <div className="relative z-10 space-y-8 text-center">
                <div className="w-20 h-20 rounded-full bg-linear-to-r from-primary to-accent flex items-center justify-center mx-auto shadow-2xl mb-4 text-white">
                  <span className="material-symbols-outlined text-4xl">
                    auto_awesome
                  </span>
                </div>
                <h3 className="text-lg font-black text-(--text-main) tracking-tight uppercase">
                  AI Ingestion
                </h3>
                <p className="text-xs text-(--text-muted) font-medium leading-relaxed">
                  Uploading a resume initiates our **Semantic Parser**, which
                  automatically indexes skills, experience, and education.
                </p>
              </div>
            </div>

            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Transmission Log
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Resume Pack"
                  value={formData.step6.resume ? "Delivered" : "Null"}
                />
                <SummaryRow
                  label="Metadata Hash"
                  value={formData.step6.resume ? "Verified" : "Waiting"}
                />
                <SummaryRow
                  label="Parsing Status"
                  value={formData.step6.resume ? "Synthesized" : "Idle"}
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
            Finalize & Submit
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
