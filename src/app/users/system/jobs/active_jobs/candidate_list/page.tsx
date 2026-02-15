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
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function JobPipelinePage() {
  const [isReviewingMatches, setIsReviewingMatches] = useState(false);
  const router = useRouter();

  const stats = [
    { label: "Total Candidates", value: "142", trend: "+12%", active: true },
    { label: "Screening", value: "45", subtitle: "Active" },
    { label: "Reviewing", value: "12", subtitle: "Priority", isPrimary: true },
    { label: "Interviewing", value: "8", subtitle: "Scheduled" },
    { label: "Offer", value: "2", subtitle: "Final Stage" },
  ];

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
      isUnicorn: true,
    },
    {
      name: "Elena Volkov",
      info: "ZKP Specialist • 4 yrs exp.",
      status: "Screening",
      updated: "3h ago",
      skills: ["Math", "Privacy"],
    },
  ];

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
                Senior Blockchain Engineer
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary/70">
                location_on
              </span>
              Remote, Global • Published 12 days ago
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/users/system/jobs/create/details")}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-main)] font-semibold text-sm hover:border-primary/50 transition-all flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-xl opacity-70">
                edit_note
              </span>
              Edit Job
            </button>
            <button className="p-2.5 rounded-xl active-tab-gradient text-white shadow-glow">
              <span className="material-symbols-outlined text-xl">
                visibility
              </span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((s, i) => (
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

        {/* AI Insight Bar - Kept the Shine */}
        <motion.div
          layout
          className="glass-panel rounded-[2rem] p-6 md:p-8 border-l-4 border-l-primary mb-12 relative overflow-hidden shadow-glow transition-all"
        >
          {/* Shine effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-[80px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-glow">
                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-3">
                    AI Analysis Engine
                    <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold tracking-tight border border-primary/20">
                      Protocol Sync: 100%
                    </span>
                  </h4>
                  <p className="text-[var(--text-muted)] text-sm mt-1 max-w-2xl font-medium leading-relaxed">
                    Analyzing historical candidate nodes and neural weightings.
                    Detected 3 high-probability matches matching your tech
                    stack.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewingMatches(!isReviewingMatches)}
                className={`flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-xl text-xs transition-all shadow-premium ${
                  isReviewingMatches
                    ? "bg-[var(--input-bg)] text-[var(--text-main)]"
                    : "active-tab-gradient text-white hover:scale-105"
                }`}
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
                    {aiMatches.map((c, i) => (
                      <div
                        key={i}
                        className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.avatar}`}
                            className="w-12 h-12 rounded-xl bg-[var(--background)] shadow-sm"
                            alt=""
                          />
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary tracking-tighter">
                              {c.score}%
                            </div>
                            <div className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-tighter">
                              Match Index
                            </div>
                          </div>
                        </div>
                        <h5 className="font-bold text-[var(--text-main)] mb-1">
                          {c.name}
                        </h5>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold mb-4 border border-emerald-500/10">
                          {c.status}
                        </span>
                        <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                          <div>
                            <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-tighter">
                              Top Strength
                            </p>
                            <p className="text-xs font-semibold text-[var(--text-main)]">
                              {c.strength}
                            </p>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed italic opacity-80">
                            "{c.bio}"
                          </p>
                        </div>
                        <button className="w-full mt-6 py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all">
                          Initialize Interview
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Filters and Main List */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
            Candidate Pipeline
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
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

function CandidateCard({ candidate }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className={`glass-panel rounded-[2rem] p-7 transition-all shadow-sm border-[var(--border-subtle)] ${candidate.isUnicorn ? "border-primary/30 ring-1 ring-primary/10" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl border border-[var(--border-subtle)] p-0.5 overflow-hidden bg-[var(--surface)] shadow-sm">
            <img
              alt={candidate.name}
              className="w-full h-full object-cover rounded-[0.8rem]"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[var(--text-main)] tracking-tight">
              {candidate.name}
            </h3>
            <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">
              {candidate.info}
            </p>
            <div className="flex gap-3 mt-3">
              <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/10">
                {candidate.status}
              </span>
              <span className="text-[var(--text-muted)] text-[10px] font-medium self-center opacity-60">
                Updated {candidate.updated}
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
          {candidate.skills.map((s: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] text-xs font-semibold border border-[var(--border-subtle)] hover:border-primary/40 transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-[var(--border-subtle)]">
        <button className="flex-grow py-3 rounded-xl active-tab-gradient text-white text-xs font-bold shadow-glow hover:translate-y-[-1px] transition-all">
          {candidate.isUnicorn ? "Manage Offer" : "Move Stage"}
        </button>
        <button className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary/50 transition-all bg-[var(--surface)] shadow-sm">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </button>
        <button className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary/50 transition-all bg-[var(--surface)] shadow-sm">
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
