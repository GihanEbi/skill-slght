"use client";
import React, { Suspense, useState, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  fetchJobCandidates,
  fetchAiMatchesForJob,
  addCandidateToPipeline,
  removeCandidateFromPipeline,
} from "@/services/candidatePipelineService";
import { fetchActiveJobs, saveDraft } from "@/services/jobService";
import { Candidate } from "@/types/candidate_types";

// All cards appear at once — no stagger delay
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Simple time ago formatter
function timeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const now = new Date();
  const past = new Date(dateString);
  if (isNaN(past.getTime())) return "Recently";
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (isNaN(diffInSeconds)) return "Recently";
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return past.toLocaleDateString();
}

function JobPipelineDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [isReviewingMatches, setIsReviewingMatches] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isNavigatingToEdit, setIsNavigatingToEdit] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);

  // Saves current job as the creation draft and navigates to the edit workflow
  const handleEditJob = useCallback(() => {
    if (!currentJob) return;
    saveDraft({
      // Mark this draft as an edit of an existing job so it gets replaced on save
      editingJobTitle: currentJob.title ?? "",
      title: currentJob.title ?? "",
      department_id: currentJob.department_id ?? null,
      department_name: currentJob.department_name ?? "",
      location: currentJob.location ?? null,
      work_arrangement: currentJob.work_arrangement,
      employment_type: currentJob.employment_type,
      description: currentJob.description ?? "",
      skill_ids: currentJob.skill_ids ?? [],
      skill_names: currentJob.skill_names ?? [],
      template_id: currentJob.template_id ?? null,
      benefit_ids: currentJob.benefit_ids ?? [],
      benefit_names: currentJob.benefit_names ?? [],
      custom_perks: currentJob.custom_perks ?? [],
      work_life_flexible_hours: currentJob.work_life_flexible_hours ?? false,
      work_life_remote_first: currentJob.work_life_remote_first ?? false,
      work_life_mental_health_days: currentJob.work_life_mental_health_days ?? false,
      currency: currentJob.currency ?? "USD",
      salary_min: currentJob.salary_min ?? null,
      salary_max: currentJob.salary_max ?? null,
      performance_bonus: currentJob.performance_bonus ?? false,
      signing_bonus: currentJob.signing_bonus ?? false,
      stock_options: currentJob.stock_options ?? false,
      financial_add_ons: currentJob.financial_add_ons ?? [],
      is_internal: currentJob.is_internal ?? true,
      external_publisher_ids: currentJob.external_publisher_ids ?? [],
      external_publisher_names: currentJob.external_publisher_names ?? [],
      hiring_manager_ids: currentJob.hiring_manager_ids ?? [],
      hiring_manager_names: currentJob.hiring_manager_names ?? [],
      save_as_template: currentJob.save_as_template ?? false,
      status: currentJob.status,
      created_at: currentJob.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsNavigatingToEdit(true);
    router.push("/users/system/jobs/create/details");
  }, [currentJob, router]);

  // Loader states for Email
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<any>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Fetch job details by jobId
      if (jobId) {
        const allJobs = await fetchActiveJobs();
        const foundJob = allJobs.find((j: any) => j.id === jobId);
        if (foundJob) {
          setCurrentJob(foundJob);
        }
      }

      const cList = await fetchJobCandidates(jobId);
      const mList = await fetchAiMatchesForJob(jobId);
      setCandidates(cList);
      setAiMatches(mList);
      setIsLoading(false);
    };
    loadData();
  }, [jobId]);

  // stats should change with database stats
  const stats = [
    { label: "Total Candidates", value: "142", trend: "+12%", active: true },
    { label: "Screening", value: "45", subtitle: "Active" },
    { label: "Reviewing", value: "12", subtitle: "Priority", isPrimary: true },
    { label: "Interviewing", value: "8", subtitle: "Scheduled" },
    { label: "Offer", value: "2", subtitle: "Final Stage" },
  ];

  const openEmailModal = useCallback((candidate: any) => {
    setSelectedCandidate(candidate);
    setIsSent(false);
    setIsSending(false);
    setShowEmailModal(true);
  }, []);

  const handleSendEmail = async () => {
    setIsSending(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    setIsSent(true);
    // Auto close modal after success
    setTimeout(() => {
      setShowEmailModal(false);
    }, 1200);
  };

  // function for remove the selected object from AI match and insert it to candidates

  const handleAddToCandidates = useCallback(async (aiMatch: any) => {
    setIsAdding(true);
    try {
      const newCand = await addCandidateToPipeline(aiMatch);
      setCandidates((prev) => [newCand, ...prev]);
      setAiMatches((prev) => prev.filter((m) => m.id !== aiMatch.id));
    } finally {
      setIsAdding(false);
    }
  }, []);

  const openDeleteModal = useCallback((candidate: any) => {
    setCandidateToDelete(candidate);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (candidateToDelete) {
      setIsDeleting(true);
      await removeCandidateFromPipeline(candidateToDelete.id);
      setCandidates((prev) =>
        prev.filter((c: any) => c.id !== candidateToDelete.id),
      );
      setIsDeleting(false);
      setShowDeleteModal(false);
      setCandidateToDelete(null);
    }
  }, [candidateToDelete]);

  // Resolved job display values
  const jobTitle = currentJob?.title || "Loading...";
  const jobLocation = currentJob?.location || "Remote";
  const jobStatus = currentJob?.status || "Active";
  const jobPosted = currentJob
    ? timeAgo(currentJob.updated_at || currentJob.created_at)
    : "—";
  const workArrangement = currentJob?.work_arrangement || "";
  const isActive =
    jobStatus === "ACTIVE" || jobStatus === "Active" || !currentJob;

  return (
    <div className="min-h-screen rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)]">
      {/* --- JOB DETAILS MODAL --- */}
      <AnimatePresence>
        {showJobModal && currentJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJobModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-[2rem] shadow-2xl border-[var(--border-subtle)] overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-8 pb-6 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-2xl">work</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                      {currentJob.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-orange-500"}`}
                        />
                        {jobStatus}
                      </span>
                      <span className="text-[var(--text-muted)] text-xs font-medium">
                        {jobId}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="p-2 rounded-xl hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Modal Body — scrollable */}
              <div className="overflow-y-auto flex-1 p-8 space-y-6">
                {/* Quick info row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: "location_on",
                      label: "Location",
                      value: currentJob.location || "Not specified",
                    },
                    {
                      icon: "hub",
                      label: "Department",
                      value: currentJob.department_name || "General",
                    },
                    {
                      icon: "home_work",
                      label: "Work Mode",
                      value: (() => {
                        const wm = currentJob.work_arrangement || "";
                        if (wm === "REMOTE") return "Remote";
                        if (wm === "HYBRID") return "Hybrid";
                        if (wm === "ON_SITE") return "On-Site";
                        return wm || "—";
                      })(),
                    },
                    {
                      icon: "schedule",
                      label: "Employment",
                      value: (() => {
                        const et = currentJob.employment_type || "";
                        if (et === "FULL_TIME") return "Full-Time";
                        if (et === "PART_TIME") return "Part-Time";
                        if (et === "CONTRACT") return "Contract";
                        if (et === "INTERN") return "Internship";
                        return et || "—";
                      })(),
                    },
                    {
                      icon: "payments",
                      label: "Salary Range",
                      value:
                        currentJob.salary_min && currentJob.salary_max
                          ? `${currentJob.currency || "USD"} ${(currentJob.salary_min / 1000).toFixed(0)}k – ${(currentJob.salary_max / 1000).toFixed(0)}k`
                          : "Not disclosed",
                    },
                    {
                      icon: "update",
                      label: "Last Updated",
                      value: jobPosted,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-[var(--input-bg)] rounded-2xl p-4 border border-[var(--border-subtle)]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-base text-primary/70">
                          {item.icon}
                        </span>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
                          {item.label}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-main)] mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {currentJob.description && (
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Job Description
                    </p>
                    {/* Detect HTML content vs plain text */}
                    {/<[a-z][\s\S]*>/i.test(currentJob.description) ? (
                      <>
                        <style>{`
                          .job-desc-html { color: var(--text-muted); font-size: 0.875rem; line-height: 1.75; }
                          .job-desc-html b, .job-desc-html strong { color: var(--text-main); font-weight: 700; }
                          .job-desc-html i, .job-desc-html em { font-style: italic; }
                          .job-desc-html u { text-decoration: underline; text-underline-offset: 2px; }
                          .job-desc-html ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
                          .job-desc-html ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
                          .job-desc-html li { margin: 0.25rem 0; }
                          .job-desc-html p { margin: 0.35rem 0; }
                          .job-desc-html h1, .job-desc-html h2, .job-desc-html h3 { color: var(--text-main); font-weight: 700; margin: 0.75rem 0 0.25rem; }
                          .job-desc-html a { color: var(--primary); text-decoration: underline; }
                          .job-desc-html [style*="text-align: center"] { text-align: center; }
                          .job-desc-html [style*="text-align: right"] { text-align: right; }
                        `}</style>
                        <div
                          className="job-desc-html bg-[var(--input-bg)] rounded-2xl p-5 border border-[var(--border-subtle)]"
                          dangerouslySetInnerHTML={{ __html: currentJob.description }}
                        />
                      </>
                    ) : (
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium bg-[var(--input-bg)] rounded-2xl p-5 border border-[var(--border-subtle)]">
                        {currentJob.description}
                      </p>
                    )}
                  </div>
                )}

                {/* Skills */}
                {currentJob.skill_names && currentJob.skill_names.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.skill_names.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold border border-primary/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {currentJob.benefit_names && currentJob.benefit_names.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Benefits
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.benefit_names.map(
                        (benefit: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20"
                          >
                            {benefit}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Perks */}
                {currentJob.custom_perks && currentJob.custom_perks.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                      Perks
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.custom_perks.map(
                        (perk: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 text-xs font-bold border border-purple-500/20"
                          >
                            {perk}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Hiring Managers */}
                {currentJob.hiring_manager_names &&
                  currentJob.hiring_manager_names.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                        Hiring Managers
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentJob.hiring_manager_names.map(
                          (name: string, idx: number) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold border border-[var(--border-subtle)]"
                            >
                              <span className="material-symbols-outlined text-sm text-primary/70">
                                person
                              </span>
                              {name}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Publishers */}
                {currentJob.external_publisher_names &&
                  currentJob.external_publisher_names.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                        Published On
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentJob.external_publisher_names.map(
                          (pub: string, idx: number) => (
                            <span
                              key={idx}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold border border-[var(--border-subtle)]"
                            >
                              <span className="material-symbols-outlined text-sm text-primary/70">
                                public
                              </span>
                              {pub}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Compensation flags */}
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
                    Compensation Extras
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.performance_bonus && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                        Performance Bonus
                      </span>
                    )}
                    {currentJob.signing_bonus && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                        Signing Bonus
                      </span>
                    )}
                    {currentJob.stock_options && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
                        Stock Options
                      </span>
                    )}
                    {currentJob.financial_add_ons?.map(
                      (addon: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20"
                        >
                          {addon}
                        </span>
                      ),
                    )}
                    {!currentJob.performance_bonus &&
                      !currentJob.signing_bonus &&
                      !currentJob.stock_options &&
                      (!currentJob.financial_add_ons ||
                        currentJob.financial_add_ons.length === 0) && (
                        <span className="text-xs text-[var(--text-muted)] italic">
                          No extras specified
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowJobModal(false);
                    handleEditJob();
                  }}
                  disabled={!currentJob}
                  className="flex-[2] active-tab-gradient py-3 rounded-xl text-white font-bold text-sm shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  Edit Job
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- EMAIL MODAL --- */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSending && setShowEmailModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl glass-panel rounded-[2rem] p-8 shadow-2xl border-[var(--border-subtle)] overflow-hidden"
            >
              {/* Internal Loader Overlay */}
              <AnimatePresence>
                {(isSending || isSent) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                  >
                    <AnimatePresence mode="wait">
                      {isSending ? (
                        <motion.div
                          key="sending"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                          <h3 className="text-[var(--text-main)] font-bold text-lg">
                            Encrypting Transmission
                          </h3>
                          <p className="text-[var(--text-muted)] text-sm mt-1">
                            Routing message through protocol nodes...
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sent"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow mb-4">
                            <span className="material-symbols-outlined text-white text-3xl font-bold">
                              check
                            </span>
                          </div>
                          <h3 className="text-[var(--text-main)] font-bold text-lg">
                            Message Dispatched
                          </h3>
                          <p className="text-[var(--text-muted)] text-sm mt-1">
                            Candidate will receive an encrypted notification.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    mail
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                    Send Message
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    To: {selectedCandidate?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Interview Request / Application Update"
                    className="premium-input rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                    Content
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    className="premium-input rounded-xl p-4 text-sm font-medium resize-none h-40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                    Attachment
                  </label>
                  <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors cursor-pointer group bg-[var(--input-bg)]">
                    <span className="material-symbols-outlined text-[var(--text-muted)] group-hover:text-primary transition-colors">
                      attach_file
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      Upload PDFs or Docs (Max 10MB)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex-[2] active-tab-gradient py-3 rounded-xl text-white font-bold text-sm shadow-glow transition-all"
                >
                  Send Protocol Mail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md glass-panel rounded-3xl p-8 shadow-2xl border-[var(--border-subtle)] overflow-hidden text-center"
            >
              {isDeleting ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <style>
                    {`
                      @keyframes spin-force {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                  <div
                    style={{ animation: "spin-force 1s linear infinite" }}
                    className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full mb-4"
                  />
                  <h3 className="text-lg font-bold text-[var(--text-main)]">
                    Removing Candidate
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1 animate-pulse">
                    Updating pipeline data...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-sm border border-red-500/20">
                    <span className="material-symbols-outlined text-3xl">
                      delete_forever
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
                    Reject Candidate?
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
                    Are you sure you want to remove{" "}
                    <span className="font-bold text-[var(--text-main)]">
                      {candidateToDelete?.name}
                    </span>{" "}
                    from the pipeline? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 py-3.5 rounded-xl border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface)] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5"
                    >
                      Yes, Reject
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FULL PAGE LOADER --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--background)]/90 backdrop-blur-md"
          >
            {/* Outer glow ring */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-28 h-28 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "1.8s" }} />
              <div className="absolute w-20 h-20 rounded-full bg-primary/15 blur-md" />
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-base">work</span>
              </div>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[var(--text-main)] font-bold text-lg tracking-tight mb-2"
            >
              Loading Pipeline
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-[var(--text-muted)] text-sm font-medium animate-pulse"
            >
              Fetching job & candidate data...
            </motion.p>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex gap-1.5 mt-5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-8">
          <Link
            href="/users/system/jobs/active_jobs"
            className="hover:text-primary transition-colors"
          >
            Jobs
          </Link>
          <span className="material-symbols-outlined text-sm opacity-40">
            chevron_right
          </span>
          <span className="text-primary">Candidate Pipeline</span>
        </nav>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
                {isLoading ? (
                  <span className="inline-block w-72 h-9 rounded-xl bg-[var(--surface)] animate-pulse" />
                ) : (
                  jobTitle
                )}
              </h1>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-orange-500"}`}
                />
                {isLoading ? "Loading..." : jobStatus}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-medium flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary/70">
                  location_on
                </span>
                {isLoading ? (
                  <span className="inline-block w-36 h-4 rounded bg-[var(--surface)] animate-pulse" />
                ) : (
                  jobLocation
                )}
              </span>
              {workArrangement && (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary/70">
                    home_work
                  </span>
                  {workArrangement === "REMOTE"
                    ? "Remote"
                    : workArrangement === "HYBRID"
                      ? "Hybrid"
                      : workArrangement === "ON_SITE"
                        ? "On-Site"
                        : workArrangement}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary/70">
                  schedule
                </span>
                Updated {jobPosted}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditJob}
              disabled={!currentJob || isNavigatingToEdit}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-main)] font-semibold text-sm hover:border-primary/50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isNavigatingToEdit ? (
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-xl opacity-70">edit_note</span>
              )}
              {isNavigatingToEdit ? "Loading..." : "Edit Job"}
            </button>
            <button
              onClick={() => setShowJobModal(true)}
              className="p-2.5 rounded-xl active-tab-gradient text-white shadow-glow hover:scale-105 transition-all"
              title="View Job Details"
            >
              <span className="material-symbols-outlined text-xl">
                visibility
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats?.map((s, i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-2xl border-l-4 border-l-primary/30"
            >
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                {s.label}
              </p>
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-2xl md:text-3xl font-bold tracking-tight ${s.isPrimary ? "text-primary" : "text-[var(--text-main)]"}`}
                >
                  {s.value}
                </span>
                {s.trend && (
                  <span className="text-primary text-xs font-bold">
                    {s.trend}
                  </span>
                )}
                {s.subtitle && (
                  <span className="text-[var(--text-muted)] text-[10px] font-medium opacity-60 italic">
                    {s.subtitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Bar */}
        <motion.div
          layout
          className="glass-panel rounded-[2rem] p-6 md:p-8 border-l-4 border-l-primary mb-12 relative overflow-hidden shadow-glow transition-all"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-[80px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-glow">
                <span className="material-symbols-outlined text-3xl">
                  psychology
                </span>
              </div>
              <div>
                <h4 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-3">
                  AI Analysis Engine{" "}
                  <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                    Protocol Sync: 100%
                  </span>
                </h4>
                <p className="text-[var(--text-muted)] text-sm mt-1 max-w-2xl font-medium leading-relaxed">
                  Analyzing historical candidate nodes and neural weightings.
                  Detected 3 high-probability matches matching your tech stack.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsReviewingMatches(!isReviewingMatches)}
              className={`flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-xl text-xs transition-all shadow-premium ${isReviewingMatches ? "bg-[var(--input-bg)] text-[var(--text-main)]" : "active-tab-gradient text-white hover:scale-105"}`}
            >
              {isReviewingMatches ? "Hide Details" : "Review AI Matches"}
              <span
                className={`material-symbols-outlined text-lg transition-transform ${isReviewingMatches ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>
          </div>
          <AnimatePresence>
            {isReviewingMatches && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--border-subtle)]">
                  {aiMatches?.map((c, i) => (
                    <div
                      key={c.id || i}
                      className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <Image
                          src={`/images/avatar-img/${c?.avatar}`}
                          width={100}
                          height={100}
                          alt={c?.name}
                          className="w-12 h-12 rounded-xl bg-[var(--background)] shadow-sm"
                        />
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary tracking-tighter">
                            {c?.score}%
                          </div>
                          <div className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-tighter">
                            Match Index
                          </div>
                        </div>
                      </div>
                      <h5 className="font-bold text-[var(--text-main)] mb-1">
                        {c?.name}
                      </h5>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold mb-4 border border-emerald-500/10">
                        {c?.status}
                      </span>
                      <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                        <div>
                          <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-tighter">
                            Top Strength
                          </p>
                          <p className="text-xs font-semibold text-[var(--text-main)]">
                            {c?.strength}
                          </p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed italic opacity-80">
                          &quot;{c?.bio}&quot;
                        </p>
                      </div>
                      <button
                        className="w-full mt-6 py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                        onClick={() => {
                          handleAddToCandidates(c);
                        }}
                      >
                        Add to Pipeline
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters and Main List */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
            Candidate Pipeline
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="relative flex-grow md:flex-grow-0 group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg opacity-50">
                  search
                </span>
                <input
                  className="premium-input pl-10 pr-4 py-2.5 rounded-xl text-[var(--text-main)] font-semibold text-sm w-full md:w-64"
                  placeholder="Find a candidate..."
                  type="text"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg">
                  filter_list
                </span>
                Refine
              </button>
            </div>

            <button
              onClick={() => router.push("/users/system/candidates")}
              className="w-full sm:w-auto active-tab-gradient text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
            >
              <span className="material-symbols-outlined text-xl">
                add_circle
              </span>{" "}
              Create Job
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {isAdding ? (
            <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-[var(--text-muted)] font-medium animate-pulse">
                Syncing Candidate Data...
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              // initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {candidates?.map((c: any, i) => (
                <CandidateCard
                  key={c.id || i}
                  candidate={c}
                  onEmailClick={openEmailModal}
                  onDeleteClick={openDeleteModal}
                />
              ))}
            </motion.div>
          )}
        </div>

        <footer className="mt-16 flex justify-center">
          <div className="flex gap-2">
            <PaginationButton icon="chevron_left" disabled />
            <PaginationButton label="1" active />
            <PaginationButton icon="chevron_right" />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function JobPipelinePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Profile...
        </div>
      }
    >
      <JobPipelineDetailPage />
    </Suspense>
  );
}

const CandidateCard = memo(
  ({ candidate, onEmailClick, onDeleteClick }: any) => {
    const router = useRouter();

    const flattenedSkills = React.useMemo(() => {
      if (!candidate?.skills) return [];
      return candidate.skills
        .flatMap((s: any) => (typeof s === "string" ? [s] : s.skills || []))
        .slice(0, 6);
    }, [candidate?.skills]);

    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -3 }}
        className={`glass-panel rounded-[2rem] p-7 transition-all shadow-sm border-[var(--border-subtle)] ${candidate?.isUnicorn ? "border-primary/30 ring-1 ring-primary/10" : ""}`}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl border border-[var(--border-subtle)] p-0.5 overflow-hidden bg-[var(--surface)] shadow-sm">
              <Image
                src={`/images/avatar-img/${candidate?.avatar_id}`}
                width={100}
                height={100}
                alt={candidate?.first_name + " " + candidate?.last_name}
                className="w-full h-full object-cover rounded-[0.8rem]"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--text-main)] tracking-tight">
                {candidate?.first_name + " " + candidate?.last_name}
              </h3>
              <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">
                {candidate?.current_role + " at " + candidate?.current_company}
              </p>
              <div className="flex gap-3 mt-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/10">
                  {candidate?.status}
                </span>
                <span className="text-[var(--text-muted)] text-[10px] font-medium self-center opacity-60">
                  Updated {candidate?.updated}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tight mb-3 opacity-60">
            Technical Match
          </p>
          <div className="flex flex-wrap gap-2">
            {flattenedSkills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold border border-[var(--border-subtle)] hover:border-primary/40 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-subtle)]">
          <button
            className="flex-grow py-3 rounded-xl active-tab-gradient text-white text-xs font-bold shadow-glow hover:translate-y-[-1px] transition-all"
            onClick={() => {
              router.push(
                candidate?.isUnicorn
                  ? `/users/system/jobs/active_jobs/candidate_list/${candidate?.first_name?.toLowerCase()?.replace(" ", "-")}`
                  : `/users/system/jobs/active_jobs/candidate_list/${candidate?.first_name?.toLowerCase()?.replace(" ", "-")}`,
              );
            }}
          >
            {candidate?.isUnicorn ? "Manage Offer" : "Move Stage"}
          </button>
          <button
            onClick={() => onEmailClick(candidate)}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary/50 transition-all bg-[var(--surface)] shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">
              chat_bubble
            </span>
          </button>
          <button
            onClick={() => onDeleteClick(candidate)}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all bg-[var(--surface)] shadow-sm"
            title="Reject Candidate"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </motion.div>
    );
  },
);
CandidateCard.displayName = "CandidateCard";

function PaginationButton({ label, icon, active, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${active ? "bg-primary text-white border-primary shadow-glow" : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary hover:border-primary/30 disabled:opacity-30"}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-sm font-bold">{label}</span>
      )}
    </button>
  );
}
