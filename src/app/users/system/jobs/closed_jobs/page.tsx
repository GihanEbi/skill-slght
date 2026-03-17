"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchClosedJobs, reopenClosedJob, deleteClosedJob } from "@/services/jobService";
import { departments } from "@/constants/job_constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const formatEnum = (val: string) => {
  if (!val) return "N/A";
  return val
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(),
    );
};

const formatCurrency = (val: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(val || 0);

export default function ClosedJobsPage() {
  const router = useRouter();

  // Data State - Specific to Closed Jobs
  const [closedJobs, setClosedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const jobs = await fetchClosedJobs();
        const mapped = jobs.map((j: any) => ({
          ...j,
          cat: j.is_internal ? "internal" : "external",
          dept: j.department_name || j.department || "General",
        }));
        setClosedJobs(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // UI States
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isReopening, setIsReopening] = useState(false);
  const [jobToReopen, setJobToReopen] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<any>(null);

  const filteredJobs = closedJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDept =
      selectedDept === "All Departments" || job.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Selection Handlers
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredJobs.length) setSelectedIds([]);
    else setSelectedIds(filteredJobs.map((j) => j.id));
  };

  // Handlers
  const handleBulkReopen = () => {
    setJobToReopen("bulk");
  };

  const handleBulkDelete = () => {
    setJobToDelete("bulk");
  };

  const handleReopen = (job: any) => {
    setJobToReopen(job);
  };

  const confirmReopen = async () => {
    if (!jobToReopen) return;
    setIsReopening(true);
    
    if (jobToReopen === "bulk") {
      const titles = closedJobs.filter(j => selectedIds.includes(j.id)).map(j => j.title);
      for (const title of titles) {
        await reopenClosedJob(title);
      }
      setClosedJobs(prev => prev.filter(j => !titles.includes(j.title)));
    } else {
      await reopenClosedJob(jobToReopen.title);
      setClosedJobs((prev) => prev.filter((j) => j.title !== jobToReopen.title));
    }

    setIsReopening(false);
    setJobToReopen(null);
    setSelectedIds([]);
    router.push("/users/system/jobs/active_jobs");
  };

  const handleDelete = (job: any) => {
    setJobToDelete(job);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);

    if (jobToDelete === "bulk") {
      const titles = closedJobs.filter(j => selectedIds.includes(j.id)).map(j => j.title);
      for (const title of titles) {
        await deleteClosedJob(title);
      }
      setClosedJobs(prev => prev.filter(j => !titles.includes(j.title)));
    } else {
      await deleteClosedJob(jobToDelete.title);
      setClosedJobs((prev) => prev.filter((j) => j.title !== jobToDelete.title));
    }

    setIsDeleting(false);
    setJobToDelete(null);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)] pb-32">
      {/* --- REOPEN CONFIRMATION POPUP --- */}
      <AnimatePresence>
        {jobToReopen && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isReopening && setJobToReopen(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-[2rem] p-8 shadow-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--background)]"
            >
              <AnimatePresence>
                {isReopening && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[var(--surface)]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    <h3 className="text-[var(--text-main)] font-bold">
                      Reactivating Protocol
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Reopen Job
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Are you sure you want to reopen {jobToReopen === "bulk" ? `${selectedIds.length} selected jobs` : `"${jobToReopen.title}"`}? It will be moved back to the Active Jobs list.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setJobToReopen(null)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm bg-[var(--surface)] hover:bg-[var(--input-bg)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReopen}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-glow shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Reopen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION POPUP --- */}
      <AnimatePresence>
        {jobToDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setJobToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-[2rem] p-8 shadow-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--background)]"
            >
              <AnimatePresence>
                {isDeleting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[var(--surface)]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mb-4" />
                    <h3 className="text-[var(--text-main)] font-bold">
                      Deleting Record
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-red-500 text-2xl">
                  delete_forever
                </span>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Delete Permanently
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Are you sure you want to permanently delete {jobToDelete === "bulk" ? `${selectedIds.length} selected jobs` : `"${jobToDelete.title}"`}? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setJobToDelete(null)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm bg-[var(--surface)] hover:bg-[var(--input-bg)] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMPREHENSIVE DATA MODAL --- */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl h-[90vh] glass-panel rounded-[2rem] shadow-2xl border border-[var(--border-subtle)] flex flex-col overflow-hidden bg-[var(--background)]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--surface)]/50 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                      Closed Job Details
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Closed on: {selectedJob.dateClosed}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/50 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-10">
                {/* STEP 1: Details */}
                <section>
                  <SectionTitle icon="description" title="Core Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <DetailField
                      label="Job Title"
                      value={selectedJob.title}
                      isHighlight
                    />
                    <DetailField label="Department" value={selectedJob.dept} />
                    <DetailField
                      label="Location"
                      value={selectedJob.location || "N/A"}
                    />
                    <DetailField
                      label="Work Arrangement"
                      value={formatEnum(selectedJob.work_arrangement)}
                    />
                    <DetailField
                      label="Employment Type"
                      value={formatEnum(selectedJob.employment_type)}
                    />
                    <DetailField
                      label="Template Used"
                      value={selectedJob.template_id || "None (Custom)"}
                    />

                    <div className="md:col-span-2 mt-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                        Required Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skill_names?.map((skill: any) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                        {(!selectedJob.skill_names ||
                          selectedJob.skill_names.length === 0) && (
                          <span className="text-sm text-[var(--text-muted)] italic">
                            No skills specified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                        Job Description
                      </label>
                      <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--border-subtle)]">
                        {selectedJob.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                </section>

                {/* STEP 2: Benefits */}
                <section>
                  <SectionTitle
                    icon="card_giftcard"
                    title="Benefits & Work-Life"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                        Standard Benefits
                      </label>
                      <ul className="space-y-2">
                        {selectedJob.benefit_names?.map((ben: any) => (
                          <li
                            key={ben}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]"
                          >
                            <span className="material-symbols-outlined text-primary text-lg">
                              check_circle
                            </span>{" "}
                            {ben}
                          </li>
                        ))}
                        {(!selectedJob.benefit_names ||
                          selectedJob.benefit_names.length === 0) && (
                          <li className="text-sm text-[var(--text-muted)]">
                            None selected
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                        Custom Perks
                      </label>
                      <ul className="space-y-2">
                        {selectedJob.custom_perks?.map((perk: any) => (
                          <li
                            key={perk}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]"
                          >
                            <span className="material-symbols-outlined text-accent text-lg">
                              star
                            </span>{" "}
                            {perk}
                          </li>
                        ))}
                        {(!selectedJob.custom_perks ||
                          selectedJob.custom_perks.length === 0) && (
                          <li className="text-sm text-[var(--text-muted)]">
                            None specified
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="md:col-span-2 pt-4 border-t border-[var(--border-subtle)] flex gap-4 flex-wrap">
                      <BooleanTag
                        label="Flexible Hours"
                        active={selectedJob.work_life_flexible_hours}
                      />
                      <BooleanTag
                        label="Remote First"
                        active={selectedJob.work_life_remote_first}
                      />
                      <BooleanTag
                        label="Mental Health Days"
                        active={selectedJob.work_life_mental_health_days}
                      />
                    </div>
                  </div>
                </section>

                {/* STEP 3: Compensation */}
                <section>
                  <SectionTitle icon="payments" title="Compensation" />
                  <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-8 mb-6">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                          Base Salary Range
                        </label>
                        <p className="text-2xl font-bold text-primary tracking-tight">
                          {selectedJob.salary_min
                            ? formatCurrency(
                                selectedJob.salary_min,
                                selectedJob.currency,
                              )
                            : "TBD"}{" "}
                          —{" "}
                          {selectedJob.salary_max
                            ? formatCurrency(
                                selectedJob.salary_max,
                                selectedJob.currency,
                              )
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                          Currency
                        </label>
                        <p className="text-2xl font-bold text-[var(--text-main)]">
                          {selectedJob.currency || "USD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <BooleanTag
                        label="Performance Bonus"
                        active={selectedJob.performance_bonus}
                      />
                      <BooleanTag
                        label="Signing Bonus"
                        active={selectedJob.signing_bonus}
                      />
                      <BooleanTag
                        label="Stock Options / Equity"
                        active={selectedJob.stock_options}
                      />
                    </div>
                    {selectedJob.financial_add_ons?.length > 0 && (
                      <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                          Financial Add-ons
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.financial_add_ons.map((addon: any) => (
                            <span
                              key={addon}
                              className="px-3 py-1.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)]"
                            >
                              {addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Stats Section */}
                <section>
                  <SectionTitle icon="query_stats" title="Hiring Performance" />
                  <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-around flex-wrap gap-4">
                    <div className="text-center">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                        Applied
                      </label>
                      <span className="text-2xl font-bold text-[var(--text-main)]">
                        {selectedJob.stats?.applied || 0}
                      </span>
                    </div>
                    <div className="text-center">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                        Screening
                      </label>
                      <span className="text-2xl font-bold text-[var(--text-main)]">
                        {selectedJob.stats?.screening || 0}
                      </span>
                    </div>
                    <div className="text-center">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                        Interview
                      </label>
                      <span className="text-2xl font-bold text-[var(--text-main)]">
                        {selectedJob.stats?.interview || 0}
                      </span>
                    </div>
                    <div className="text-center">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                        Offer
                      </label>
                      <span className="text-2xl font-bold text-primary">
                        {selectedJob.stats?.offer || 0}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BULK ACTION BAR --- */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] w-[90%] max-w-2xl"
          >
            <div className="glass-panel border-primary/30 rounded-2xl p-4 flex items-center justify-between shadow-glow bg-primary/5 backdrop-blur-2xl ring-1 ring-primary/20">
              <div className="flex items-center gap-4 ml-2">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {selectedIds.length}
                </span>
                <span className="text-sm font-bold text-[var(--text-main)]">
                  Records Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkReopen}
                  className="px-4 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    restore
                  </span>{" "}
                  Reopen
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl border border-red-500/20 flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete_forever
                  </span>{" "}
                  Delete
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div className="space-y-2">
            <nav className="flex text-xs font-semibold text-primary items-center gap-2">
              <span className="opacity-60 text-[var(--text-muted)]">Jobs</span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Closed Jobs</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              Closed Jobs
              <span className="text-[var(--text-muted)] ml-3 text-lg font-normal opacity-50">
                {filteredJobs.length} records
              </span>
            </h1>
          </div>
        </header>

        {/* Filter Bar */}
        <section className="glass-panel rounded-[24px] p-2 mb-10 border-[var(--border-subtle)] shadow-sm relative z-[100]">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="flex items-center gap-2 w-full lg:flex-1">
              <button
                onClick={selectAll}
                className="ml-4 flex items-center gap-2 group transition-all"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.length > 0 && selectedIds.length === filteredJobs.length ? "bg-primary border-primary text-white" : "border-[var(--border-subtle)] bg-[var(--input-bg)] group-hover:border-primary/50"}`}
                >
                  {selectedIds.length > 0 &&
                    selectedIds.length === filteredJobs.length && (
                      <span className="material-symbols-outlined text-[14px] font-bold">
                        check
                      </span>
                    )}
                </div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-tight">
                  Select All
                </span>
              </button>
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl opacity-60">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none rounded-2xl pl-10 pr-6 py-3.5 text-sm text-[var(--text-main)] focus:ring-0 placeholder:text-[var(--text-muted)] font-medium"
                  placeholder="Search job..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-1 w-full lg:w-auto">
              <ModernDropdown
                label="Department"
                selected={selectedDept}
                setSelected={setSelectedDept}
                options={["All Departments", ...departments]}
              />
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("All Departments");
                }}
                className="bg-[var(--input-bg)] hover:bg-primary/10 text-[var(--text-main)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 px-4 py-2 text-sm font-semibold h-[46px]"
              >
                <span className="material-symbols-outlined text-lg opacity-60">
                  tune
                </span>{" "}
                Refine
              </button>
            </div>
          </div>
        </section>

        {/* Closed Job Cards */}
        <motion.div
          variants={containerVariants}
          // initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-[var(--text-muted)] font-bold">
                  Loading closed protocols...
                </p>
              </div>
            ) : filteredJobs && filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                  <ClosedJobCard
                    key={job.id}
                    job={job}
                    isSelected={selectedIds.includes(job.id)}
                    onSelect={() => toggleSelect(job.id)}
                    onReopen={() => handleReopen(job)}
                    onViewDetails={() => setSelectedJob(job)}
                    onDelete={() => handleDelete(job)}
                  />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[2.5rem] p-12 md:p-20 text-center border-dashed border-2 border-[var(--border-subtle)] bg-white/5"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-glow">
                  <span className="material-symbols-outlined text-primary text-5xl">
                    search_off
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3 tracking-tight">
                  No Closed Jobs Found
                </h2>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                  Try clearing your filters or refreshing the page.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <footer className="mt-16 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            <PaginationButton icon="chevron_left" disabled />
            <PaginationButton label="1" active />
            <PaginationButton icon="chevron_right" disabled />
          </div>
        </footer>
      </main>
    </div>
  );
}

function ClosedJobCard({
  job,
  onReopen,
  isSelected,
  onSelect,
  onViewDetails,
  onDelete,
}: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      variants={itemVariants}
      exit={{ opacity: 0, x: -20 }}
      style={{ zIndex: isMenuOpen ? 150 : 1 }}
      className={`glass-panel rounded-[24px] p-6 md:p-7 flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-8 transition-all group relative overflow-visible shadow-sm ${isSelected ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "hover:border-primary/20"}`}
    >
      <div className="flex items-start gap-4 w-full xl:w-1/4">
        <button
          onClick={onSelect}
          className={`mt-1.5 w-5 h-5 rounded border transition-all flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary border-primary text-white" : "border-[var(--border-subtle)] bg-[var(--input-bg)] group-hover:border-primary/50"}`}
        >
          {isSelected && (
            <span className="material-symbols-outlined text-[14px] font-bold">
              check
            </span>
          )}
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
              {job.title}
            </h3>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${job.cat === "internal" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-purple-500/10 text-purple-600 border-purple-500/20"}`}
            >
              {job.cat.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">hub</span>
              {job.dept}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">
                event_busy
              </span>
              Closed {job.dateClosed}
            </span>
          </div>
        </div>
      </div>

      {/* Archive Stats Section */}
      <div className="w-full xl:flex-1 xl:px-10 flex items-center gap-8">
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Hired Candidate
          </span>
          <div className="flex items-center gap-3">
            <Image
              src={`/images/avatar-img/${job.hiredCandidate.avatar}`}
              width={100}
              height={100}
              alt="Hired"
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)]"
            />
            <span className="text-sm font-bold text-[var(--text-main)]">
              {job.hiredCandidate.name}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-right sm:text-left">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Time to Fill
          </span>
          <span className="text-sm font-bold text-primary">
            {job.timeToFill}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end gap-8">
        <button
          onClick={onReopen}
          className="px-6 py-2.5 rounded-xl border border-primary/30 text-primary font-bold text-xs hover:bg-primary/10 transition-all"
        >
          Reopen Job
        </button>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`w-10 h-10 flex items-center justify-center transition-all glass-panel rounded-xl ${isMenuOpen ? "text-primary border-primary" : "text-[var(--text-muted)] hover:text-primary"}`}
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 5 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-52 bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)] shadow-xl overflow-hidden p-1.5 z-[200]"
                >
                  <MenuButton
                    icon="visibility"
                    label="View Job Details"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onViewDetails();
                    }}
                  />
                  <MenuButton
                    icon="delete"
                    label="Delete Permanent"
                    isDanger
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete();
                    }}
                  />
                </motion.div>
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setIsMenuOpen(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Reuse Sub-components from Active Jobs
function MenuButton({ icon, label, isDanger, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${isDanger ? "text-red-500 hover:bg-red-500/10" : "text-[var(--text-main)] hover:bg-primary/10 hover:text-primary"}`}
    >
      <span className="material-symbols-outlined text-lg opacity-70">
        {icon}
      </span>{" "}
      {label}
    </button>
  );
}

function ModernDropdown({ label, selected, setSelected, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-w-[150px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 h-[46px] flex items-center justify-between gap-3 hover:border-primary/50 transition-all shadow-sm"
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
            className="absolute left-0 right-0 mt-2 bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden p-1 z-[999]"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors ${selected === opt ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
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

// Additional Shared Components
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
        {title}
      </h3>
    </div>
  );
}

function DetailField({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
        {label}
      </label>
      <p
        className={`text-sm font-semibold ${isHighlight ? "text-primary text-base" : "text-[var(--text-main)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function BooleanTag({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"}`}
    >
      <span className="material-symbols-outlined text-[16px]">
        {active ? "check_circle" : "cancel"}
      </span>
      {label}
    </div>
  );
}
