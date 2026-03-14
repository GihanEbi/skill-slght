"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getPrimarySkills,
  getCandidateStatuses,
} from "@/services/candidateService";
import {
  Candidate,
  CandidateStatus,
  CandidateSource,
  AddCandidateFormData,
} from "@/types/candidate_types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

const initialMockData: (Partial<AddCandidateFormData> & { id: string })[] = [];

export default function AllCandidatesPage() {
  const router = useRouter();
  const skills = getPrimarySkills();
  const statuses = getCandidateStatuses();

  // Dynamic Data Store
  const [candidates, setCandidates] =
    useState<(Partial<AddCandidateFormData> & { id: string })[]>(
      initialMockData,
    );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    const rawData = localStorage.getItem("all-candidates");
    if (rawData) {
      try {
        const storedCandidates = JSON.parse(rawData);
        if (Array.isArray(storedCandidates)) {
          const mappedCandidates = storedCandidates.map((item: any) => {
            return {
              id:
                item.id ||
                `CAND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              step1: {
                firstName: item.step1?.firstName || item.firstName || "",
                lastName: item.step1?.lastName || item.lastName || "",
                email: item.step1?.email || item.email || "",
                phone: item.step1?.phone || item.phone || "",
                country: item.step1?.country || item.country || "—",
                source:
                  item.step1?.source || item.source || CandidateSource.Other,
                portfolioUrl: item.step1?.portfolioUrl || "",
              },
              profilePhotoUrl:
                item.profilePhotoUrl ||
                item.step1?.profilePhotoUrl ||
                item.step1?.profilePhoto ||
                "",
              step2: {
                status:
                  item.step2?.status || item.status || CandidateStatus.Active,
                availabilityStatus:
                  item.step2?.availabilityStatus || "I don't know",
              },
              step3: {
                skills: item.step3?.skills || item.skills || [],
              },
            };
          });
          setCandidates(mappedCandidates);
        }
      } catch (e) {
        console.error("Storage Retrieval Error", e);
      }
    }
  }, []);

  const filteredCandidates = candidates.filter((c: any) => {
    // Safety: ensure we have searchable strings
    const fName = (c.step1?.firstName || "").toLowerCase();
    const lName = (c.step1?.lastName || "").toLowerCase();
    const fullName = `${fName} ${lName}`.trim();
    const email = (c.step1?.email || "").toLowerCase();

    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      (c.id || "").toLowerCase().includes(searchLower);

    const matchesSkill =
      selectedSkill === "All Skills" ||
      c.step3?.skills?.some((s: any) => {
        const skillName = typeof s === "string" ? s : s?.skillName;
        return skillName === selectedSkill;
      });

    // Map selected label to enum value for correct filtering
    const statusMap: Record<string, string> = {
      "All Statuses": "all",
      Active: CandidateStatus.Active,
      Passive: CandidateStatus.Passive,
      Placed: CandidateStatus.Placed,
      Blacklisted: CandidateStatus.Blacklisted,
      Archived: CandidateStatus.Archived,
    };

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      c.step2?.status === statusMap[selectedStatus];

    return matchesSearch && matchesSkill && matchesStatus;
  });

  const toggleSelect = (id?: string | number) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredCandidates.length) setSelectedIds([]);
    else {
      const allIds = filteredCandidates
        .map((c) => c.id)
        .filter((id): id is string => id !== undefined);
      setSelectedIds(allIds);
    }
  };

  const handleRefine = () => {
    setSearchQuery("");
    setSelectedSkill("All Skills");
    setSelectedStatus("All Statuses");
  };

  return (
    <div className="min-h-screen flex flex-col rounded-3xl mesh-gradient no-scrollbar bg-(--background) pb-32">
      <main className="w-full px-4 md:px-8 py-6 md:py-10 max-w-[1400px] mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6">
          <div className="space-y-2">
            <motion.nav
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex text-xs font-semibold text-primary items-center gap-2"
            >
              <span className="opacity-60 text-(--text-muted)">Candidates</span>
              <span className="opacity-40 text-(--text-muted)">/</span>
              <span>All Candidates</span>
            </motion.nav>
            <motion.h1
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl md:text-4xl font-bold tracking-tight text-(--text-main)"
            >
              All Candidates
              <span className="text-(--text-muted) ml-3 text-lg font-normal opacity-50">
                {filteredCandidates.length} candidates
              </span>
            </motion.h1>
          </div>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-3 w-full sm:w-auto"
          >
            <button className="flex-1 sm:flex-none active-tab-gradient text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-premium text-sm">
              <span className="material-symbols-outlined text-xl">
                person_add
              </span>
              Add Candidate
            </button>
          </motion.div>
        </header>

        {/* Filter Bar */}
        <section className="glass-panel rounded-[24px] p-2 mb-10 border-(--border-subtle) shadow-sm relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <div className="flex items-center gap-2 w-full lg:flex-1">
              <button
                onClick={selectAll}
                className="ml-4 flex items-center gap-2 group transition-all"
              >
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.length > 0 && selectedIds.length === filteredCandidates.length ? "bg-primary border-primary text-white" : "border-(--border-subtle) bg-(--input-bg) group-hover:border-primary/50"}`}
                >
                  {selectedIds.length > 0 &&
                    selectedIds.length === filteredCandidates.length && (
                      <span className="material-symbols-outlined text-[14px] font-bold">
                        check
                      </span>
                    )}
                </div>
                <span className="text-[11px] font-bold text-(--text-muted) uppercase tracking-tight">
                  Select All
                </span>
              </button>

              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-(--text-muted) text-xl opacity-60">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none rounded-2xl pl-10 pr-6 py-3.5 text-sm text-(--text-main) focus:ring-0 placeholder:text-(--text-muted) font-medium"
                  placeholder="Search by name, role, or keyword..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 p-1 w-full lg:w-auto">
              <ModernDropdown
                label="Skills"
                selected={selectedSkill}
                setSelected={setSelectedSkill}
                options={["All Skills", ...skills]}
              />
              <ModernDropdown
                label="Status"
                selected={selectedStatus}
                setSelected={setSelectedStatus}
                options={["All Statuses", ...statuses]}
              />

              <button
                onClick={handleRefine}
                className="bg-(--input-bg) hover:bg-primary/10 text-(--text-main) rounded-xl border border-(--border-subtle) flex items-center gap-2 px-4 py-2 text-sm font-semibold h-[46px]"
              >
                <span className="material-symbols-outlined text-lg opacity-60">
                  tune
                </span>{" "}
                Refine
              </button>
            </div>
          </div>
        </section>

        {/* Candidates Table */}
        <div className="space-y-5">
          {filteredCandidates.length > 0 ? (
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-[2.5rem] overflow-visible border-(--border-subtle) shadow-sm"
            >
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px] overflow-visible">
                  <thead>
                    <tr className="bg-(--input-bg) border-b border-(--border-subtle)">
                      <th className="px-8 py-5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        First Name
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Last Name
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Email
                      </th>
                      <th className="px-8 py-4 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Phone Number
                      </th>
                      <th className="px-8 py-4 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Country
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-8 py-5 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {filteredCandidates?.map((candidate) => (
                      <motion.tr
                        key={candidate.id}
                        whileHover={{
                          backgroundColor: "rgba(19, 236, 164, 0.02)",
                        }}
                        onClick={() =>
                          router.push(
                            `/users/system/candidates/all_candidates/${candidate.id.replace("#", "")}`,
                          )
                        }
                        className="transition-colors group cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelect(candidate.id);
                              }}
                              className={`w-5 h-5 rounded border transition-all flex items-center justify-center shrink-0 ${candidate.id && selectedIds.includes(candidate.id) ? "bg-primary border-primary text-white" : "border-(--border-subtle) bg-(--input-bg) group-hover:border-primary/50"}`}
                            >
                              {candidate.id &&
                                selectedIds.includes(candidate.id) && (
                                  <span className="material-symbols-outlined text-[14px] font-bold">
                                    check
                                  </span>
                                )}
                            </button>
                            <div className="size-10 rounded-xl border border-primary/20 p-0.5 overflow-hidden bg-(--surface) shadow-sm">
                              <Image
                                src={"/images/avatar-img/avatar-1.jpg"}
                                alt={`${candidate?.step1?.firstName} ${candidate?.step1?.lastName}`}
                                width={40}
                                height={40}
                                className="rounded-lg object-cover w-9 h-9"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-(--text-main) group-hover:text-primary transition-colors">
                                {candidate?.step1?.firstName}
                              </p>
                              <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest">
                                {candidate.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-(--text-main) group-hover:text-primary transition-colors">
                            {candidate?.step1?.lastName}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold text-(--text-main) group-hover:text-primary transition-colors text-center">
                            {candidate?.step1?.email}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold text-(--text-main) text-center">
                            {candidate?.step1?.phone || "—"}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold text-(--text-main) text-center">
                            {candidate?.step1?.country}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center gap-2">
                            <StatusBadge status={candidate?.step2?.status} />
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <ActionIconButton
                              icon="visibility"
                              tooltip="View Profile"
                              variant="primary"
                              onClick={() =>
                                router.push(
                                  `/users/system/candidates/all_candidates/${candidate.id.replace("#", "")}`,
                                )
                              }
                            />
                            <ActionIconButton
                              icon="edit"
                              tooltip="Edit Candidate"
                              onClick={() =>
                                router.push(
                                  `/users/system/candidates/Add_candidate/basic_info?id=${candidate.id.replace("#", "")}`,
                                )
                              }
                            />
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="glass-panel rounded-[2.5rem] p-20 text-center border-dashed border-2 border-(--border-subtle) bg-white/5"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-glow">
                <span className="material-symbols-outlined text-primary text-5xl">
                  person_search
                </span>
              </div>
              <h2 className="text-2xl font-bold text-(--text-main) mb-3 tracking-tight">
                No Candidates Match
              </h2>
              <p className="text-sm text-(--text-muted) max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                Try adjusting your filters or search query to find the talent
                you're looking for.
              </p>
              <button
                onClick={handleRefine}
                className="active-tab-gradient text-white font-bold px-10 py-4 rounded-2xl shadow-premium hover:translate-y-[-2px] transition-all"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>

        <footer className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-(--text-muted) font-medium">
            Showing{" "}
            <span className="text-(--text-main)">
              {filteredCandidates.length}
            </span>{" "}
            of {candidates.length} total candidates
          </p>
          <div className="flex gap-2">
            <PaginationButton icon="chevron_left" disabled />
            <PaginationButton label="1" active />
            <PaginationButton label="2" />
            <PaginationButton label="3" />
            <PaginationButton icon="chevron_right" />
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status?: CandidateStatus | string }) {
  const configs: any = {
    [CandidateStatus.Active]: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      dot: "bg-emerald-500",
      pulse: true,
    },
    [CandidateStatus.Placed]: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      dot: "bg-blue-500",
      pulse: false,
    },
    [CandidateStatus.Archived]: {
      bg: "bg-slate-500/10",
      text: "text-slate-500",
      border: "border-slate-500/20",
      dot: "bg-slate-500",
      pulse: false,
    },
    [CandidateStatus.Passive]: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
      dot: "bg-amber-500",
      pulse: false,
    },
    [CandidateStatus.Blacklisted]: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      border: "border-red-500/20",
      dot: "bg-red-500",
      pulse: false,
    },
  };

  const displayStatus = status || CandidateStatus.Active;
  const config = configs[displayStatus] || configs[CandidateStatus.Active];

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-[9px] font-bold uppercase tracking-widest`}
    >
      <span
        className={`size-1 rounded-full ${config.dot} ${config.pulse ? "animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""}`}
      />
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
}

function MenuButton({ icon, label, isDanger, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${isDanger ? "text-red-500 hover:bg-red-500/10" : "text-(--text-main) hover:bg-primary/10 hover:text-primary"}`}
    >
      <span className="material-symbols-outlined text-lg opacity-70">
        {icon}
      </span>
      {label}
    </button>
  );
}

function ModernDropdown({ label, selected, setSelected, options }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-w-[150px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-(--input-bg) border border-(--border-subtle) rounded-xl px-4 h-[46px] flex items-center justify-between gap-3 hover:border-primary/50 transition-all"
      >
        <div className="flex flex-col items-start">
          <span className="text-[9px] font-bold text-(--text-muted) opacity-60 leading-none mb-1 uppercase tracking-tight">
            {label}
          </span>
          <span className="text-xs font-bold text-(--text-main)">
            {selected}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="material-symbols-outlined text-primary text-xl"
        >
          expand_more
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 5 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-(--surface) rounded-2xl border border-(--glass-border) shadow-2xl overflow-hidden p-1 z-50 transition-all"
          >
            {options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors ${selected === opt ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

function PaginationButton({ label, icon, active, disabled }: any) {
  return (
    <button
      disabled={disabled}
      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${active ? "bg-primary text-white border-primary shadow-glow" : "glass-panel text-(--text-muted) border-(--border-subtle) hover:text-primary hover:border-primary/30 disabled:opacity-30"}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-sm font-bold">{label}</span>
      )}
    </button>
  );
}

function ActionIconButton({
  icon,
  tooltip,
  onClick,
  variant = "default",
}: {
  icon: string;
  tooltip: string;
  onClick?: () => void;
  variant?: "default" | "primary";
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`p-2 rounded-xl transition-all border ${
          variant === "primary"
            ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white"
            : "text-(--text-muted) hover:text-(--text-main) bg-transparent border-transparent hover:border-(--border-subtle) hover:bg-(--input-bg)"
        }`}
      >
        <span className="material-symbols-outlined text-xl leading-none">
          {icon}
        </span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-[2000] px-3 py-1.5 bg-(--surface) border border-(--border-subtle) rounded-lg shadow-2xl pointer-events-none whitespace-nowrap"
          >
            <p className="text-[10px] font-bold text-(--text-main) uppercase tracking-[0.1em]">
              {tooltip}
            </p>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--surface) border-b border-r border-(--border-subtle) rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
