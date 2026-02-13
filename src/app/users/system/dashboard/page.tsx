"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

// Fix: Explicitly typing Variants to resolve the ease: string error
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const hoverScale: Variants = {
  hover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 p-4"
    >
      {/* --- Top Header --- */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
            Recruitment Overview
          </h1>
          <p className="text-[var(--text-muted)]">
            Welcome back, Alex. Your AI agents have screened 12 new applicants.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl">
              search
            </span>
            <input
              className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary w-64 text-[var(--text-main)] transition-all focus:ring-2 focus:ring-primary/20"
              placeholder="Search candidates..."
              type="text"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Job
          </motion.button>
        </div>
      </motion.header>

      {/* --- Metric Cards Row --- */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Candidates"
          value="12,480"
          icon="group"
          trend="12%"
          color="primary"
          bars={[3, 5, 4, 7, 6]}
        />
        <MetricCard
          title="Active Jobs"
          value="42"
          icon="work"
          color="accent"
          subtitle="This month"
        />
        <MetricCard
          title="Interviews Today"
          value="8"
          icon="schedule"
          color="orange-500"
          subtitle="Today"
        />
        <MetricCard
          title="Offers Sent"
          value="15"
          icon="mail"
          trend="4"
          color="secondary"
        />
      </motion.div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Line Chart */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 glass-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-[var(--text-main)]">
                Hiring Velocity
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Average time to hire (last 6 months)
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-[var(--surface)] border border-[var(--border-subtle)] rounded text-xs font-medium hover:bg-primary hover:text-white transition-all">
                30D
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded text-xs font-medium">
                90D
              </button>
            </div>
          </div>
          <div className="h-64 relative rounded-xl overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 200"
            >
              <path
                d="M0 150 Q 100 120, 200 160 T 400 100 T 600 130 T 800 40"
                fill="none"
                stroke="url(#gradientLine)"
                strokeLinecap="round"
                strokeWidth="4"
              />
              <defs>
                <linearGradient
                  id="gradientLine"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>
        </motion.div>

        {/* Source Breakdown Chart */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-[var(--text-main)] mb-8">
            Top Sources
          </h4>
          <div className="relative flex items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0.8, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-40 h-40 rounded-full border-[12px] border-primary flex items-center justify-center relative shadow-[0_0_25px_rgba(99,102,241,0.2)]"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--text-main)]">
                  45%
                </p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase">
                  LinkedIn
                </p>
              </div>
            </motion.div>
          </div>
          <div className="space-y-3 mt-6">
            <SourceItem color="bg-primary" label="LinkedIn" value="45%" />
            <SourceItem color="bg-accent" label="GitHub Ads" value="28%" />
            <SourceItem color="bg-slate-600" label="Web3 Boards" value="15%" />
          </div>
        </motion.div>
      </div>

      {/* --- Bottom Section --- */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Activity Feed */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-[var(--text-main)] mb-6">
            Recent Activity
          </h4>
          <div className="space-y-6">
            <ActivityItem
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
              title="Sarah M. advanced to Interview"
              time="2h ago"
              status="check"
              statusColor="bg-emerald-500"
            />
            <ActivityItem
              icon="auto_awesome"
              title="AI Screening Completed"
              time="4h ago"
            />
            <ActivityItem
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
              title="Marcus Chen applied for Engineer"
              time="6h ago"
              status="add"
              statusColor="bg-primary"
            />
          </div>
        </motion.div>

        {/* Pipeline Funnel */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-[var(--text-main)] mb-6">
            Hiring Pipeline
          </h4>
          <div className="space-y-4">
            <PipelineBar label="Sourced" value="1,240" percent="95%" />
            <PipelineBar label="Screened" value="480" percent="60%" />
            <PipelineBar label="Interview" value="85" percent="35%" />
            <PipelineBar label="Hired" value="8" percent="10%" isEmerald />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// --- Sub-components ---

function MetricCard({ title, value, icon, trend, color, bars, subtitle }: any) {
  return (
    <motion.div
      variants={hoverScale}
      whileHover="hover"
      className="glass-panel rounded-xl p-6 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">
              trending_up
            </span>{" "}
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[var(--text-muted)] text-xs">{subtitle}</span>
        )}
      </div>
      <p className="text-[var(--text-muted)] text-sm font-medium mb-1">
        {title}
      </p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-[var(--text-main)]">{value}</h3>
        {bars && (
          <div className="h-8 w-24 flex items-end gap-1 pb-1">
            {bars.map((h: number, i: number) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: h * 4 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                className={`w-1.5 bg-primary rounded-full opacity-${(i + 1) * 20}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SourceItem({ color, label, value }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-2.5 h-2.5 rounded-full ${color}`}
        />
        <span className="text-sm text-[var(--text-muted)]">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[var(--text-main)]">
        {value}
      </span>
    </div>
  );
}

function ActivityItem({ img, icon, title, time, status, statusColor }: any) {
  return (
    <motion.div whileHover={{ x: 5 }} className="flex gap-4 cursor-pointer">
      <div className="relative">
        {img ? (
          <img
            className="w-10 h-10 rounded-full border border-[var(--border-subtle)]"
            src={img}
            alt=""
          />
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
        {status && (
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-[var(--surface)] flex items-center justify-center`}
          >
            <span className="material-symbols-outlined text-[10px] text-white font-bold">
              {status}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--text-main)] font-medium">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{time}</p>
      </div>
    </motion.div>
  );
}

function PipelineBar({ label, value, percent, isEmerald }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-[var(--text-muted)]">
          {label}
        </span>
        <span className="text-sm font-bold text-[var(--text-main)]">
          {value}
        </span>
      </div>
      <div className="w-full bg-[var(--surface)] border border-[var(--border-subtle)] h-8 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: percent }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${isEmerald ? "bg-emerald-500/40" : "bg-primary"} h-full`}
        />
      </div>
    </div>
  );
}
