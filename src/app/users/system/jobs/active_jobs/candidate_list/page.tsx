"use client";
import React, { Suspense, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

function JobPipelineDetailPage() {
  const [isReviewingMatches, setIsReviewingMatches] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Loader states for Email
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const jobCat = searchParams.get("jobCat");

  const stats = [
    { label: "Total Candidates", value: "142", trend: "+12%", active: true },
    { label: "Screening", value: "45", subtitle: "Active" },
    { label: "Reviewing", value: "12", subtitle: "Priority", isPrimary: true },
    { label: "Interviewing", value: "8", subtitle: "Scheduled" },
    { label: "Offer", value: "2", subtitle: "Final Stage" },
  ];

  const [candidates, setCandidates] = useState([
    {
      name: "Alex Rivers",
      info: "Ex-Consensys • 8 yrs exp.",
      status: "Reviewing",
      updated: "2d ago",
      skills: ["Rust", "Solidity", "Go"],
      avatar: "alkesh.png",
    },
    {
      name: "Sarah Chen",
      info: "Ex-Coinbase • 5 yrs exp.",
      status: "Interviewing",
      updated: "Today",
      skills: ["L2 Solutions", "DeFi Architecture"],
      avatar: "ankit.png",
    },
    {
      name: "Marcus Thorne",
      info: "Open Source • 10 yrs exp.",
      status: "Offer Extended",
      updated: "1w ago",
      skills: ["Protocol", "EVM"],
      isUnicorn: true,
      avatar: "user-preview.png",
    },
    {
      name: "Elena Volkov",
      info: "ZKP Specialist • 4 yrs exp.",
      status: "Screening",
      updated: "3h ago",
      skills: ["Math", "Privacy"],
      avatar: "gihan.jpeg",
    },
  ]);

  const [aiMatches, setAiMatches] = useState([
    {
      name: "Marcus Thorne",
      score: 98,
      status: "New Match",
      strength: "Rust / EVM Architecture",
      bio: "High contribution to Ethereum core repos. Expert in low-level protocol optimization.",
      avatar: "gihan.jpeg",
      skills: ["Math", "Privacy"],
    },
    {
      name: "Julian Voss",
      score: 96,
      status: "New Match",
      strength: "Cryptography / Zero-Knowledge",
      bio: "Lead author on several ZK-Rollup implementations. PhD in Applied Math.",
      avatar: "avatar-2.jpg",
      skills: ["Math", "Privacy"],
    },
    {
      name: "Lina Wert",
      score: 94,
      status: "New Match",
      strength: "Full-Stack Web3 / Go",
      bio: "Built scalable indexing protocols. Strong focus on decentralized data availability.",
      avatar: "avatar-4.jpg",
      skills: ["Math", "Privacy"],
    },
  ]);

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
  const handleAddToCandidates = useCallback(async (candidate: any) => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const tempCandidate = {
      name: candidate.name,
      info: candidate.bio,
      status: "Reviewing",
      updated: "Just now",
      skills: candidate.skills,
      avatar: candidate.avatar,
    };
    setCandidates((prev) => [...prev, tempCandidate]);
    setAiMatches((prev) => prev.filter((item) => item.name !== candidate.name));
    setIsAdding(false);
  }, []);

  return (
    <div className="min-h-screen rounded-3xl mesh-gradient no-scrollbar bg-[var(--background)]">
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
              {jobCat && (
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${jobCat === "internal" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-purple-500/10 text-purple-600 border-purple-500/20"}`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {jobCat === "internal" ? "shield_person" : "public"}
                  </span>
                  {jobCat.charAt(0).toUpperCase() + jobCat.slice(1)}
                </span>
              )}
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
                  {aiMatches.map((c, i) => (
                    <div
                      key={i}
                      className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <Image
                          src={`/images/avatar-img/${c.avatar}`}
                          width={100}
                          height={100}
                          alt={c.name}
                          className="w-12 h-12 rounded-xl bg-[var(--background)] shadow-sm"
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
                      <button
                        className="w-full mt-6 py-2.5 rounded-xl border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                        onClick={() => {
                          handleAddToCandidates(c);
                        }}
                      >
                        Insert to pipeline
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
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {candidates.map((c: any, i) => (
                <CandidateCard
                  key={c.name}
                  candidate={c}
                  onEmailClick={openEmailModal}
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

const CandidateCard = memo(({ candidate, onEmailClick }: any) => {
  const router = useRouter();
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      className={`glass-panel rounded-[2rem] p-7 transition-all shadow-sm border-[var(--border-subtle)] ${candidate.isUnicorn ? "border-primary/30 ring-1 ring-primary/10" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl border border-[var(--border-subtle)] p-0.5 overflow-hidden bg-[var(--surface)] shadow-sm">
            <Image
              src={`/images/avatar-img/${candidate.avatar}`}
              width={100}
              height={100}
              alt={candidate.name}
              className="w-full h-full object-cover rounded-[0.8rem]"
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
        <button
          className="flex-grow py-3 rounded-xl active-tab-gradient text-white text-xs font-bold shadow-glow hover:translate-y-[-1px] transition-all"
          onClick={() => {
            router.push(
              candidate.isUnicorn
                ? `/users/system/jobs/active_jobs/candidate_list/${candidate.name.toLowerCase().replace(" ", "-")}`
                : `/users/system/jobs/active_jobs/candidate_list/${candidate.name.toLowerCase().replace(" ", "-")}`,
            );
          }}
        >
          {candidate.isUnicorn ? "Manage Offer" : "Move Stage"}
        </button>
        <button
          onClick={() => onEmailClick(candidate)}
          className="p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary hover:border-primary/50 transition-all bg-[var(--surface)] shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
        </button>
      </div>
    </motion.div>
  );
});
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
