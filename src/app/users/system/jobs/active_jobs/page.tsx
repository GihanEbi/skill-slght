"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function ActiveJobsPage() {
  const router = useRouter();

  // Data State
  const [activeJobs, setActiveJobs] = useState([
    {
      id: 1,
      title: "Senior Blockchain Engineer",
      cat: "internal",
      dept: "Engineering",
      location: "Remote",
      posted: "2 days ago",
      tag: "New",
      tagColor: "primary",
      stats: { applied: 42, screening: 12, interview: 5, offer: 1, total: 60 },
      hiringTeam: ["Alex", "Jordan"],
    },
    {
      id: 2,
      title: "Solidity Smart Contract Auditor",
      dept: "Security",
      cat: "external",
      location: "Lisbon, PT",
      posted: "5 days ago",
      tag: "Urgent",
      tagColor: "orange",
      stats: { applied: 18, screening: 6, interview: 3, offer: 0, total: 27 },
      hiringTeam: ["Sarah"],
    },
    {
      id: 3,
      title: "Product Designer (Web3)",
      dept: "Design",
      cat: "internal",
      location: "Remote",
      posted: "1 week ago",
      stats: {
        applied: 84,
        screening: 32,
        interview: 12,
        offer: 2,
        total: 130,
      },
      hiringTeam: ["Mike", "Elena"],
    },
  ]);

  // UI States
  const [selectedDept, setSelectedDept] = useState("Engineering");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Close Flow States
  const [jobToClose, setJobToClose] = useState<any>(null);
  const [closeReason, setCloseReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Selection Handlers
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === activeJobs.length) setSelectedIds([]);
    else setSelectedIds(activeJobs.map((j) => j.id));
  };

  const handleBulkExport = () => {
    alert(`Exporting ${selectedIds.length} jobs to CSV...`);
    setSelectedIds([]);
  };

  const handleConfirmClose = async () => {
    setIsClosing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const idsToRemove = jobToClose === "bulk" ? selectedIds : [jobToClose.id];
    setActiveJobs((prev) => prev.filter((j) => !idsToRemove.includes(j.id)));
    setIsClosing(false);
    setJobToClose(null);
    setCloseReason("");
    setOtherReason("");
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)] pb-32">
      {/* --- CLOSE REASON POPUP --- */}
      <AnimatePresence>
        {jobToClose && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isClosing && setJobToClose(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-[2rem] p-8 shadow-2xl border-[var(--border-subtle)] overflow-hidden"
            >
              <AnimatePresence>
                {isClosing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[var(--surface)]/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    <h3 className="text-[var(--text-main)] font-bold">
                      Processing Archive
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 tracking-tight">
                Close Listing
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Reason for closing{" "}
                {jobToClose === "bulk"
                  ? `${selectedIds.length} selected jobs`
                  : `"${jobToClose.title}"`}
                ?
              </p>

              <div className="space-y-2 mb-6">
                {[
                  "Position Filled",
                  "Hiring Paused",
                  "Budget Adjustments",
                  "Other",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setCloseReason(reason)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${closeReason === reason ? "border-primary bg-primary/10 text-primary" : "border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-main)] hover:border-primary/40"}`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {closeReason === "Other" && (
                <div className="mb-6">
                  <textarea
                    placeholder="Specify reason..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    className="premium-input rounded-xl p-4 text-sm font-medium h-24 resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setJobToClose(null)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    !closeReason || (closeReason === "Other" && !otherReason)
                  }
                  onClick={handleConfirmClose}
                  className="flex-[2] py-3 rounded-xl bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-500/20 disabled:opacity-30"
                >
                  Confirm Close
                </button>
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
                  Jobs Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkExport}
                  className="px-4 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>{" "}
                  Export
                </button>
                <button
                  onClick={() => setJobToClose("bulk")}
                  className="px-5 py-2 text-xs font-bold bg-red-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    cancel
                  </span>{" "}
                  Close
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-all"
                >
                  <span className="material-symbols-outlined">close</span>
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
              <span>Active Jobs</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              Protocol Jobs
              <span className="text-[var(--text-muted)] ml-3 text-lg font-normal opacity-50">
                {activeJobs.length} positions
              </span>
            </h1>
          </div>
          <button
            onClick={() => router.push("/users/system/jobs/create/details")}
            className="w-full sm:w-auto active-tab-gradient text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
          >
            <span className="material-symbols-outlined text-xl">
              add_circle
            </span>{" "}
            Create Job
          </button>
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
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.length === activeJobs.length ? "bg-primary border-primary text-white" : "border-[var(--border-subtle)] bg-[var(--input-bg)] group-hover:border-primary/50"}`}
                >
                  {selectedIds.length === activeJobs.length && (
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
                  className="w-full bg-transparent border-none rounded-2xl pl-10 pr-6 py-3.5 text-sm text-[var(--text-main)] focus:ring-0 placeholder:text-[var(--text-muted)] font-medium"
                  placeholder="Search by title or keyword..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-1 w-full lg:w-auto">
              <ModernDropdown
                label="Department"
                selected={selectedDept}
                setSelected={setSelectedDept}
                options={["Engineering", "Design", "Marketing", "Security"]}
              />
              <ModernDropdown
                label="Status"
                selected={selectedStatus}
                setSelected={setSelectedStatus}
                options={["Active", "Draft", "Paused"]}
              />
              <button className="bg-[var(--input-bg)] hover:bg-primary/10 text-[var(--text-main)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 px-4 py-2 text-sm font-semibold h-[46px]">
                <span className="material-symbols-outlined text-lg opacity-60">
                  tune
                </span>{" "}
                Refine
              </button>
            </div>
          </div>
        </section>

        {/* Job Cards List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedIds.includes(job.id)}
                onSelect={() => toggleSelect(job.id)}
                onClose={() => setJobToClose(job)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        <footer className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            Showing{" "}
            <span className="text-[var(--text-main)]">{activeJobs.length}</span>{" "}
            of {activeJobs.length} active Jobs
          </p>
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

function JobCard({ job, onClose, isSelected, onSelect }: any) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      layout
      variants={itemVariants}
      exit={{ opacity: 0, x: -20 }}
      // FIX: Dynamic z-index so the open menu card stays on top of the cards below it
      style={{ zIndex: isMenuOpen ? 150 : 1 }}
      className={`glass-panel rounded-[24px] p-6 md:p-7 flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-8 transition-all group relative overflow-visible shadow-sm ${isSelected ? "border-primary ring-1 ring-primary/20 bg-primary/[0.02]" : "hover:border-primary/30"}`}
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
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${job.cat === "internal" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-purple-500/10 text-purple-600 border-purple-500/20"}`}
              >
                <span className="material-symbols-outlined text-[12px]">
                  {job.cat === "internal" ? "shield_person" : "public"}
                </span>
                {job.cat.toUpperCase()}
              </span>
              {job.tag && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${job.tagColor === "primary" ? "bg-primary/10 text-primary border-primary/10" : "bg-orange-500/10 text-orange-600 border-orange-500/10"}`}
                >
                  {job.tag}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary/60">
                hub
              </span>
              {job.dept}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-primary/60">
                location_on
              </span>
              {job.location}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full xl:flex-1 xl:px-10">
        <div className="flex justify-between items-end mb-3 text-xs font-semibold">
          <div className="flex gap-4">
            <span className="text-[var(--text-main)]">
              {job.stats.applied}{" "}
              <span className="text-[var(--text-muted)] font-normal ml-0.5">
                Applied
              </span>
            </span>
            <span className="text-[var(--text-main)]">
              {job.stats.screening}{" "}
              <span className="text-[var(--text-muted)] font-normal ml-0.5">
                Screening
              </span>
            </span>
            <span className="text-[var(--text-main)]">
              {job.stats.interview}{" "}
              <span className="text-[var(--text-muted)] font-normal ml-0.5">
                Interviews
              </span>
            </span>
          </div>
          <span className="text-primary font-bold">
            {job.stats.total} Total
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full flex gap-0.5 overflow-hidden p-0.5 border border-[var(--border-subtle)]">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${(job.stats.applied / job.stats.total) * 100}%` }}
          />
          <div
            className="h-full rounded-full bg-primary/40"
            style={{
              width: `${(job.stats.screening / job.stats.total) * 100}%`,
            }}
          />
          <div
            className="h-full rounded-full bg-primary/20"
            style={{
              width: `${(job.stats.interview / job.stats.total) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end gap-8 pt-6 xl:pt-0 border-t border-[var(--border-subtle)] xl:border-none">
        <div className="flex -space-x-2.5">
          {job.hiringTeam.map((member: any, i: any) => (
            <img
              key={i}
              className="w-9 h-9 rounded-xl border-2 border-[var(--background)] object-cover bg-white shadow-sm ring-1 ring-black/5"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`}
              alt="Team"
            />
          ))}
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            className="active-tab-gradient text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-glow hover:translate-y-[-1px] transition-all"
            onClick={() =>
              router.push(
                `/users/system/jobs/active_jobs/candidate_list?jobCat=${job.cat}`,
              )
            }
          >
            Access Pipeline
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
                    <MenuButton icon="edit" label="Edit Protocol" />
                    <MenuButton icon="visibility" label="View Careers Page" />
                    <div className="h-px bg-[var(--border-subtle)] my-1.5 mx-2" />
                    <MenuButton
                      icon="cancel"
                      label="Close Listing"
                      isDanger
                      onClick={() => {
                        setIsMenuOpen(false);
                        onClose();
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
      </div>
    </motion.div>
  );
}

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
        className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 h-[46px] flex items-center justify-between gap-3 hover:border-primary/50 transition-all"
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
