"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function JobPipelinePage() {
  const [isReviewingMatches, setIsReviewingMatches] = useState(false);
  const router = useRouter();

  const stats = [
    { label: "Total Candidates", value: "142", trend: "+12%", active: true },
    { label: "Screening", value: "45", subtitle: "Active" },
    { label: "Reviewing", value: "12", subtitle: "Priority", isPrimary: true },
    { label: "Interviewing", value: "8", subtitle: "Schedule" },
    { label: "Offer", value: "2", subtitle: "Final Stage" },
  ];

  // Candidates for the main list (Match Score Removed)
  const candidates = [
    {
      name: "Alex Rivers",
      info: "Ex-Consensys • 8 yrs exp.",
      status: "Reviewing",
      updated: "2d ago",
      skills: ["Rust", "Solidity", "Go"],
    },
    {
      name: "Sarah Chen",
      info: "Ex-Coinbase • 5 yrs exp.",
      status: "Interviewing",
      updated: "Today",
      skills: ["L2 Solutions", "DeFi Architecture"],
    },
    {
      name: "Marcus Thorne",
      info: "Open Source • 10 yrs exp.",
      status: "Offer Extended",
      updated: "1w ago",
      skills: ["Protocol", "EVM"],
      // isUnicorn: true,
    },
    {
      name: "Elena Volkov",
      info: "ZKP Specialist • 4 yrs exp.",
      status: "Screening",
      updated: "3h ago",
      skills: ["Math", "Privacy"],
    },
  ];

  // Detailed AI Pipeline Candidates (With Match Scores and Detailed Info)
  const aiMatches = [
    {
      name: "Marcus Thorne",
      score: 98,
      status: "New Match",
      strength: "Rust / EVM Architecture",
      bio: "High contribution to Ethereum core repos. Expert in low-level protocol optimization.",
      avatar: "Marcus",
    },
    {
      name: "Julian Voss",
      score: 96,
      status: "New Match",
      strength: "Cryptography / Zero-Knowledge",
      bio: "Lead author on several ZK-Rollup implementations. PhD in Applied Math.",
      avatar: "Julian",
    },
    {
      name: "Lina Wert",
      score: 94,
      status: "New Match",
      strength: "Full-Stack Web3 / Go",
      bio: "Built scalable indexing protocols. Strong focus on decentralized data availability.",
      avatar: "Lina",
    },
  ];

  return (
    <div className="min-h-screen rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)]">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-8">
          <Link
            href="/users/system/jobs/active_jobs"
            className="hover:text-primary transition-colors"
          >
            Active Jobs
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="text-primary font-black">Candidate List</span>
        </nav>

        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">
                Senior Blockchain Engineer
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>{" "}
                Active
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">
                location_on
              </span>
              Remote, Global • Published 12 days ago
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 rounded-xl border border-primary/30 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center gap-2"
              onClick={() => {
                router.push("/users/system/jobs/create/details");
              }}
            >
              <span className="material-symbols-outlined text-lg">
                edit_note
              </span>{" "}
              Edit
            </button>
            <button className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-glow hover:shadow-glow-strong transition-all">
              <span className="material-symbols-outlined text-lg">
                visibility
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`glass-panel p-5 rounded-[1.5rem] border-l-4 ${s.active ? "border-l-primary/60" : "border-l-transparent"}`}
            >
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">
                {s.label}
              </p>
              <div className="flex items-end justify-between">
                <span
                  className={`text-2xl md:text-3xl font-black ${s.isPrimary ? "text-primary" : "text-[var(--text-main)]"} tracking-tighter`}
                >
                  {s.value}
                </span>
                {s.trend && (
                  <span className="text-primary text-[10px] font-black">
                    {s.trend}
                  </span>
                )}
                {s.subtitle && (
                  <span className="text-[var(--text-muted)] text-[9px] font-black uppercase opacity-60 italic">
                    {s.subtitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Bar - Detailed Version */}
        <motion.div
          layout
          className="glass-panel rounded-[2.5rem] p-6 md:p-8 border-l-4 border-l-primary mb-10 relative overflow-hidden shadow-glow transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-glow border border-primary/20">
                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-lg tracking-tight text-[var(--text-main)] uppercase flex items-center gap-2">
                    AI Analysis Engine
                    <span className="px-2 py-0.5 rounded-lg bg-primary text-[var(--background)] text-[9px] uppercase font-black tracking-widest">
                      Protocol Sync: 100%
                    </span>
                  </h4>
                  <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1 max-w-2xl font-medium leading-relaxed">
                    Analyzing neural weights for candidate suitability. 3
                    high-probability nodes detected in the external database.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewingMatches(!isReviewingMatches)}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 font-black rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all shadow-premium ${isReviewingMatches ? "bg-[var(--input-bg)] text-[var(--text-main)]" : "bg-primary text-[var(--background)] hover:scale-105"}`}
              >
                {isReviewingMatches ? "Close Detailed view" : "Review Matches"}
                <span
                  className={`material-symbols-outlined text-sm transition-transform ${isReviewingMatches ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>
            </div>

            <AnimatePresence>
              {isReviewingMatches && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-primary/10">
                    {aiMatches.map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-primary/[0.03] border border-primary/20 rounded-[2rem] p-6 hover:border-primary/50 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`}
                            className="w-12 h-12 rounded-xl bg-[var(--background)] border border-primary/10"
                            alt=""
                          />
                          <div className="text-right">
                            <div className="text-2xl font-black text-primary italic leading-none">
                              {c.score}%
                            </div>
                            <div className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">
                              Match Index
                            </div>
                          </div>
                        </div>
                        <h5 className="font-black text-[var(--text-main)] uppercase tracking-tight mb-1">
                          {c.name}
                        </h5>
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500 text-white text-[8px] font-black uppercase mb-3">
                          {c.status}
                        </span>

                        <div className="space-y-3 mt-4 pt-4 border-t border-primary/10">
                          <div>
                            <p className="text-[8px] font-black text-primary uppercase mb-1">
                              Top Strength
                            </p>
                            <p className="text-[10px] font-bold text-[var(--text-main)]">
                              {c.strength}
                            </p>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed italic">
                            "{c.bio}"
                          </p>
                        </div>

                        <button className="w-full mt-5 py-2.5 rounded-xl border border-primary/20 text-primary text-[9px] font-black uppercase hover:bg-primary hover:text-[var(--background)] transition-all">
                          Initialize Interview
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Filters and Main List */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight italic">
            Candidate Nodes
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                className="premium-input pl-10 pr-4 py-2.5 rounded-xl text-[var(--text-main)] font-bold text-xs w-full md:w-64"
                placeholder="Search identity..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-primary transition-all">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>{" "}
              Refine
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {candidates.map((c, i) => (
            <CandidateCard key={i} candidate={c} />
          ))}
        </motion.div>

        <footer className="mt-12 flex justify-center">
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
function CandidateCard({ candidate }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className={`glass-panel rounded-[2rem] p-6 transition-all shadow-sm hover:shadow-md border-[var(--border-subtle)] ${candidate.isUnicorn ? "border-primary/40 shadow-glow" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-primary/20 p-0.5 overflow-hidden bg-[var(--surface)]">
            <img
              alt={candidate.name}
              className="w-full h-full object-cover rounded-xl"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
            />
          </div>
          <div>
            <h3 className="font-black text-lg text-[var(--text-main)] tracking-tight uppercase">
              {candidate.name}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wide opacity-80">
              {candidate.info}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                {candidate.status}
              </span>
              <span className="text-[var(--text-muted)] text-[9px] font-black uppercase opacity-60 self-center">
                {candidate.updated}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest mb-3 opacity-60">
          Technical Synergy
        </div>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((s: string, idx: number) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] text-[10px] font-black uppercase tracking-tighter border border-[var(--border-subtle)] transition-colors hover:border-primary"
            >
              {s}
            </span>
          ))}
          {candidate.extra && (
            <span className="px-2.5 py-1 rounded-lg bg-[var(--input-bg)] text-[var(--text-muted)] text-[10px] font-black border border-[var(--border-subtle)]">
              +{candidate.extra} Nodes
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
        <button className="flex-grow py-3 rounded-xl bg-primary text-[var(--background)] text-[10px] font-black uppercase tracking-widest hover:shadow-glow transition-all active:scale-95">
          {candidate.isUnicorn ? "Manage Offer" : "Move Stage"}
        </button>
        <button className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </button>
        <button className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl">
            person_search
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function PaginationButton({ label, icon, active, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${active ? "bg-primary/20 text-primary border-primary/30" : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary"}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-xs font-black">{label}</span>
      )}
    </button>
  );
}
