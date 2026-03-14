"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  fetchHiringTeam,
  addTeamMember,
  fetchTeamMemberActivities,
  fetchTeamMemberPermissions,
} from "@/services/hiringTeamService";
import {
  HiringTeamMember,
  TeamMemberRole,
  MemberStatus,
  TeamMemberActivity,
  TeamMemberPermission,
} from "@/types/hiring_team_types";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

// UI Helper: Map Role Enums to Tailwind Color Classes
const getRoleColors = (role: TeamMemberRole) => {
  switch (role) {
    case TeamMemberRole.Admin:
      return "bg-primary/10 text-primary border-primary/20";
    case TeamMemberRole.Interviewer:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case TeamMemberRole.Recruiter:
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case TeamMemberRole.HiringManager:
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
};

type ActiveModal = "add" | "permissions" | "activity" | null;

export default function HiringTeamPage() {
  const [teamMembers, setTeamMembers] = useState<HiringTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Unified Modal State
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalDataLoading, setIsModalDataLoading] = useState(false);

  // Active Member context for Permissions/Activities
  const [selectedMember, setSelectedMember] = useState<HiringTeamMember | null>(
    null,
  );
  const [activities, setActivities] = useState<TeamMemberActivity[]>([]);
  const [permissions, setPermissions] = useState<TeamMemberPermission[]>([]);

  // Add Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    job_title: "",
    system_role: TeamMemberRole.Recruiter,
  });

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await fetchHiringTeam();
        setTeamMembers(data);
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeam();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: TeamMemberRole) => {
    setFormData((prev) => ({ ...prev, system_role: role }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newMemberData = {
        user_id: `USR-${Math.floor(Math.random() * 1000)}`,
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: "user-preview.png",
        job_title: formData.job_title,
        system_role: formData.system_role as TeamMemberRole,
        status: MemberStatus.Online,
        stats: [
          { label: "Active Jobs", value: "0" },
          { label: "Candidates Managed", value: "0" },
        ],
      };
      const addedMember = await addTeamMember(newMemberData);
      setTeamMembers((prev) => [addedMember, ...prev]);
      setFormData({
        first_name: "",
        last_name: "",
        job_title: "",
        system_role: TeamMemberRole.Recruiter,
      });
      setActiveModal(null);
    } catch (error) {
      console.error("Error adding team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Modals & Fetch specific data
  const handleOpenActivity = async (member: HiringTeamMember) => {
    setSelectedMember(member);
    setActiveModal("activity");
    setIsModalDataLoading(true);
    const data = await fetchTeamMemberActivities(member.id);
    setActivities(data);
    setIsModalDataLoading(false);
  };

  const handleOpenPermissions = async (member: HiringTeamMember) => {
    setSelectedMember(member);
    setActiveModal("permissions");
    setIsModalDataLoading(true);
    const data = await fetchTeamMemberPermissions(member.system_role);
    setPermissions(data);
    setIsModalDataLoading(false);
  };

  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] transition-colors duration-300 no-scrollbar">
      {/* Dynamic Modal Container */}
      <AnimatePresence>
        {activeModal !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-[2rem] p-8 shadow-2xl border-[var(--border-subtle)] overflow-visible"
            >
              {/* === ADD MEMBER MODAL === */}
              {activeModal === "add" && (
                <>
                  <AnimatePresence>
                    {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-[var(--surface)]/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 rounded-[2rem]"
                      >
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                        <h3 className="text-[var(--text-main)] font-bold">
                          Adding Member...
                        </h3>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-2xl">
                        person_add
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                        Add Team Member
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Invite someone to the hiring protocol.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                          First Name
                        </label>
                        <input
                          required
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Alex"
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                          Last Name
                        </label>
                        <input
                          required
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          placeholder="e.g. Rivers"
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                        Job Title
                      </label>
                      <input
                        required
                        type="text"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        placeholder="e.g. Technical Recruiter"
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-primary/50 transition-all placeholder:opacity-30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">
                        System Role
                      </label>
                      <ModernRoleDropdown
                        selected={formData.system_role}
                        onChange={handleRoleChange}
                      />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[var(--border-subtle)] mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-3.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-bold text-sm hover:text-[var(--text-main)] hover:bg-[var(--surface)] transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={
                          !formData.first_name ||
                          !formData.last_name ||
                          !formData.job_title
                        }
                        className="flex-[2] active-tab-gradient py-3.5 rounded-xl text-white font-bold text-sm shadow-glow disabled:opacity-50 transition-all hover:-translate-y-0.5"
                      >
                        Add Member
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* === ACTIVITY MODAL === */}
              {activeModal === "activity" && selectedMember && (
                <>
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--border-subtle)]">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-2xl">
                        history
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                        Recent Activity
                      </h2>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Activity for {selectedMember.first_name}{" "}
                        {selectedMember.last_name}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="ml-auto p-2 text-[var(--text-muted)] hover:text-primary transition-colors bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  </div>

                  {isModalDataLoading ? (
                    <div className="flex flex-col items-center py-10">
                      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    </div>
                  ) : (
                    <div className="space-y-6 relative pl-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[var(--border-subtle)] rounded-full" />
                      {activities.map((act) => (
                        <div key={act.id} className="relative pl-8 pb-2">
                          <div className="absolute -left-[4px] top-1.5 w-2.5 h-2.5 bg-primary rounded-full shadow-glow border border-[var(--background)]" />
                          <p className="text-sm font-bold text-[var(--text-main)] leading-none mb-1.5">
                            {act.action}
                          </p>
                          <p className="text-[11px] font-semibold text-[var(--text-muted)] opacity-80">
                            {act.target} • {act.date}
                          </p>
                        </div>
                      ))}
                      {activities.length === 0 && (
                        <p className="text-sm text-[var(--text-muted)] italic">
                          No recent activity.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* === PERMISSIONS MODAL === */}
              {activeModal === "permissions" && selectedMember && (
                <>
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[var(--border-subtle)]">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-xl sm:text-2xl">
                        admin_panel_settings
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] tracking-tight truncate">
                        Access Control
                      </h2>
                      <p className="text-[10px] sm:text-xs text-[var(--text-muted)] font-medium truncate">
                        Role: {selectedMember.system_role.replace("_", " ")}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="p-1.5 sm:p-2 shrink-0 text-[var(--text-muted)] hover:text-primary transition-colors bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl"
                    >
                      <span className="material-symbols-outlined text-base sm:text-lg">
                        close
                      </span>
                    </button>
                  </div>

                  {isModalDataLoading ? (
                    <div className="flex flex-col items-center py-10">
                      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[350px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                      {permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--input-bg)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <span className="text-sm font-bold text-[var(--text-main)] max-sm:text-wrap leading-tight">
                            {perm.module}
                          </span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 bg-[var(--surface)] p-1.5 rounded-xl border border-[var(--border-subtle)] w-full sm:w-auto mt-2 sm:mt-0">
                            <PermissionBadge
                              label="Read"
                              active={perm.can_view}
                            />
                            <PermissionBadge
                              label="Write"
                              active={perm.can_edit}
                            />
                            <PermissionBadge
                              label="Delete"
                              active={perm.can_delete}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {!isLoading && (
                <span className="text-primary text-sm font-bold bg-primary/10 px-4 py-1.5 rounded-full border border-primary/10">
                  {teamMembers.length} Members
                </span>
              )}
            </h1>
          </div>

          <motion.button
            onClick={() => setActiveModal("add")}
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

        {/* Loading State or Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)] font-bold">
              Loading team data...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {teamMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onOpenActivity={() => handleOpenActivity(member)}
                onOpenPermissions={() => handleOpenPermissions(member)}
              />
            ))}

            {/* Add Team Member CTA Card */}
            <motion.button
              onClick={() => setActiveModal("add")}
              variants={itemVariants}
              whileHover={{
                borderColor: "rgba(13, 242, 128, 0.4)",
                backgroundColor: "rgba(13, 242, 128, 0.05)",
              }}
              className="border-2 border-dashed border-[var(--border-subtle)] rounded-[2rem] p-8 flex flex-col items-center justify-center gap-5 group transition-all min-h-[300px]"
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
        )}

        {/* Pagination Footer */}
        <footer className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] font-medium">
            Showing{" "}
            <span className="text-[var(--text-main)] font-bold">
              {teamMembers.length}
            </span>{" "}
            of {teamMembers.length} members
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

// --- Sub & Helper Components ---

function ModernRoleDropdown({
  selected,
  onChange,
}: {
  selected: TeamMemberRole;
  onChange: (val: TeamMemberRole) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { label: "Recruiter", value: TeamMemberRole.Recruiter },
    { label: "Interviewer", value: TeamMemberRole.Interviewer },
    { label: "Hiring Manager", value: TeamMemberRole.HiringManager },
    { label: "Admin", value: TeamMemberRole.Admin },
  ];

  const selectedLabel =
    roles.find((r) => r.value === selected)?.label || "Select Role";

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[var(--input-bg)] border rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-main)] outline-none transition-all flex items-center justify-between ${isOpen ? "border-primary/50 shadow-sm ring-2 ring-primary/10" : "border-[var(--border-subtle)] hover:border-primary/50"}`}
      >
        <span>{selectedLabel}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="material-symbols-outlined text-[var(--text-muted)] text-xl transition-colors"
        >
          expand_more
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 5 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 right-0 top-full mt-1 bg-[var(--surface)] border border-[var(--glass-border)] rounded-xl shadow-2xl overflow-hidden p-1 z-[300]"
            >
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    onChange(role.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${selected === role.value ? "text-primary bg-primary/10" : "text-[var(--text-main)] hover:bg-primary/5"}`}
                >
                  {role.label}
                  {selected === role.value && (
                    <span className="material-symbols-outlined text-[16px]">
                      check
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
            <div
              className="fixed inset-0 z-[250]"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PermissionBadge({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap flex-1 sm:flex-initial ${active ? "bg-primary/10 text-primary border border-primary/20" : "bg-[var(--background)] text-slate-500 border border-[var(--border-subtle)] opacity-50"}`}
    >
      <span className="material-symbols-outlined text-[11px] sm:text-[12px] shrink-0">
        {active ? "check_circle" : "cancel"}
      </span>
      <span>{label}</span>
    </div>
  );
}

function MemberCard({
  member,
  onOpenActivity,
  onOpenPermissions,
}: {
  member: HiringTeamMember;
  onOpenActivity: () => void;
  onOpenPermissions: () => void;
}) {
  const fullName = `${member.first_name} ${member.last_name}`;
  const tagColors = getRoleColors(member.system_role);
  const displayTag = member.system_role.replace("_", " ");

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-[2rem] p-7 flex flex-col gap-6 border-[var(--border-subtle)] shadow-sm relative overflow-hidden group min-h-[300px]"
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <Image
              src={`/images/avatar-img/${member.avatar_url}`}
              width={100}
              height={100}
              alt={fullName}
              className="w-16 h-16 rounded-2xl border-2 border-primary/20 object-cover shadow-premium bg-[var(--background)]"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[var(--surface)] rounded-full ${member.status === MemberStatus.Online ? "bg-primary" : "bg-slate-500"}`}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
              {fullName}
            </h3>
            <p className="text-[var(--text-muted)] text-xs font-medium">
              {member.job_title}
            </p>
            <span
              className={`mt-3 inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border w-fit ${tagColors}`}
            >
              {displayTag}
            </span>
          </div>
        </div>
        <button className="text-[var(--text-muted)] hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="flex items-center gap-8 py-5 border-y border-[var(--border-subtle)] relative z-10 flex-grow">
        {member.stats.map((stat, i) => (
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
        <button
          onClick={onOpenPermissions}
          className="flex-1 bg-[var(--surface)] hover:bg-[var(--input-bg)] text-[var(--text-main)] py-3 rounded-xl text-xs font-bold border border-[var(--border-subtle)] hover:border-primary/30 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">
            admin_panel_settings
          </span>
          Permissions
        </button>
        <button
          onClick={onOpenActivity}
          className="flex-1 bg-primary/5 hover:bg-primary/10 text-primary py-3 rounded-xl text-xs font-bold border border-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
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
      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${active ? "bg-primary text-[var(--background)] border-primary shadow-glow font-bold" : "glass-panel text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-primary hover:border-primary/30 disabled:opacity-30"}`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      ) : (
        <span className="text-sm font-bold">{label}</span>
      )}
    </button>
  );
}
