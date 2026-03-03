"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Types ---
type PoolType =
  | "Role Based"
  | "Pipeline Based"
  | "Source Based"
  | "Status Based"
  | "Custom"
  | "Smart Pool";

interface TalentPool {
  id: string;
  name: string;
  description: string;
  type: PoolType;
  accentColor: string;
  icon: string;
  candidateCount: number;
  lastUpdated: string;
  isSmart: boolean;
  candidates: string[]; // avatar placeholders
}

interface SmartRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// --- Mock Data ---
const INITIAL_POOLS: TalentPool[] = [
  {
    id: "1",
    name: "Silver Medalists",
    description: "Finalists who weren't selected but showed strong potential",
    type: "Pipeline Based",
    accentColor: "bg-purple-500",
    icon: "🥈",
    candidateCount: 48,
    lastUpdated: "1 day ago",
    isSmart: true,
    candidates: [
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-2.jpg",
      "/images/avatar-img/avatar-3.jpg",
      "/images/avatar-img/avatar-4.jpg",
    ],
  },
  {
    id: "2",
    name: "Senior Engineers",
    description: "Experienced engineers across all specializations",
    type: "Role Based",
    accentColor: "bg-blue-500",
    icon: "💻",
    candidateCount: 124,
    lastUpdated: "3 days ago",
    isSmart: false,
    candidates: [
      "/images/avatar-img/avatar-2.jpg",
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-3.jpg",
    ],
  },
  {
    id: "3",
    name: "Ready Now",
    description: "Active candidates available immediately",
    type: "Status Based",
    accentColor: "bg-orange-500",
    icon: "⚡",
    candidateCount: 37,
    lastUpdated: "Today",
    isSmart: true,
    candidates: [
      "/images/avatar-img/avatar-4.jpg",
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-2.jpg",
    ],
  },
  {
    id: "4",
    name: "Leadership Talent",
    description: "High potential candidates for future leadership roles",
    type: "Custom",
    accentColor: "bg-gray-500",
    icon: "👔",
    candidateCount: 22,
    lastUpdated: "1 week ago",
    isSmart: false,
    candidates: [
      "/images/avatar-img/avatar-3.jpg",
      "/images/avatar-img/avatar-4.jpg",
    ],
  },
  {
    id: "5",
    name: "LinkedIn Sourced",
    description: "Candidates sourced directly from LinkedIn campaigns",
    type: "Source Based",
    accentColor: "bg-green-500",
    icon: "🔗",
    candidateCount: 89,
    lastUpdated: "2 days ago",
    isSmart: false,
    candidates: [
      "/images/avatar-img/avatar-4.jpg",
      "/images/avatar-img/avatar-3.jpg",
      "/images/avatar-img/avatar-2.jpg",
      "/images/avatar-img/avatar-1.jpg",
    ],
  },
  {
    id: "6",
    name: "Re-Engagement Pool",
    description: "Past candidates not contacted in over 90 days",
    type: "Pipeline Based",
    accentColor: "bg-purple-500",
    icon: "🔄",
    candidateCount: 61,
    lastUpdated: "Today",
    isSmart: true,
    candidates: [
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-2.jpg",
    ],
  },
  {
    id: "7",
    name: "Diversity Pipeline",
    description: "Candidates from underrepresented backgrounds",
    type: "Custom",
    accentColor: "bg-gray-500",
    icon: "🌈",
    candidateCount: 43,
    lastUpdated: "4 days ago",
    isSmart: false,
    candidates: [
      "/images/avatar-img/avatar-3.jpg",
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-2.jpg",
    ],
  },
  {
    id: "8",
    name: "Career Fair 2025",
    description: "Contacts collected from the November 2025 career fair",
    type: "Source Based",
    accentColor: "bg-green-500",
    icon: "🎪",
    candidateCount: 18,
    lastUpdated: "2 weeks ago",
    isSmart: false,
    candidates: [
      "/images/avatar-img/avatar-1.jpg",
      "/images/avatar-img/avatar-2.jpg",
    ],
  },
];

export default function TalentPoolPage() {
  const [pools, setPools] = useState<TalentPool[]>(INITIAL_POOLS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sortBy, setSortBy] = useState("Last Updated");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newPool, setNewPool] = useState({
    name: "",
    description: "",
    type: "Role Based" as PoolType,
    accentColor: "bg-blue-500",
    isSmart: false,
    tags: [] as string[],
    privacy: "Visible to All Recruiters",
  });
  const [smartRules, setSmartRules] = useState<SmartRule[]>([
    { id: "1", field: "Status", operator: "equals", value: "" },
  ]);

  const stats = [
    { label: "Total Pools", value: "12", icon: "groups" },
    { label: "Total Candidates in Pools", value: "1,284", icon: "person" },
    { label: "Hired from Pools this month", value: "8", icon: "verified" },
    {
      label: "Pools with New Activity",
      value: "5",
      icon: "notifications_active",
      active: true,
    },
  ];

  const filteredPools = pools.filter((pool) => {
    const matchesSearch =
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || pool.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddRule = () => {
    setSmartRules([
      ...smartRules,
      {
        id: Date.now().toString(),
        field: "Status",
        operator: "equals",
        value: "",
      },
    ]);
  };

  const handleRemoveRule = (id: string) => {
    setSmartRules(smartRules.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* --- Page Header & Stats Row --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="max-w-xl">
          <h1 className="text-3xl font-black text-(--text-main) tracking-tight">
            Talent Pools
          </h1>
          <p className="text-(--text-muted) text-sm font-medium mt-1 leading-relaxed">
            Segment and organize your candidate groups to optimize your hiring
            pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-(--border-subtle) text-(--text-muted) font-bold text-xs hover:border-primary/30 hover:text-primary transition-all bg-(--surface)">
            <span className="material-symbols-outlined text-lg">settings</span>
            Manage Smart Pools
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="active-tab-gradient px-6 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 hover:-translate-y-px transition-all shadow-premium"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New Pool
          </button>
        </div>
      </div>

      {/* --- Unified Dashboard Bar (Search + Stats) --- */}
      <div className="space-y-6">
        {/* Filter Toolbar */}
        <div className="relative z-50 glass-panel p-2 rounded-2xl border-(--border-subtle) bg-(--surface)/50 flex flex-col md:flex-row items-center gap-2 shadow-sm">
          <div className="relative flex-1 group w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50 group-focus-within:text-primary transition-colors text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search by pool name, tags, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-3 pl-12 pr-4 text-xs font-bold text-(--text-main) outline-none placeholder:font-medium placeholder:opacity-40"
            />
          </div>

          <div className="h-8 w-px bg-(--border-subtle) hidden md:block" />

          <div className="flex items-center gap-2 w-full md:w-auto p-1 md:p-0">
            <ModernDropdown
              icon="filter_list"
              label="Pool Type"
              selected={typeFilter}
              setSelected={setTypeFilter}
              options={[
                "All Types",
                "Role Based",
                "Pipeline Based",
                "Source Based",
                "Status Based",
                "Custom",
              ]}
            />

            <ModernDropdown
              icon="sort_by_alpha"
              label="Sort By"
              selected={sortBy}
              setSelected={setSortBy}
              options={[
                "Last Updated",
                "Most Candidates",
                "Recently Created",
                "Alphabetical",
              ]}
            />
          </div>
        </div>

        {/* Compact Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-4 border-(--border-subtle) shadow-sm bg-(--surface)/50 flex items-center gap-4 group hover:border-primary/20 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.active ? "bg-primary/10 text-primary" : "bg-(--background) text-(--text-muted)"}`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {stat.icon}
                </span>
              </div>
              <div>
                <span className="text-xl font-black text-(--text-main) block leading-none">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider mt-1 block">
                  {stat.label}
                </span>
              </div>
              {stat.active && (
                <div className="ml-auto">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- Pool Cards Grid --- */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-(--surface) border border-(--border-subtle) flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-(--text-muted) opacity-20">
              groups
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-(--text-main)">
              No talent pools yet
            </h3>
            <p className="text-(--text-muted) text-sm font-medium mt-1">
              Create your first pool to start organizing candidates for faster
              hiring.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="active-tab-gradient px-8 py-3 rounded-xl text-white font-bold text-sm shadow-premium"
          >
            Create First Pool
          </button>
        </div>
      )}

      {/* --- Create New Pool Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-(--surface) rounded-[2.5rem] shadow-2xl border border-(--border-subtle) overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-(--border-subtle) flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-(--text-main) tracking-tight">
                    Create Talent Pool
                  </h2>
                  <p className="text-xs text-(--text-muted) font-medium mt-1">
                    Define your candidate segment parameters.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-primary/5 flex items-center justify-center text-(--text-muted) transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Pool Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UX Research Masters"
                      className="premium-input rounded-2xl py-3.5 px-5 text-sm font-bold text-(--text-main)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                      Pool Type
                    </label>
                    <ModernDropdown
                      icon="category"
                      label="Select Type"
                      selected={newPool.type}
                      setSelected={(val: any) =>
                        setNewPool({ ...newPool, type: val })
                      }
                      options={[
                        "Role Based",
                        "Pipeline Based",
                        "Source Based",
                        "Status Based",
                        "Custom",
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    placeholder="Briefly describe what candidates belong in this pool..."
                    className="premium-input rounded-2xl py-3.5 px-5 text-sm font-bold text-(--text-main) min-h-[100px] resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 uppercase tracking-wider">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-4">
                    {[
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-green-500",
                      "bg-orange-500",
                      "bg-pink-500",
                      "bg-gray-500",
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setNewPool({ ...newPool, accentColor: color })
                        }
                        className={`w-10 h-10 rounded-full ${color} transition-all ${newPool.accentColor === color ? "ring-4 ring-offset-2 ring-primary scale-110" : "hover:scale-105"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-(--text-main)">
                        Smart Pool
                      </h4>
                      <p className="text-[11px] text-(--text-muted) font-medium">
                        Auto-add candidates based on criteria.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPool.isSmart}
                        onChange={(e) =>
                          setNewPool({ ...newPool, isSmart: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-(--background) border border-(--border-subtle) peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {newPool.isSmart && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-primary/5 rounded-3xl p-6 border border-primary/10 space-y-4"
                    >
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
                        Auto-add candidates who match:
                      </h5>
                      <div className="space-y-3">
                        {smartRules.map((rule, idx) => (
                          <div
                            key={rule.id}
                            className="flex flex-col space-y-3"
                          >
                            {idx > 0 && (
                              <span className="text-[10px] font-black text-primary/50 ml-4 py-1 self-start">
                                AND
                              </span>
                            )}
                            <div className="flex items-center gap-3">
                              <select className="premium-input rounded-xl py-2 px-3 text-xs font-bold text-(--text-main) flex-1 bg-(--surface)">
                                <option>Status</option>
                                <option>Skills</option>
                                <option>Availability</option>
                                <option>Location</option>
                                <option>Last Contacted</option>
                                <option>Source</option>
                                <option>Tags</option>
                              </select>
                              <select className="premium-input rounded-xl py-2 px-3 text-xs font-bold text-(--text-main) flex-1 bg-(--surface)">
                                <option>equals</option>
                                <option>contains</option>
                                <option>greater than</option>
                                <option>less than</option>
                                <option>is empty</option>
                              </select>
                              <input
                                type="text"
                                placeholder="..."
                                className="premium-input rounded-xl py-2 px-3 text-xs font-bold text-(--text-main) flex-1 bg-(--surface)"
                              />
                              <button
                                onClick={() => handleRemoveRule(rule.id)}
                                className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-red-500 transition-colors"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  delete
                                </span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleAddRule}
                        className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all mt-2"
                      >
                        <span className="material-symbols-outlined text-sm">
                          add
                        </span>{" "}
                        Add Rule
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-(--text-muted) opacity-50">
                      lock
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-(--text-main)">
                        Privacy Settings
                      </h4>
                      <p className="text-[10px] text-(--text-muted) font-medium">
                        Control who can see this pool.
                      </p>
                    </div>
                  </div>
                  <ModernDropdown
                    icon="lock"
                    label="Visibility"
                    selected="Visible to All Recruiters"
                    setSelected={() => {}}
                    options={["Visible to All Recruiters", "Only Me"]}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-(--border-subtle) bg-(--background) flex items-center justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-(--text-muted) hover:text-(--text-main) transition-all"
                >
                  Cancel
                </button>
                <button className="active-tab-gradient px-8 py-2.5 rounded-xl text-white font-bold text-sm shadow-premium">
                  Create Pool
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModernDropdown({ icon, label, selected, setSelected, options }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all group/dropdown cursor-pointer min-w-[160px] border border-transparent ${isOpen ? "bg-primary/10 border-primary/20" : "hover:bg-primary/5"}`}
      >
        <span
          className={`material-symbols-outlined text-lg transition-colors ${isOpen ? "text-primary" : "text-(--text-muted) group-hover/dropdown:text-primary"}`}
        >
          {icon}
        </span>
        <div className="flex flex-col items-start text-left">
          <span className="text-[8px] font-black text-(--text-muted) uppercase tracking-widest leading-none mb-1 opacity-50">
            {label}
          </span>
          <span className="text-[11px] font-black text-(--text-main) leading-none">
            {selected}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`material-symbols-outlined text-lg ml-auto transition-colors ${isOpen ? "text-primary" : "text-(--text-muted) opacity-40"}`}
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 5 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 left-0 md:left-auto md:w-56 mt-2 bg-(--surface) rounded-2xl shadow-2xl border border-(--border-subtle) z-100 overflow-hidden p-1.5 backdrop-blur-3xl"
            >
              {options.map((opt: string) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelected(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[11px] font-bold rounded-xl transition-all ${selected === opt ? "bg-primary text-white shadow-premium" : "text-(--text-main) hover:bg-primary/5 hover:translate-x-1"}`}
                >
                  {opt}
                </button>
              ))}
            </motion.div>
            <div
              className="fixed inset-0 z-90"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PoolCard({ pool }: { pool: TalentPool }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Type-specific color mapping - enhanced for Dark Mode
  const badgeColors: Record<string, string> = {
    "Role Based": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Pipeline Based": "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "Source Based": "bg-green-500/10 text-green-500 border-green-500/20",
    "Status Based": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Custom: "bg-(--text-muted)/10 text-(--text-muted) border-(--text-muted)/20",
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass-panel rounded-4xl bg-(--surface) border border-(--border-subtle) shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden flex flex-col h-full"
    >
      {/* Card Header Actions */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div
          className={`w-12 h-12 rounded-2xl ${pool.accentColor}/10 flex items-center justify-center text-3xl shadow-sm border border-${pool.accentColor}/5`}
        >
          {pool.icon}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${badgeColors[pool.type]}`}
          >
            {pool.type}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-xl hover:bg-primary/10 flex items-center justify-center text-(--text-muted) transition-colors border border-transparent hover:border-primary/20"
            >
              <span className="material-symbols-outlined text-lg">
                more_vert
              </span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-(--surface) rounded-2xl shadow-2xl border border-(--border-subtle) z-50 overflow-hidden py-1.5 backdrop-blur-3xl"
                  >
                    {[
                      "Edit Pool",
                      "Duplicate",
                      "Share",
                      "Archive",
                      "Delete",
                    ].map((action) => (
                      <button
                        key={action}
                        className={`w-full text-left px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors ${action === "Delete" ? "text-red-500 hover:bg-red-500/10" : "text-(--text-main) hover:bg-primary/5"}`}
                      >
                        {action}
                      </button>
                    ))}
                  </motion.div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-2 grow space-y-5">
        <div>
          <h3 className="text-xl font-black text-(--text-main) tracking-tight group-hover:text-primary transition-colors">
            {pool.name}
          </h3>
          <p className="text-xs text-(--text-muted) font-medium mt-1 line-clamp-2 leading-relaxed opacity-70">
            {pool.description}
          </p>
        </div>

        {/* Avatars & Count */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2.5 overflow-hidden">
            {pool.candidates.slice(0, 4).map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="Candidate"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-(--surface) object-cover"
              />
            ))}
            {pool.candidateCount > 4 && (
              <div className="h-8 w-8 rounded-full ring-2 ring-(--surface) bg-(--background) flex items-center justify-center text-[10px] font-black text-(--text-muted) border border-(--border-subtle)">
                +{pool.candidateCount - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-(--background) border border-(--border-subtle) text-[10px] font-black text-(--text-muted) uppercase tracking-widest">
            <span className="material-symbols-outlined text-base">person</span>
            {pool.candidateCount} Candidates
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-3 pt-4 border-t border-(--border-subtle)">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest">
            <span className="material-symbols-outlined text-base opacity-40">
              schedule
            </span>
            {pool.lastUpdated}
          </div>

          <div className="ml-auto">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl relative overflow-hidden ${pool.isSmart ? "bg-primary/10 text-primary border border-primary/20" : "bg-(--background) text-(--text-muted) border border-(--border-subtle)"}`}
            >
              {pool.isSmart && (
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                />
              )}
              <span
                className={`material-symbols-outlined text-sm relative z-10 ${pool.isSmart ? "text-primary" : "text-(--text-muted) opacity-40"}`}
              >
                {pool.isSmart ? "bolt" : "person"}
              </span>
              <span className="relative z-10 text-[9px] font-black uppercase tracking-widest">
                {pool.isSmart ? "Smart" : "Manual"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-(--background)/30 border-t border-(--border-subtle) flex items-center gap-2">
        <button
          onClick={() =>
            router.push(`/users/system/candidates/talent_pool/${pool.id}`)
          }
          className="flex-1 py-2.5 rounded-xl border border-(--border-subtle) bg-(--surface) text-[11px] font-black uppercase tracking-widest text-(--text-main) hover:border-primary/30 transition-all shadow-sm active:scale-95"
        >
          View Pool
        </button>
        <button className="flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-(--text-muted) hover:text-primary transition-all active:scale-95">
          Add candidates
        </button>
      </div>
    </motion.div>
  );
}
