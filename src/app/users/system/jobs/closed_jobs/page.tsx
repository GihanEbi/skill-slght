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

export default function ClosedJobsPage() {
  const router = useRouter();

  // Data State - Specific to Closed Jobs
  const [closedJobs, setClosedJobs] = useState([
    {
      id: 1,
      title: "Senior Product Designer",
      cat: "external",
      dept: "Design",
      location: "San Francisco, CA",
      dateClosed: "Oct 24, 2023",
      timeToFill: "34 Days",
      hiredCandidate: { name: "Sarah Jenkins", avatar: "Sarah" },
      stats: { applied: 142, interview: 12, offer: 1, total: 142 },
    },
    {
      id: 2,
      title: "Staff Rust Engineer",
      cat: "external",
      dept: "Engineering",
      location: "Remote",
      dateClosed: "Oct 15, 2023",
      timeToFill: "45 Days",
      hiredCandidate: { name: "David Miller", avatar: "David" },
      stats: { applied: 89, interview: 8, offer: 1, total: 89 },
    },
    {
      id: 3,
      title: "Marketing Lead",
      cat: "internal",
      dept: "Marketing",
      location: "London, UK",
      dateClosed: "Sep 28, 2023",
      timeToFill: "28 Days",
      hiredCandidate: { name: "Michael Chen", avatar: "Michael" },
      stats: { applied: 56, interview: 4, offer: 1, total: 56 },
    },
  ]);

  // UI States
  const [selectedDept, setSelectedDept] = useState("Engineering");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isReopening, setIsReopening] = useState(false);
  const [jobToReopen, setJobToReopen] = useState<any>(null);

  // Selection Handlers
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === closedJobs.length) setSelectedIds([]);
    else setSelectedIds(closedJobs.map((j) => j.id));
  };

  // Handlers
  const handleBulkExport = () => {
    alert(`Exporting archive for ${selectedIds.length} protocols...`);
    setSelectedIds([]);
  };

  const handleReopen = async (job: any) => {
    setJobToReopen(job);
    setIsReopening(true);
    // Simulate protocol reactivation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setClosedJobs((prev) => prev.filter((j) => j.id !== job.id));
    setIsReopening(false);
    setJobToReopen(null);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)] pb-32">
      {/* --- REOPEN LOADER OVERLAY --- */}
      <AnimatePresence>
        {isReopening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center bg-[var(--background)]/60 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="text-center">
                <h3 className="text-[var(--text-main)] font-bold text-lg">
                  Reactivating Protocol
                </h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  Restoring {jobToReopen?.title} to active state...
                </p>
              </div>
            </div>
          </motion.div>
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
                  Archive Selected
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
              <span className="opacity-60 text-[var(--text-muted)]">
                Jobs
              </span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Closed Jobs</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              Closed Jobs
              <span className="text-[var(--text-muted)] ml-3 text-lg font-normal opacity-50">
                {closedJobs.length} records
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
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.length === closedJobs.length ? "bg-primary border-primary text-white" : "border-[var(--border-subtle)] bg-[var(--input-bg)] group-hover:border-primary/50"}`}
                >
                  {selectedIds.length === closedJobs.length && (
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
                options={["Engineering", "Design", "Marketing", "Security"]}
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

        {/* Closed Job Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {closedJobs.map((job) => (
              <ClosedJobCard
                key={job.id}
                job={job}
                isSelected={selectedIds.includes(job.id)}
                onSelect={() => toggleSelect(job.id)}
                onReopen={() => handleReopen(job)}
              />
            ))}
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

function ClosedJobCard({ job, onReopen, isSelected, onSelect }: any) {
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
            <img
              className="w-8 h-8 rounded-lg border border-[var(--border-subtle)]"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.hiredCandidate.avatar}`}
              alt="Hired"
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
                  <MenuButton icon="visibility" label="View Job Details" />
                  <MenuButton icon="download" label="Download Report" />
                  <div className="h-px bg-[var(--border-subtle)] my-1.5 mx-2" />
                  <MenuButton icon="delete" label="Delete Permanent" isDanger />
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
