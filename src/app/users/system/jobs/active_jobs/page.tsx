"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Softening the staggered entry
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
  const [activeJobs] = useState([
    {
      id: 1,
      title: "Senior Blockchain Engineer",
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

  const [selectedDept, setSelectedDept] = useState("Engineering");
  const [selectedStatus, setSelectedStatus] = useState("Active");

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)]">
      <main className="w-full px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div className="space-y-2">
            <nav className="flex text-xs font-semibold text-primary items-center gap-2">
              <span className="opacity-60 text-[var(--text-muted)]">Jobs</span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Active Pipeline</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              Protocol Pipeline
              <span className="text-[var(--text-muted)] ml-3 text-lg font-normal opacity-50">
                12 positions
              </span>
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/users/system/jobs/create/details")}
            className="w-full sm:w-auto active-tab-gradient text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
          >
            <span className="material-symbols-outlined text-xl">
              add_circle
            </span>
            Create Job
          </motion.button>
        </header>

        {/* Filter Bar */}
        <section className="glass-panel rounded-[24px] p-2 mb-10 border-[var(--border-subtle)] shadow-sm relative z-[100]">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="relative w-full lg:flex-1">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl opacity-60">
                search
              </span>
              <input
                className="w-full bg-transparent border-none rounded-2xl pl-13 pr-6 py-3.5 text-sm text-[var(--text-main)] focus:ring-0 placeholder:text-[var(--text-muted)] font-medium"
                placeholder="Search by title or keyword..."
                type="text"
              />
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
              <button className="bg-[var(--input-bg)] hover:bg-primary/10 text-[var(--text-main)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 px-4 py-2 text-sm transition-all font-semibold h-[46px]">
                <span className="material-symbols-outlined text-lg opacity-60">
                  tune
                </span>
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
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </motion.div>

        <footer className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            Showing <span className="text-[var(--text-main)]">1 - 3</span> of 12
            active protocols
          </p>
          <div className="flex gap-2">
            <PaginationButton icon="chevron_left" disabled />
            <PaginationButton label="1" active />
            <PaginationButton label="2" />
            <PaginationButton icon="chevron_right" />
          </div>
        </footer>
      </main>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      style={{ zIndex: isMenuOpen ? 50 : 1 }}
      className="glass-panel rounded-[24px] p-6 md:p-7 flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-8 hover:border-primary/30 transition-all group relative overflow-visible shadow-sm"
    >
      <div className="flex flex-col gap-3 w-full xl:w-1/4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          {job.tag && (
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${
                job.tagColor === "primary"
                  ? "bg-primary/10 text-primary border-primary/10"
                  : "bg-orange-500/10 text-orange-600 border-orange-500/10"
              }`}
            >
              {job.tag}
            </span>
          )}
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
            <span className="text-[var(--text-main)]">
              {job.stats.offer}{" "}
              <span className="text-[var(--text-muted)] font-normal ml-0.5">
                Offers
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
          {job.hiringTeam.map((member: string, i: number) => (
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
              router.push(`/users/system/jobs/active_jobs/candidate_list`)
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
                    className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl border border-[var(--glass-border)] shadow-xl overflow-hidden backdrop-blur-3xl p-1.5 z-[100]"
                  >
                    <MenuButton icon="edit" label="Edit Protocol" />
                    <MenuButton icon="visibility" label="View Careers Page" />
                    <div className="h-px bg-[var(--border-subtle)] my-1.5 mx-2" />
                    <MenuButton icon="cancel" label="Close Listing" isDanger />
                  </motion.div>
                  <div
                    className="fixed inset-0 z-[80]"
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

function MenuButton({ icon, label, isDanger }: any) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
        isDanger
          ? "text-red-500 hover:bg-red-500/10"
          : "text-[var(--text-main)] hover:bg-primary/10 hover:text-primary"
      }`}
    >
      <span className="material-symbols-outlined text-lg opacity-70">
        {icon}
      </span>
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
            className="absolute left-0 right-0 mt-2 glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1 z-[999]"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                  selected === opt
                    ? "text-primary bg-primary/10"
                    : "text-[var(--text-main)] hover:bg-primary/5"
                }`}
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
      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
        active
          ? "bg-primary text-white border-primary shadow-glow"
          : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary hover:border-primary/30 disabled:opacity-30"
      }`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-sm font-bold">{label}</span>
      )}
    </button>
  );
}
