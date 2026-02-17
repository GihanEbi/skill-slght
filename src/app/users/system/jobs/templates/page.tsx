"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const templatesData = [
  {
    id: 1,
    title: "Senior Engineering",
    category: "Engineering",
    icon: "code",
    usage: 124,
    stages: ["Screening", "Technical Test", "Live Coding", "Final Interview"],
  },
  {
    id: 2,
    title: "Growth Lead",
    category: "Marketing",
    icon: "campaign",
    usage: 48,
    stages: ["Screening", "Portfolio Review", "Strategy Pitch", "Offer"],
  },
  {
    id: 3,
    title: "Product Designer",
    category: "Design",
    icon: "palette",
    usage: 82,
    stages: ["Portfolio", "Critique", "Whiteboard", "Cultural"],
  },
  {
    id: 4,
    title: "Account Executive",
    category: "Sales",
    icon: "payments",
    usage: 65,
    stages: ["Initial Call", "Case Study", "Mock Demo", "Final"],
  },
  {
    id: 5,
    title: "Operations Manager",
    category: "Operations",
    icon: "groups",
    usage: 19,
    stages: ["Screening", "Management", "Final"],
  },
];

export default function JobTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumbs & Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
           <nav className="flex text-xs font-semibold text-primary items-center gap-2">
              <span className="opacity-60 text-[var(--text-muted)]">Jobs</span>
              <span className="opacity-40 text-[var(--text-muted)]">/</span>
              <span>Job Templates</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              Job Templates
              <span className="text-primary ml-3 text-lg font-normal opacity-60">
                (14)
              </span>
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto active-tab-gradient text-[var(--background)] font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm"
          >
            <span className="material-symbols-outlined text-xl font-bold">
              add
            </span>
            Create Template
          </motion.button>
        </header>

        {/* Filter Section */}
        <section className="glass-panel rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 border-[var(--border-subtle)] shadow-sm">
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              search
            </span>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl pl-12 pr-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[var(--surface)] hover:bg-primary/10 text-[var(--text-muted)] hover:text-primary px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] transition-all text-xs font-bold uppercase tracking-tight">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              All Categories
            </button>
            <button className="bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-primary p-2.5 rounded-xl transition-all">
              <span className="material-symbols-outlined text-xl">sort</span>
            </button>
          </div>
        </section>

        {/* Templates Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {templatesData.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}

          {/* New Template Empty State */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, borderColor: "rgba(13, 242, 128, 0.4)" }}
            className="border-2 border-dashed border-[var(--border-subtle)] rounded-[2rem] p-8 flex flex-col items-center justify-center h-full group cursor-pointer bg-primary/[0.02] transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-[var(--text-muted)] group-hover:text-primary group-hover:bg-primary/10 mb-6 transition-all shadow-inner">
              <span className="material-symbols-outlined text-4xl">
                add_circle
              </span>
            </div>
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
              New Template
            </h3>
            <p className="text-sm text-[var(--text-muted)] text-center max-w-[220px] font-medium leading-relaxed">
              Create a custom pipeline from scratch for your specific needs.
            </p>
          </motion.div>
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

// --- Internal Helper Components ---

function TemplateCard({ template }: { template: any }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="glass-panel rounded-[2rem] p-8 flex flex-col h-full group border-[var(--border-subtle)] shadow-sm hover:border-primary/30 transition-all relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
          <span className="material-symbols-outlined text-3xl">
            {template.icon}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconButton icon="content_copy" title="Duplicate" />
          <IconButton icon="edit" title="Edit" />
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1 group-hover:text-primary transition-colors tracking-tight">
          {template.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            {template.category}
          </span>
          <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30"></span>
          <span className="text-xs text-[var(--text-muted)] font-medium italic">
            Used {template.usage} times
          </span>
        </div>
      </div>

      <div className="flex-grow mb-8 relative z-10">
        <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 opacity-70">
          Workflow Architecture
        </h4>
        <div className="flex flex-wrap items-center gap-y-3">
          {template.stages.map((stage: string, idx: number) => (
            <React.Fragment key={idx}>
              <span className="px-3 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-main)] shadow-sm">
                {stage}
              </span>
              {idx < template.stages.length - 1 && (
                <span className="material-symbols-outlined text-primary/30 text-base mx-1">
                  chevron_right
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-6 border-t border-[var(--border-subtle)]">
        <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-[var(--background)] font-bold py-4 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-inner group/btn active:scale-95">
          <span className="material-symbols-outlined text-lg">
            rocket_launch
          </span>
          Use Template
        </button>
      </div>
    </motion.div>
  );
}

function IconButton({ icon, title }: { icon: string; title: string }) {
  return (
    <button
      className="p-2.5 text-[var(--text-muted)] hover:text-primary transition-all hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/20"
      title={title}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </button>
  );
}

function PaginationButton({ label, icon, active, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
        active
          ? "bg-primary text-[var(--background)] border-primary shadow-glow font-bold"
          : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary hover:border-primary/30 disabled:opacity-30"
      }`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      ) : (
        <span className="text-sm font-bold">{label}</span>
      )}
    </button>
  );
}
