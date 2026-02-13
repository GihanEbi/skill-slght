"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1 },
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
      <main className="w-full px-4 md:px-8 py-6 md:py-10 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="space-y-1">
            <nav className="flex text-[9px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">
              <span className="text-primary font-black">Active Jobs</span>
            </nav>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-[var(--text-main)] dark:text-white uppercase italic">
              Protocol Pipeline{" "}
              <span className="text-primary not-italic ml-1 text-sm font-medium opacity-60">
                (12)
              </span>
            </h1>
          </div>
          <Link href="/users/system/jobs/create/details">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>{
                router.push("/users/system/jobs/create/details");
              }}
              className="w-full sm:w-auto active-tab-gradient text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-premium uppercase text-[10px] tracking-[0.2em]"
            >
              <span className="material-symbols-outlined text-lg">
                add_circle
              </span>{" "}
              Create Job
            </motion.button>
          </Link>
        </header>

        {/* Filter Bar */}
        <section className="glass-panel rounded-3xl p-2 mb-8 border-[var(--border-subtle)] shadow-xl relative z-[100] overflow-visible">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="relative w-full lg:flex-1">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl">
                search
              </span>
              <input
                className="w-full bg-transparent border-none rounded-2xl pl-14 pr-6 py-4 text-sm text-[var(--text-main)] focus:ring-0 placeholder:text-[var(--text-muted)] font-medium"
                placeholder="Search protocols..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 p-2 w-full lg:w-auto overflow-visible">
              <ModernDropdown
                label="Dept"
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
              <button className="bg-[var(--input-bg)] hover:bg-primary/10 text-primary rounded-xl border border-[var(--border-subtle)] flex items-center gap-2 px-4 py-2.5 transition-all font-black text-[10px] uppercase tracking-widest h-[42px]">
                <span className="material-symbols-outlined text-lg">tune</span>{" "}
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
          className="grid grid-cols-1 gap-4"
        >
          {activeJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </motion.div>

        <footer className="mt-12 flex flex-col items-center gap-6">
          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest text-center">
            Displaying 1 - 3 of 12 active protocols
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

/**
 * --- Job Card Component ---
 */
function JobCard({ job }: { job: any }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      /* CRITICAL FIX: Higher z-index when menu is open */
      style={{ zIndex: isMenuOpen ? 50 : 1 }}
      className={`glass-panel rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between w-full gap-8 hover:border-primary/40 transition-all group relative overflow-visible shadow-sm hover:shadow-md`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content Section */}
      <div className="flex flex-col gap-4 w-full xl:w-1/4 text-left">
        <div className="flex items-start justify-between xl:justify-start gap-3">
          <h3 className="text-xl font-black text-[var(--text-main)] leading-tight uppercase tracking-tight group-hover:text-primary transition-colors italic">
            {job.title}
          </h3>
          {job.tag && (
            <span
              className={`flex-shrink-0 text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${job.tagColor === "primary" ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}`}
            >
              {job.tag}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">
              hub
            </span>{" "}
            {job.dept}
          </span>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">
              distance
            </span>{" "}
            {job.location}
          </span>
        </div>
      </div>

      {/* Pipeline Visual */}
      <div className="w-full xl:flex-1 xl:px-12">
        <div className="flex justify-between items-end mb-4 text-[10px] font-black uppercase tracking-widest">
          <div className="flex gap-5">
            <span className="text-primary">
              Queue{" "}
              <span className="text-[var(--text-main)] ml-1">
                {job.stats.applied}
              </span>
            </span>
            <span className="text-emerald-600">
              Live{" "}
              <span className="text-[var(--text-main)] ml-1">
                {job.stats.interview}
              </span>
            </span>
          </div>
          <span className="text-primary">{job.stats.total} Leads</span>
        </div>
        <div className="w-full h-1.5 bg-black/[0.03] dark:bg-black/40 rounded-full flex gap-1 overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${(job.stats.applied / job.stats.total) * 100}%` }}
          ></div>
          <div
            className="h-full rounded-full bg-primary/60"
            style={{
              width: `${(job.stats.screening / job.stats.total) * 100}%`,
            }}
          ></div>
          <div
            className="h-full rounded-full bg-primary/30"
            style={{
              width: `${(job.stats.interview / job.stats.total) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Team & Actions */}
      <div className="flex items-center justify-between w-full xl:w-auto xl:justify-end gap-10 pt-6 xl:pt-0 border-t border-[var(--border-subtle)] xl:border-none">
        <div className="flex -space-x-3">
          {job.hiringTeam.map((member: string, i: number) => (
            <img
              key={i}
              className="w-10 h-10 rounded-2xl border-2 border-[var(--background)] object-cover bg-white shadow-md"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`}
              alt="Team"
            />
          ))}
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            className="active-tab-gradient text-white font-black px-6 py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-glow hover:scale-105 transition-all"
            onClick={() => {
              router.push(`/users/system/jobs/active_jobs/candidate_list`);
            }}
          >
            Access Pipeline
          </button>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`w-11 h-11 flex items-center justify-center transition-all glass-panel rounded-xl ${isMenuOpen ? "text-primary border-primary shadow-glow" : "text-[var(--text-muted)] hover:text-primary"}`}
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
                    className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1.5 z-[100]"
                  >
                    <MenuButton icon="edit" label="Edit Protocol" />
                    <MenuButton icon="visibility" label="View Careers Page" />
                    <div className="h-px bg-[var(--border-subtle)] my-1 mx-2" />
                    <MenuButton icon="cancel" label="Close Listing" isDanger />
                  </motion.div>
                  {/* Invisible Backdrop to close on outside click */}
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

/** * Dropdown Menu Item Component
 */
function MenuButton({
  icon,
  label,
  isDanger,
}: {
  icon: string;
  label: string;
  isDanger?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDanger ? "text-red-500 hover:bg-red-500/10" : "text-[var(--text-main)] hover:bg-primary/10 hover:text-primary"}`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      {label}
    </button>
  );
}

/** Standard Helpers */
function ModernDropdown({ label, selected, setSelected, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-w-[140px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 h-[42px] flex items-center justify-between gap-3 hover:border-primary group transition-all"
      >
        <div className="flex flex-col items-start">
          <span className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-tighter leading-none mb-0.5">
            {label}
          </span>
          <span className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest truncate">
            {selected}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="material-symbols-outlined text-primary text-lg"
        >
          expand_more
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden backdrop-blur-3xl p-1 z-[999]"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${selected === opt ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
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
      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${active ? "bg-primary/20 text-primary border-primary/30 shadow-glow" : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary disabled:opacity-20"}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-xs font-black">{label}</span>
      )}
    </button>
  );
}
