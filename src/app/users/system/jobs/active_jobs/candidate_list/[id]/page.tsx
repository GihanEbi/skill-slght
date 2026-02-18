"use client";
import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function CandidateDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobCat = searchParams.get("jobCat");

  // --- States ---
  const [activeTab, setActiveTab] = useState("Experience");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAiInterview, setShowAiInterview] = useState(false);

  // Loader states for Email
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Loader states for "Advance Candidate"
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const tabs = ["Experience", "Resume", "Skills", "Timeline"];

  // --- Handlers ---
  const handleSendEmail = async () => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    setIsSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setIsSent(false);
    }, 1200);
  };

  const handleAdvanceCandidate = async () => {
    setIsAdvancing(true);
    // Simulate API call to move candidate stage
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAdvancing(false);
    setIsAdvanced(true);
    // Short delay to show success before resetting or navigating
    setTimeout(() => {
      setIsAdvanced(false);
    }, 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Experience":
        return (
          <div className="space-y-10 relative pt-2">
            <div className="absolute left-[7px] top-4 bottom-4 w-px bg-[var(--border-subtle)]" />
            <TimelineItem
              title="Lead Core Developer"
              company="Modular L2 Protocol (Open Source)"
              period="2020 — Present"
              description="Architected a high-throughput consensus engine handling 10k+ TPS. Led a decentralized team of 15 contributors. Managed security audits and mainnet migration."
              tags={["Go", "Solidity", "Cryptography"]}
              active
            />
            <TimelineItem
              title="Senior Software Engineer"
              company="Global Finance Systems"
              period="2016 — 2020"
              description="Optimized HFT execution kernels using C++. Reduced latency by 45% through custom memory management and cache optimization."
              tags={["C++", "Linux Kernel", "HFT"]}
            />
            <TimelineItem
              title="Backend Engineer"
              company="TechScale Solutions"
              period="2013 — 2016"
              description="Developed distributed microservices using Java and Spring Boot. Implemented CI/CD pipelines and automated testing suites."
              tags={["Java", "Spring Boot", "Microservices"]}
            />
          </div>
        );
      case "Resume":
        return (
          <div className="space-y-6">
            <div className="bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">
                  picture_as_pdf
                </span>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                Marcus_Thorne_CV_2024.pdf
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                PDF Document • 2.4 MB • Uploaded 2 days ago
              </p>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-primary text-black font-bold rounded-xl text-xs hover:shadow-glow transition-all">
                  Preview File
                </button>
                <button className="px-6 py-2.5 bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold rounded-xl text-xs hover:border-primary/40 transition-all">
                  Download
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                  Portfolio
                </p>
                <Link
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline flex items-center gap-2"
                >
                  github.com/mthorne-dev{" "}
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">
                  Personal Site
                </p>
                <Link
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline flex items-center gap-2"
                >
                  mthorne.io{" "}
                  <span className="material-symbols-outlined text-sm">
                    open_in_new
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      case "Skills":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkillCategory
              title="Languages"
              skills={["Rust", "Go", "Solidity", "C++", "TypeScript", "Python"]}
            />
            <SkillCategory
              title="Protocols & Tech"
              skills={[
                "EVM",
                "IPFS",
                "Zero Knowledge",
                "Multi-sig Auth",
                "libp2p",
              ]}
            />
            <SkillCategory
              title="Frameworks"
              skills={["Hardhat", "Foundry", "React", "Next.js", "Express"]}
            />
            <SkillCategory
              title="Infrastructure"
              skills={["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"]}
            />
          </div>
        );
      case "Timeline":
        return (
          <div className="space-y-6">
            <AuditLog
              status="Application Received"
              date="Feb 12, 2024"
              details="Candidate applied via protocol referral link."
            />
            <AuditLog
              status="Neural Screening"
              date="Feb 12, 2024"
              details="AI system matched candidate skills with 98% accuracy."
            />
            <AuditLog
              status="Initial Review"
              date="Feb 14, 2024"
              details="Reviewed by Sarah Chen (Engineering Manager)."
            />
            <AuditLog
              status="Stage Advanced"
              date="Today"
              details="Moved to 'Technical Interview' phase."
              active
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] transition-colors duration-300">
      {/* --- ADVANCE CANDIDATE LOADER OVERLAY --- */}
      <AnimatePresence>
        {(isAdvancing || isAdvanced) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center bg-[var(--background)]/60 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isAdvancing ? (
                    <motion.div
                      key="adv-loader"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-2xl animate-pulse">
                        rocket_launch
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="adv-success"
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-glow"
                    >
                      <span className="material-symbols-outlined text-[var(--background)] text-4xl font-bold">
                        check
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-center">
                <h3 className="text-[var(--text-main)] font-bold text-lg tracking-tight">
                  {isAdvanced ? "Stage Updated" : "Updating Pipeline"}
                </h3>
                <p className="text-[var(--text-muted)] text-sm font-medium mt-1">
                  {isAdvanced
                    ? "Marcus Thorne moved to Technical Interview"
                    : "Synchronizing state across protocol nodes..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- AI INTERVIEW POPUP --- */}
      <AnimatePresence>
        {showAiInterview && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiInterview(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-7xl glass-panel rounded-[2rem] overflow-hidden border border-white/10 flex flex-col md:flex-row p-6 gap-6 shadow-2xl z-[160]"
            >
              {/* Main Content Area (flex-[2.5]) */}
              <div className="flex-[2.5] flex flex-col gap-6 overflow-hidden">
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl group">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCECjswL7DVPv7uRXDjiXxihRBLn20zaM-sV0Ra1LxSKk2LFhlaDDhZUcD04nb-O9KAtzgBKzjER5R8GOnpoaKnbZEnErj6LCPHPtsjYzJNLXd780DZRD72F5nmuoOwXI90CNnQQhMSc1qTlBAu9WSTvt06K3Vw4NLynAfYnhSRvi6gvW26E-RpiuZg0TJQOSIw_fSfRDUC6atnQsSHfwqBjaukKtP5NwSdUWnsopePwGnhku4wkI7znObOdxTelFRpIB3iLVW6Dy8')",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="size-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 hover:bg-white/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-6xl translate-x-1">
                        play_arrow
                      </span>
                    </button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-8 px-8 py-4 rounded-full pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 mt-32">
                      <button className="text-white hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-4xl">
                          replay_10
                        </span>
                      </button>
                      <button className="size-14 bg-primary rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">
                          pause
                        </span>
                      </button>
                      <button className="text-white hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-4xl">
                          forward_10
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                      <div className="w-2/3 h-full bg-primary relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-mono text-white/80">
                          14:22 / 22:05
                        </span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full">
                          <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            Reviewing: Marcus Thorne
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button className="text-white hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-2xl">
                            volume_up
                          </span>
                        </button>
                        <button className="text-white hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-2xl">
                            settings
                          </span>
                        </button>
                        <button className="text-white hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-2xl">
                            fullscreen
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 h-32 shrink-0">
                  <div className="glass-panel rounded-2xl p-5 border border-primary/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                        Sentiment Score
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">
                          Positive
                        </span>
                        <div className="flex items-end gap-1 h-6">
                          {[2, 4, 6, 5, 6].map((h, i) => (
                            <div
                              key={i}
                              className="w-1 bg-primary rounded-full"
                              style={{ height: `${h * 4}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-medium">
                        Confidence
                      </p>
                      <p className="text-xl font-bold text-[var(--text-main)]">
                        94%
                      </p>
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl p-5 border border-primary/20 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                        Engagement
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-white">
                          Optimal
                        </span>
                        <span className="material-symbols-outlined text-primary">
                          verified
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-medium">
                        Consistency
                      </p>
                      <p className="text-xl font-bold text-primary">High</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar (w-[400px]) */}
              <aside className="flex-1 flex flex-col gap-4 overflow-hidden w-[400px]">
                <div className="glass-panel flex-1 rounded-2xl flex flex-col overflow-hidden border border-white/10 shadow-xl">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">
                        forum
                      </span>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)]">
                        Conversation
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Live Transcript
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                    <TranscriptBubble
                      role="AI Interviewer"
                      time="08:05"
                      text="Could you describe a situation where you had to reconcile competing technical requirements?"
                      isAi
                    />
                    <TranscriptBubble
                      role="Marcus Thorne"
                      time="08:12"
                      text="In my last project, the infra team wanted maximum security while the dev team needed low-latency testing environments..."
                    />
                    <TranscriptBubble
                      role="AI Interviewer"
                      time="10:45"
                      text="That's an interesting approach. How did you measure the success of that 'tiered' implementation?"
                      isAi
                    />
                  </div>
                  <div className="p-4 bg-black/40 border-t border-white/5">
                    <div className="relative">
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600"
                        placeholder="Search transcript..."
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2 text-slate-500 text-lg">
                        search
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
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
              <AnimatePresence mode="wait">
                {(isSending || isSent) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6"
                  >
                    {isSending ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                        <h3 className="text-[var(--text-main)] font-bold text-lg">
                          Encrypting Transmission
                        </h3>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow mb-4">
                          <span className="material-symbols-outlined text-white text-3xl font-bold">
                            check
                          </span>
                        </div>
                        <h3 className="text-[var(--text-main)] font-bold text-lg">
                          Message Dispatched
                        </h3>
                      </div>
                    )}
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
                    To: Marcus Thorne
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  className="premium-input rounded-xl px-4 py-3 text-sm font-semibold w-full"
                />
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="premium-input rounded-xl p-4 text-sm font-medium resize-none h-40 w-full"
                />
                <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors cursor-pointer bg-[var(--input-bg)]">
                  <span className="material-symbols-outlined text-[var(--text-muted)]">
                    attach_file
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    Upload PDFs or Docs (Max 10MB)
                  </span>
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
        <nav className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-8">
          <Link
            href="/users/system/dashboard"
            className="hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-sm opacity-40">
            chevron_right
          </span>
          <Link
            href="/users/system/jobs/active_jobs"
            className="hover:text-primary transition-colors"
          >
            Jobs
          </Link>
          <span className="material-symbols-outlined text-sm opacity-40">
            chevron_right
          </span>
          <Link
            href="/users/system/jobs/active_jobs/candidate_list"
            className="hover:text-primary transition-colors"
          >
            Candidate List
          </Link>
          <span className="material-symbols-outlined text-sm opacity-40">
            chevron_right
          </span>
          <span className="text-primary">Marcus Thorne</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-2 border-primary overflow-hidden p-1 shadow-glow bg-[var(--surface)]">
                <Image
                  src="/images/avatar-img/user-preview.png"
                  width={100}
                  height={100}
                  alt="Marcus"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-[var(--background)] p-1 rounded-lg flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-lg font-bold">
                  verified
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
                  Marcus Thorne
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                  External Candidate
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
              <p className="text-[var(--text-muted)] text-lg font-medium">
                Senior Software Engineer{" "}
                <span className="opacity-30 mx-2">•</span>{" "}
                <span className="text-primary/90">Open Source Specialist</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm font-medium">
                  <span className="material-symbols-outlined text-base text-primary/70">
                    location_on
                  </span>{" "}
                  Berlin, Germany (Remote)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-primary/40 hover:text-primary transition-all text-xs font-bold flex items-center gap-2 text-[var(--text-muted)] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">
                      mail
                    </span>{" "}
                    Email
                  </button>
                  <a
                    href="https://linkedin.com/in/marcusthorne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-primary/40 hover:text-primary transition-all text-xs font-bold flex items-center gap-2 text-[var(--text-muted)] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">
                      link
                    </span>{" "}
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAiInterview(true)}
              className="px-6 py-3 rounded-xl border border-primary/30 text-primary bg-primary/5 font-bold text-sm hover:bg-primary/10 transition-all flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">
                smart_toy
              </span>{" "}
              Review AI Interview
            </button>
            <button
              onClick={handleAdvanceCandidate}
              disabled={isAdvancing}
              className="px-6 py-3 bg-primary text-[var(--background)] font-bold rounded-xl text-sm hover:shadow-glow-strong transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              Move to Technical Interview{" "}
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-panel rounded-[2rem] p-6 md:p-10 shadow-sm border-[var(--border-subtle)]">
              <div className="flex border-b border-[var(--border-subtle)] gap-8 mb-8 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? "text-primary" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-[2rem] p-8 shadow-sm border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-8">
                Profile Insights
              </h3>
              <div className="space-y-6">
                <StatRow
                  icon="history_edu"
                  label="Experience"
                  value="10+ Years"
                />
                <StatRow
                  icon="payments"
                  label="Expected Salary"
                  value="$220k - $250k USD"
                />
                <StatRow
                  icon="event_available"
                  label="Notice Period"
                  value="Immediate"
                />
                <StatRow
                  icon="translate"
                  label="Languages"
                  value="English, German"
                />
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-8 border-t border-primary/20 relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent shadow-glow">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-8">
                Assessment Scores
              </h3>
              <div className="space-y-6">
                <ProgressItem label="Coding Challenge" score={100} />
                <ProgressItem label="Architecture Interview" score={94} />
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] hover:bg-primary/5 hover:border-primary/30 transition-all">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 2. The Main Component wrapped in Suspense
export default function CandidateDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Profile...
        </div>
      }
    >
      <CandidateDetailContent />
    </Suspense>
  );
}

// --- Internal Helper Components ---

function TranscriptBubble({ role, time, text, isAi = false }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isAi ? (
          <div className="size-4 bg-primary rounded-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-[10px] text-black font-bold">
              smart_toy
            </span>
          </div>
        ) : (
          <div className="size-4 rounded-full bg-slate-700" />
        )}
        <span
          className={`text-[9px] font-bold uppercase tracking-wider ${isAi ? "text-primary" : "text-white"}`}
        >
          {role}
        </span>
        <span className="text-[9px] font-mono text-slate-500 ml-auto">
          {time}
        </span>
      </div>
      <div
        className={`${isAi ? "bg-white/5 border-white/5" : "bg-primary/5 border-primary/10"} rounded-2xl rounded-tl-none p-3 border leading-relaxed text-[11px] text-slate-300`}
      >
        {text}
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  company,
  period,
  description,
  tags,
  active = false,
}: any) {
  return (
    <div className="relative pl-10 group">
      <div
        className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-[var(--background)] z-10 transition-all ${active ? "bg-primary shadow-glow scale-125" : "bg-slate-500"}`}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start gap-1 mb-2">
        <h4 className="font-bold text-lg text-[var(--text-main)]">{title}</h4>
        <span className="text-sm font-semibold text-[var(--text-muted)]">
          {period}
        </span>
      </div>
      <p className="text-primary text-sm font-bold mb-3">{company}</p>
      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 font-medium">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] text-[10px] font-bold border border-[var(--border-subtle)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillCategory({ title, skills }: any) {
  return (
    <div className="space-y-4 mb-6">
      <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: string) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-sm font-semibold"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function AuditLog({ status, date, details, active = false }: any) {
  return (
    <div className="flex gap-4 items-start pb-8 last:pb-0 relative">
      <div className="absolute left-[3px] top-4 bottom-0 w-px bg-[var(--border-subtle)] last:hidden" />
      <div
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 z-10 ${active ? "bg-primary animate-pulse shadow-glow" : "bg-[var(--border-subtle)]"}`}
      />
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold text-[var(--text-main)]">
            {status}
          </span>
          <span className="text-[10px] font-semibold text-[var(--text-muted)]">
            {date}
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] font-medium">
          {details}
        </p>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-5">
      <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)]">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-[var(--text-main)]">{value}</p>
      </div>
    </div>
  );
}

function ProgressItem({ label, score }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="text-primary">{score}/100</span>
      </div>
      <div className="w-full h-1.5 bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1 }}
          className="h-full bg-primary shadow-glow"
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-primary/40 hover:text-primary transition-all text-xs font-bold flex items-center gap-2 text-[var(--text-muted)] shadow-sm">
      <span className="material-symbols-outlined text-base">{icon}</span>{" "}
      {label}
    </button>
  );
}
