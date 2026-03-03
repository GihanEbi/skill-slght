"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { CandidateStatus } from "@/types/candidate_types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawData = localStorage.getItem("all-candidates");
    if (rawData) {
      try {
        const storedCandidates = JSON.parse(rawData);
        if (Array.isArray(storedCandidates)) {
          const found = storedCandidates.find((c: any) => c.id === id);
          if (found) {
            setCandidate(found);
          }
        }
      } catch (e) {
        console.error("Error retrieving candidate data:", e);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center">
        <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen mesh-gradient flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-red-500 text-5xl">
            person_off
          </span>
        </div>
        <h1 className="text-3xl font-bold text-(--text-main) mb-4">
          Candidate Not Found
        </h1>
        <p className="text-(--text-muted) mb-8">
          The candidate profile you are looking for does not exist or has been
          removed.
        </p>
        <button
          onClick={() => router.push("/users/system/candidates/all_candidates")}
          className="active-tab-gradient text-white font-bold px-8 py-4 rounded-2xl shadow-premium"
        >
          Return to Database
        </button>
      </div>
    );
  }

  // Formatting helpers
  const fullName =
    `${candidate.firstName || candidate.step1?.firstName || ""} ${candidate.lastName || candidate.step1?.lastName || ""}`.trim();
  const status = candidate.status || candidate.step2?.status || "active";
  const email = candidate.email || candidate.step1?.email || "—";
  const phone = candidate.phone || candidate.step1?.phone || "—";
  const country = candidate.country || candidate.step1?.country || "—";
  const city = candidate.city || candidate.step1?.city || "—";
  const timezone = candidate.timezone || candidate.step1?.timezone || "—";
  const linkedInUrl = candidate.linkedInUrl || candidate.step1?.linkedInUrl;
  const portfolioUrl = candidate.portfolioUrl || candidate.step1?.portfolioUrl;

  const currentJob =
    candidate.currentJobTitle || candidate.step2?.currentJobTitle || "—";
  const currentCompany =
    candidate.currentCompany || candidate.step2?.currentCompany || "—";
  const salary =
    `${candidate.currentSalaryCurrency || candidate.step2?.currentSalaryCurrency || ""} ${candidate.currentSalary || candidate.step2?.currentSalary || ""}`.trim() ||
    "—";
  const availability =
    candidate.availabilityStatus || candidate.step2?.availabilityStatus || "—";

  const skills = candidate.skills || candidate.step3?.skills || [];
  const workExperience =
    candidate.workExperience || candidate.step4?.workExperience || [];
  const education = candidate.education || candidate.step5?.education || [];
  const tags = candidate.tags || candidate.step7?.tags || [];
  const internalNotes =
    candidate.internalNotes ||
    candidate.step7?.internalNotes ||
    "No internal notes added.";

  return (
    <div className="min-h-screen mesh-gradient pb-20 no-scrollbar">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 md:py-12">
        {/* Top Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.back()}
            className="size-10 rounded-xl bg-(--surface) border border-(--border-subtle) flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex text-xs font-semibold items-center gap-2">
            <button
              onClick={() =>
                router.push("/users/system/candidates/all_candidates")
              }
              className="text-(--text-muted) opacity-60 hover:text-primary hover:opacity-100 transition-all cursor-pointer"
            >
              All Candidates
            </button>
            <span className="text-(--text-muted) opacity-40">/</span>
            <span className="text-primary">{fullName}</span>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Main Info Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-12 glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle) shadow-premium overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div className="size-32 md:size-40 rounded-4xl border-4 border-primary/20 p-1 bg-(--surface) shadow-glow relative">
                <Image
                  src={
                    candidate.profilePhotoUrl ||
                    candidate.step1?.profilePhotoUrl ||
                    candidate.step1?.profilePhoto ||
                    "/images/avatar-img/avatar-1.jpg"
                  }
                  alt={fullName}
                  width={160}
                  height={160}
                  className="rounded-4xl object-cover w-full h-full"
                />
                <div className="absolute -bottom-2 -right-2 size-8 bg-emerald-500 rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-base">
                    verified
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-(--text-main)">
                    {fullName}
                  </h1>
                  <StatusBadge status={status} />
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  <ContactInfo icon="mail" value={email} />
                  <ContactInfo icon="call" value={phone} />
                  <ContactInfo
                    icon="location_on"
                    value={`${city}, ${country}`}
                  />
                  <ContactInfo icon="schedule" value={timezone} />
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {linkedInUrl && (
                    <SocialButton
                      icon="share"
                      label="LinkedIn"
                      href={linkedInUrl}
                    />
                  )}
                  {portfolioUrl && (
                    <SocialButton
                      icon="language"
                      label="Portfolio"
                      href={portfolioUrl}
                    />
                  )}
                  {candidate.resume && (
                    <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 hover:translate-y-[-2px] transition-all shadow-glow">
                      <span className="material-symbols-outlined">
                        download
                      </span>{" "}
                      Download CV
                    </button>
                  )}
                  <button className="px-6 py-3 bg-(--input-bg) text-(--text-main) font-bold rounded-2xl flex items-center gap-2 border border-(--border-subtle) hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined">edit</span> Edit
                    Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-4xl p-8 border-(--border-subtle)"
            >
              <h3 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  assessment
                </span>{" "}
                Quick Preview
              </h3>
              <div className="space-y-6">
                <StatItem
                  label="Availability"
                  value={availability.replace("_", " ")}
                  color="text-amber-500"
                />
                <StatItem
                  label="Experience"
                  value={
                    workExperience.length > 0
                      ? `${workExperience.length} Previous Roles`
                      : "Not listed"
                  }
                />
                <StatItem
                  label="Education"
                  value={
                    education[0]
                      ? `${education[0].degree} @ ${education[0].institution}`
                      : "—"
                  }
                />
                <StatItem
                  label="Relocation"
                  value={
                    candidate.willingToRelocate ||
                    candidate.step1?.willingToRelocate
                      ? "Open to Relocate"
                      : "Preferred Local"
                  }
                  color={
                    candidate.willingToRelocate
                      ? "text-emerald-500"
                      : "text-amber-500"
                  }
                />
              </div>
            </motion.div>

            {/* Current Position */}
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-4xl p-8 border-(--border-subtle) bg-primary/5"
            >
              <h3 className="text-lg font-bold text-(--text-main) mb-6">
                Current Standing
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mb-1">
                    Role
                  </p>
                  <p className="text-lg font-bold text-primary">{currentJob}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mb-1">
                    Company
                  </p>
                  <p className="font-semibold text-(--text-main)">
                    {currentCompany}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mb-1">
                    Expectation
                  </p>
                  <p className="font-semibold text-(--text-main)">{salary}</p>
                </div>
              </div>
            </motion.div>

            {/* Skills Cloud */}
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-4xl p-8 border-(--border-subtle)"
            >
              <h3 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  psychology
                </span>{" "}
                Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-(--input-bg) border border-(--border-subtle) text-xs font-bold text-(--text-main) flex items-center gap-2"
                    >
                      {s.skillName}
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] opacity-60">
                        {s.proficiency}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-(--text-muted)">
                    No skills listed yet.
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Work History */}
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle)"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-(--text-main) flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      work
                    </span>
                  </div>
                  Work Journey
                </h3>
              </div>

              <div className="space-y-10 relative before:content-[''] before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-(--border-subtle)">
                {workExperience.length > 0 ? (
                  workExperience.map((work: any, i: number) => (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-[14px] top-1 size-3 rounded-full bg-primary border-4 border-(--surface) ring-4 ring-primary/10 z-10" />
                      <div className="mb-1 flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-lg font-extrabold text-(--text-main)">
                          {work.jobTitle}
                        </h4>
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                          {work.isCurrent ? "Current" : "Past"}
                        </span>
                      </div>
                      <p className="text-primary font-bold text-sm mb-3">
                        {work.companyName}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-(--text-muted) mb-4">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">
                            calendar_month
                          </span>
                          {work.startDate
                            ? new Date(work.startDate).toLocaleDateString()
                            : "—"}{" "}
                          —{" "}
                          {work.isCurrent
                            ? "Present"
                            : work.endDate
                              ? new Date(work.endDate).toLocaleDateString()
                              : "—"}
                        </span>
                        {work.location && (
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">
                              location_on
                            </span>
                            {work.location}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-(--text-muted) leading-relaxed">
                        {work.description ||
                          "No description provided for this role."}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-(--text-muted) pl-12 opacity-60 italic">
                    Ongoing exploration phase...
                  </p>
                )}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-4xl p-8 md:p-10 border-(--border-subtle)"
            >
              <h3 className="text-2xl font-bold text-(--text-main) flex items-center gap-3 mb-8">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500">
                    school
                  </span>
                </div>
                Academic Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.length > 0 ? (
                  education.map((edu: any, i: number) => (
                    <div
                      key={i}
                      className="p-6 rounded-3xl bg-(--input-bg) border border-(--border-subtle) relative group overflow-hidden"
                    >
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-8xl">
                          school
                        </span>
                      </div>
                      <h4 className="font-black text-(--text-main) mb-1 truncate">
                        {edu.degree}
                      </h4>
                      <p className="text-primary font-bold text-xs mb-4">
                        {edu.fieldOfStudy}
                      </p>
                      <p className="text-sm font-bold text-(--text-main) mb-4">
                        @ {edu.institution}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter">
                        <span>
                          {edu.startDate
                            ? new Date(edu.startDate).getFullYear()
                            : "—"}
                        </span>
                        <span className="w-4 h-px bg-(--text-muted) opacity-30" />
                        <span>
                          {edu.endDate
                            ? new Date(edu.endDate).getFullYear()
                            : "Present"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-(--text-muted) md:col-span-2">
                    No education history recorded.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Systems & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Notes */}
              <motion.div
                variants={itemVariants}
                className="glass-panel rounded-4xl p-8 border-(--border-subtle)"
              >
                <h3 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    notes
                  </span>{" "}
                  Internal Notes
                </h3>
                <div className="p-5 rounded-2xl bg-(--input-bg) border border-(--border-subtle) min-h-[120px]">
                  <p className="text-sm text-(--text-muted) leading-relaxed italic">
                    "{internalNotes}"
                  </p>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                variants={itemVariants}
                className="glass-panel rounded-4xl p-8 border-(--border-subtle)"
              >
                <h3 className="text-lg font-bold text-(--text-main) mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    label
                  </span>{" "}
                  Organizational Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-xs font-black text-primary uppercase tracking-widest shadow-sm"
                      >
                        #{t}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-(--text-muted)">
                      No system tags applied.
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function ContactInfo({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-(--input-bg) border border-(--border-subtle) text-sm font-bold text-(--text-main)">
      <span className="material-symbols-outlined text-primary text-xl">
        {icon}
      </span>
      {value}
    </div>
  );
}

function SocialButton({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-5 py-3 rounded-2xl bg-(--surface) border border-(--border-subtle) flex items-center gap-3 hover:border-primary/50 transition-all shadow-sm group"
    >
      <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span className="text-xs font-black text-(--text-main) uppercase tracking-widest">
        {label}
      </span>
      <span className="material-symbols-outlined text-xs opacity-40">
        open_in_new
      </span>
    </a>
  );
}

function StatItem({
  label,
  value,
  color = "text-(--text-main)",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span className={`text-xs font-black ${color} text-right truncate`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    [CandidateStatus.ACTIVE]: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      dot: "bg-emerald-500",
      pulse: true,
    },
    [CandidateStatus.PLACED]: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      dot: "bg-blue-500",
    },
    [CandidateStatus.PASSIVE]: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
      dot: "bg-amber-500",
    },
    [CandidateStatus.BLACKLISTED]: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
      dot: "bg-red-500",
    },
    [CandidateStatus.ARCHIVED]: {
      bg: "bg-slate-500/10",
      text: "text-slate-500",
      border: "border-slate-500/20",
      dot: "bg-slate-500",
    },
  };

  const config = configs[status] || configs[CandidateStatus.ACTIVE];

  return (
    <div
      className={`px-4 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} flex items-center gap-2 w-fit`}
    >
      <span
        className={`size-2 rounded-full ${config.dot} ${config.pulse ? "animate-pulse" : ""}`}
      />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
        {status}
      </span>
    </div>
  );
}
