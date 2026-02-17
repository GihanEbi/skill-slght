"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const teamMembers = [
  {
    id: 7,
    name: "Alex Rivers",
    role: "Senior Recruiter",
    tag: "Admin",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    status: "online",
    stats: [
      { label: "Active Jobs", value: "12" },
      { label: "Candidates Managed", value: "1.4k" },
    ],
  },
  {
    id: 8,
    name: "Sarah Chen",
    role: "Engineering Manager",
    tag: "Interviewer",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    status: "online",
    stats: [
      { label: "Active Jobs", value: "4" },
      { label: "Avg. Interview Score", value: "4.8" },
    ],
  },
  {
    id: 9,
    name: "Marcus Thorne",
    role: "Tech Talent Partner",
    tag: "Recruiter",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    status: "offline",
    stats: [
      { label: "Active Jobs", value: "18" },
      { label: "Hires this month", value: "5" },
    ],
  },
  {
    id: 10,
    name: "Elena Voss",
    role: "Product Lead",
    tag: "Interviewer",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    status: "online",
    stats: [
      { label: "Active Jobs", value: "2" },
      { label: "Time to Hire", value: "14d" },
    ],
  },
  {
    id: 11,
    name: "David Kross",
    role: "Head of Blockchain",
    tag: "Admin",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    status: "online",
    stats: [
      { label: "Active Jobs", value: "6" },
      { label: "Approval Rate", value: "92%" },
    ],
  },
];

export default function HiringTeamPage() {
  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] transition-colors duration-300 no-scrollbar">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <nav className="flex text-xs font-semibold text-primary items-center gap-2">
              <span className="opacity-60 text-[var(--text-muted)]">Jobs</span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Hiring Team</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-4">
              Hiring Team
              <span className="text-primary text-sm font-bold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/10">
                18 Members
              </span>
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto active-tab-gradient text-[var(--background)] font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
          >
            <span className="material-symbols-outlined text-xl font-bold">
              person_add
            </span>
            Add Member
          </motion.button>
        </header>

        {/* Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}

          {/* Add Team Member CTA */}
          <motion.button
            variants={itemVariants}
            whileHover={{
              borderColor: "rgba(13, 242, 128, 0.4)",
              backgroundColor: "rgba(13, 242, 128, 0.05)",
            }}
            className="border-2 border-dashed border-[var(--border-subtle)] rounded-[2rem] p-8 flex flex-col items-center justify-center gap-5 group transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-primary transition-colors shadow-inner">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-primary transition-colors">
                Add Team Member
              </h3>
              <p className="text-[var(--text-muted)] text-sm font-medium">
                Invite a recruiter or manager
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* Pagination Footer */}
        <footer className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            Showing <span className="text-[var(--text-main)] font-bold">6</span>{" "}
            of 14 templates
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

// --- Helper Components ---

function MemberCard({ member }: { member: any }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-[2rem] p-7 flex flex-col gap-6 border-[var(--border-subtle)] shadow-sm relative overflow-hidden group"
    >

      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-5">
          <div className="relative">
            <img
              alt={member.name}
              className="w-16 h-16 rounded-2xl border-2 border-primary/20 object-cover shadow-premium"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[var(--surface)] rounded-full ${member.status === "online" ? "bg-primary" : "bg-slate-500"}`}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
              {member.name}
            </h3>
            <p className="text-[var(--text-muted)] text-xs font-medium">
              {member.role}
            </p>
            <span
              className={`mt-3 inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${member.tagColor}`}
            >
              {member.tag}
            </span>
          </div>
        </div>
        <button className="text-[var(--text-muted)] hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="flex items-center gap-8 py-5 border-y border-[var(--border-subtle)] relative z-10">
        {member.stats.map((stat: any, i: number) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-widest opacity-70">
              {stat.label}
            </span>
            <span className="text-xl font-bold text-[var(--text-main)]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 relative z-10">
        <button className="flex-1 bg-[var(--surface)] hover:bg-[var(--input-bg)] text-[var(--text-main)] py-3 rounded-xl text-xs font-bold border border-[var(--border-subtle)] hover:border-primary/30 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
          <span className="material-symbols-outlined text-lg">
            admin_panel_settings
          </span>
          Permissions
        </button>
        <button className="flex-1 bg-primary/5 hover:bg-primary/10 text-primary py-3 rounded-xl text-xs font-bold border border-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-lg">history</span>
          Activity
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
          ? "bg-primary text-[var(--background)] border-primary shadow-glow font-bold"
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
