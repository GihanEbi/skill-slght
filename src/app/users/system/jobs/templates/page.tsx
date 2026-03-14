"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { JobDraft, fetchRichJobTemplates } from "@/services/jobService";

// ==========================================
// 1. Animation Variants & Helpers
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const formatEnum = (val: string) => {
  if (!val) return "N/A";
  return val
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(),
    );
};

const formatCurrency = (val: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(val);

// ==========================================
// 2. Main Page Component
// ==========================================
export default function DraftJobsPage() {
  const router = useRouter();

  // State
  const [templates, setTemplates] = useState<JobDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDraft, setSelectedDraft] = useState<JobDraft | null>(null);

  // Fetch Data via Service
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        // Calling the service function as requested
        const data = await fetchRichJobTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(
    (d) =>
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] transition-colors duration-300 p-4 md:p-8">
      {/* === COMPREHENSIVE DATA MODAL === */}
      <AnimatePresence>
        {selectedDraft && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDraft(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl h-[90vh] glass-panel rounded-[2rem] shadow-2xl border border-[var(--border-subtle)] flex flex-col overflow-hidden bg-[var(--background)]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--surface)]/50 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                      Job Template
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] font-medium">
                    Last edited:{" "}
                    {new Date(selectedDraft.updated_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDraft(null)}
                  className="p-2 bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:border-red-500/50 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-10">
                {/* STEP 1: Details */}
                <section>
                  <SectionTitle
                    icon="description"
                    title="Step 1: Core Details"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <DetailField
                      label="Job Title"
                      value={selectedDraft.title}
                      isHighlight
                    />
                    <DetailField
                      label="Department"
                      value={selectedDraft.department_name}
                    />
                    <DetailField
                      label="Location"
                      value={selectedDraft.location || "N/A"}
                    />
                    <DetailField
                      label="Work Arrangement"
                      value={formatEnum(selectedDraft.work_arrangement)}
                    />
                    <DetailField
                      label="Employment Type"
                      value={formatEnum(selectedDraft.employment_type)}
                    />
                    <DetailField
                      label="Template Used"
                      value={selectedDraft.template_id || "None (Custom)"}
                    />

                    <div className="md:col-span-2 mt-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                        Required Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedDraft.skill_names?.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 mt-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">
                        Job Description
                      </label>
                      <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--input-bg)] p-4 rounded-xl border border-[var(--border-subtle)]">
                        {selectedDraft.description}
                      </p>
                    </div>
                  </div>
                </section>

                {/* STEP 2: Benefits */}
                <section>
                  <SectionTitle
                    icon="card_giftcard"
                    title="Step 2: Benefits & Work-Life"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                        Standard Benefits
                      </label>
                      <ul className="space-y-2">
                        {selectedDraft.benefit_names?.map((ben) => (
                          <li
                            key={ben}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]"
                          >
                            <span className="material-symbols-outlined text-primary text-lg">
                              check_circle
                            </span>{" "}
                            {ben}
                          </li>
                        ))}
                        {(!selectedDraft.benefit_names ||
                          selectedDraft.benefit_names.length === 0) && (
                          <li className="text-sm text-[var(--text-muted)]">
                            None selected
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                        Custom Perks
                      </label>
                      <ul className="space-y-2">
                        {selectedDraft.custom_perks?.map((perk) => (
                          <li
                            key={perk}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]"
                          >
                            <span className="material-symbols-outlined text-accent text-lg">
                              star
                            </span>{" "}
                            {perk}
                          </li>
                        ))}
                        {(!selectedDraft.custom_perks ||
                          selectedDraft.custom_perks.length === 0) && (
                          <li className="text-sm text-[var(--text-muted)]">
                            None specified
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="md:col-span-2 pt-4 border-t border-[var(--border-subtle)] flex gap-4 flex-wrap">
                      <BooleanTag
                        label="Flexible Hours"
                        active={selectedDraft.work_life_flexible_hours}
                      />
                      <BooleanTag
                        label="Remote First"
                        active={selectedDraft.work_life_remote_first}
                      />
                      <BooleanTag
                        label="Mental Health Days"
                        active={selectedDraft.work_life_mental_health_days}
                      />
                    </div>
                  </div>
                </section>

                {/* STEP 3: Compensation */}
                <section>
                  <SectionTitle icon="payments" title="Step 3: Compensation" />
                  <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-8 mb-6">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                          Base Salary Range
                        </label>
                        <p className="text-2xl font-bold text-primary tracking-tight">
                          {selectedDraft.salary_min
                            ? formatCurrency(
                                selectedDraft.salary_min,
                                selectedDraft.currency,
                              )
                            : "TBD"}{" "}
                          —{" "}
                          {selectedDraft.salary_max
                            ? formatCurrency(
                                selectedDraft.salary_max,
                                selectedDraft.currency,
                              )
                            : "TBD"}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
                          Currency
                        </label>
                        <p className="text-2xl font-bold text-[var(--text-main)]">
                          {selectedDraft.currency || "USD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <BooleanTag
                        label="Performance Bonus"
                        active={selectedDraft.performance_bonus}
                      />
                      <BooleanTag
                        label="Signing Bonus"
                        active={selectedDraft.signing_bonus}
                      />
                      <BooleanTag
                        label="Stock Options / Equity"
                        active={selectedDraft.stock_options}
                      />
                    </div>
                    {selectedDraft.financial_add_ons?.length > 0 && (
                      <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                          Financial Add-ons
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedDraft.financial_add_ons.map((addon) => (
                            <span
                              key={addon}
                              className="px-3 py-1.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)]"
                            >
                              {addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* STEP 4: Publishing Settings */}
                <section>
                  <SectionTitle
                    icon="rocket_launch"
                    title="Step 4: Publish Settings"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                    <div className="md:col-span-2 flex items-center justify-between p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="text-sm font-bold text-[var(--text-main)]">
                        Visibility Protocol
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${selectedDraft.is_internal ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-purple-500/10 text-purple-500 border-purple-500/20"}`}
                      >
                        {selectedDraft.is_internal
                          ? "Internal Network Only"
                          : "External & Public Boards"}
                      </span>
                    </div>

                    {!selectedDraft.is_internal && (
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                          Target Job Boards
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedDraft.external_publisher_names?.length >
                          0 ? (
                            selectedDraft.external_publisher_names.map(
                              (pub) => (
                                <span
                                  key={pub}
                                  className="px-3 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-primary">
                                    public
                                  </span>{" "}
                                  {pub}
                                </span>
                              ),
                            )
                          ) : (
                            <span className="text-sm text-[var(--text-muted)] italic">
                              No external boards selected.
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-3">
                        Assigned Hiring Managers
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedDraft.hiring_manager_names?.length > 0 ? (
                          selectedDraft.hiring_manager_names.map((mgr) => (
                            <span
                              key={mgr}
                              className="px-3 py-1.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-main)] flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[16px] text-primary">
                                person
                              </span>{" "}
                              {mgr}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[var(--text-muted)] italic">
                            No managers assigned.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--surface)]/80 flex justify-end gap-4 shrink-0">
                <button
                  onClick={() => {
                    // Navigate to active jobs after publishing
                    setSelectedDraft(null);
                    router.push("/users/system/jobs/create/details");
                  }}
                  className="px-8 py-3 rounded-xl active-tab-gradient font-bold text-sm text-white shadow-glow flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <span className="material-symbols-outlined text-lg">
                    rocket_launch
                  </span>
                  Use Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-main)]">
            Job Templates
            {!isLoading && (
              <span className="text-primary ml-3 text-lg font-normal opacity-60">
                ({filteredTemplates.length})
              </span>
            )}
          </h1>
          <p className="text-[var(--text-muted)] mt-2 font-medium">
            Review and finalize your unpublished job specifications.
          </p>
        </header>

        {/* Filter Input */}
        <div className="mb-8 relative max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            search
          </span>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl pl-12 pr-4 py-3 text-sm font-medium text-[var(--text-main)] outline-none focus:border-primary/50 transition-all placeholder:text-[var(--text-muted)] shadow-sm"
          />
        </div>

        {/* --- GRID OF SUMMARY CARDS --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)] font-bold">
              Loading templates...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((job, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedDraft(job)}
                className="glass-panel rounded-[2rem] p-7 border-[var(--border-subtle)] shadow-sm hover:border-primary/40 transition-all cursor-pointer group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {new Date(job.updated_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[var(--text-main)] mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--text-muted)] mb-5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      hub
                    </span>
                    {job.department_name}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge icon="location_on" text={job.location || "Remote"} />
                    <Badge icon="work" text={formatEnum(job.employment_type)} />
                    <Badge
                      icon="apartment"
                      text={formatEnum(job.work_arrangement)}
                    />
                  </div>
                </div>

                <div className="pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      Salary Range
                    </span>
                    <span className="text-sm font-bold text-[var(--text-main)]">
                      {job.salary_min
                        ? formatCurrency(job.salary_min, job.currency)
                        : "TBD"}{" "}
                      -{" "}
                      {job.salary_max
                        ? formatCurrency(job.salary_max, job.currency)
                        : "TBD"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-lg">
                      open_in_new
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. Micro Components for cleaner code
// ==========================================

function Badge({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-muted)]">
      <span className="material-symbols-outlined text-[14px] opacity-70">
        {icon}
      </span>
      {text}
    </span>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
        {title}
      </h3>
    </div>
  );
}

function DetailField({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-1">
        {label}
      </label>
      <p
        className={`text-sm font-semibold ${isHighlight ? "text-primary text-base" : "text-[var(--text-main)]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function BooleanTag({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${active ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-[var(--input-bg)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"}`}
    >
      <span className="material-symbols-outlined text-[16px]">
        {active ? "check_circle" : "cancel"}
      </span>
      {label}
    </div>
  );
}
