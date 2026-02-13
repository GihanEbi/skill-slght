"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const hoverScale: Variants = {
  hover: {
    y: -5,
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

export default function DashboardPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-10 p-4 md:p-6 no-scrollbar bg-[var(--background)]"
    >
      {/* --- Top Header --- */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--text-main)] uppercase">
            Recruitment Protocol
          </h1>
          <p className="text-xs md:text-sm font-medium text-[var(--text-muted)]">
            Intelligence overview: Your AI agents have screened{" "}
            <span className="text-primary font-black">12 new nodes</span>.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xl group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl pl-12 pr-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-primary/50 transition-all focus:ring-4 focus:ring-primary/10 font-bold placeholder:text-slate-400"
              placeholder="Search nodes..."
              type="text"
            />
          </div>
          <Link
            href="/users/system/jobs/create/details"
            className="w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto active-tab-gradient text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-premium"
            >
              <span className="material-symbols-outlined text-lg">
                add_circle
              </span>
              Initialize Job
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* --- Metric Cards Row --- */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <MetricCard
          title="Total Candidates"
          value="12,480"
          icon="group"
          trend="12%"
          bars={[3, 5, 4, 7, 6]}
        />
        <MetricCard
          title="Active Protocols"
          value="42"
          icon="hub"
          trend="8%"
          subtitle="Cycle Active"
        />
        <MetricCard
          title="Live Interviews"
          value="08"
          icon="video_chat"
          subtitle="Scheduled Today"
        />
        <MetricCard
          title="Offers Deployed"
          value="15"
          icon="verified"
          trend="4%"
          subtitle="Final Stage"
        />
      </motion.div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 glass-panel rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight">
                Hiring Velocity
              </h4>
              <p className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">
                Average cycle time // Real-time telemetry
              </p>
            </div>
            <div className="flex bg-[var(--input-bg)] p-1 rounded-xl border border-[var(--border-subtle)] self-start">
              <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-primary transition-all">
                30D
              </button>
              <button className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-white shadow-glow">
                90D
              </button>
            </div>
          </div>
          <div className="h-64 relative rounded-2xl overflow-hidden velocity-chart-bg border border-primary/5">
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full p-4"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0 150 Q 100 120, 200 160 T 400 100 T 600 130 T 800 40"
                fill="none"
                stroke="url(#gradientLine)"
                strokeLinecap="round"
                strokeWidth="6"
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

        {/* Source Breakdown */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-[2rem] p-6 md:p-8"
        >
          <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight mb-8">
            Node Sources
          </h4>
          <div className="relative flex items-center justify-center py-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-40 h-40 rounded-full border-[14px] border-primary/20 flex items-center justify-center relative"
            >
              <div className="text-center">
                <p className="text-3xl font-black text-[var(--text-main)] leading-none">
                  45%
                </p>
                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">
                  LinkedIn
                </p>
              </div>
              {/* Fake animated arc */}
              <div className="absolute inset-[-14px] w-[calc(100%+28px)] h-[calc(100%+28px)] rounded-full border-[14px] border-primary border-t-transparent border-r-transparent -rotate-45" />
            </motion.div>
          </div>
          <div className="space-y-4 mt-8">
            <SourceItem
              color="bg-primary"
              label="LinkedIn Protocol"
              value="45%"
            />
            <SourceItem color="bg-accent" label="GitHub Direct" value="28%" />
            <SourceItem color="bg-slate-400" label="Others" value="27%" />
          </div>
        </motion.div>
      </div>

      {/* --- Bottom Section --- */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10"
      >
        {/* Activity Feed */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-[2rem] p-6 md:p-8"
        >
          <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight mb-6">
            Neural Feed
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
              title="AI Analysis Completed: Lead Designer"
              time="4h ago"
            />
            <ActivityItem
              img="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
              title="Marcus Chen submitted application"
              time="6h ago"
              status="add"
              statusColor="bg-primary"
            />
          </div>
        </motion.div>

        {/* Pipeline Funnel */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-[2rem] p-6 md:p-8"
        >
          <h4 className="text-lg font-black text-[var(--text-main)] uppercase tracking-tight mb-6">
            Protocol Stages
          </h4>
          <div className="space-y-5">
            <PipelineBar label="Sourced" value="1,240" percent="95%" />
            <PipelineBar label="Screened" value="480" percent="60%" />
            <PipelineBar label="Interview" value="85" percent="35%" />
            <PipelineBar label="Hired" value="8" percent="12%" isEmerald />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// --- Sub-components (Refactored for Light Mode) ---

function MetricCard({ title, value, icon, trend, bars, subtitle }: any) {
  return (
    <motion.div
      variants={hoverScale}
      whileHover="hover"
      className="glass-panel rounded-[2rem] p-6 cursor-pointer group hover:border-primary/30 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {trend && (
          <span className="text-primary text-[10px] font-black flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg uppercase tracking-widest border border-primary/10">
            +{trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[var(--text-muted)] text-[8px] font-black uppercase tracking-widest">
            {subtitle}
          </span>
        )}
      </div>
      <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
        {title}
      </p>
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter italic">
          {value}
        </h3>
        {bars && (
          <div className="h-8 w-16 flex items-end gap-1 pb-1">
            {bars.map((h: number, i: number) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: h * 4 }}
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
    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)]">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${color} shadow-sm`} />
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className="text-xs font-black text-[var(--text-main)]">
        {value}
      </span>
    </div>
  );
}

function ActivityItem({ img, icon, title, time, status, statusColor }: any) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex gap-4 cursor-pointer group"
    >
      <div className="relative">
        {img ? (
          <img
            className="w-10 h-10 rounded-xl border border-[var(--border-subtle)] p-0.5 bg-[var(--surface)]"
            src={img}
            alt=""
          />
        ) : (
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
        {status && (
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColor} rounded-full border-2 border-[var(--background)] flex items-center justify-center shadow-sm`}
          >
            <span className="material-symbols-outlined text-[10px] text-white font-black">
              {status}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--text-main)] font-bold tracking-tight">
          {title}
        </p>
        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest mt-1 opacity-70">
          {time}
        </p>
      </div>
    </motion.div>
  );
}

function PipelineBar({ label, value, percent, isEmerald }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-black text-[var(--text-main)] tracking-tighter italic">
          {value} Units
        </span>
      </div>
      <div className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] h-6 rounded-xl overflow-hidden p-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: percent }}
          className={`h-full rounded-lg ${isEmerald ? "active-tab-gradient" : "bg-primary"} shadow-sm`}
        />
      </div>
    </div>
  );
}
