export interface SidebarSubItem {
  label: string;
  href: string;
}

export interface SidebarItem {
  icon: string;
  label: string;
  href?: string;
  activePattern?: string;
  subItems?: SidebarSubItem[];
}

// ─── Shared mobile nav (shown on small screens for every section) ─────────────
export const mobileNavItems: SidebarItem[] = [
  { icon: "grid_view", label: "Dashboard", href: "/users/system/dashboard" },
  {
    icon: "rocket_launch",
    label: "Jobs",
    href: "/users/system/jobs",
    subItems: [
      { label: "Active Jobs", href: "/users/system/jobs/active_jobs" },
      { label: "Create Job", href: "/users/system/jobs/create/details" },
      { label: "Closed Jobs", href: "/users/system/jobs/closed_jobs" },
      { label: "Job Templates", href: "/users/system/jobs/templates" },
      { label: "Hiring Teams", href: "/users/system/jobs/hiring-teams" },
    ],
  },
  {
    icon: "diversity_3",
    label: "Candidates",
    subItems: [
      { label: "All Candidates", href: "/users/system/candidates/all_candidates" },
      { label: "Add New Candidate", href: "/users/system/candidates/Add_candidate" },
      { label: "Candidate Pool", href: "/users/system/candidates/talent_pool" },
    ],
  },
  {
    icon: "bar_chart",
    label: "Reports",
    subItems: [{ label: "All Reports", href: "/users/system/reports" }],
  },
  {
    icon: "content_copy",
    label: "Templates",
    subItems: [{ label: "All Templates", href: "/users/system/templates" }],
  },
  {
    icon: "settings",
    label: "Settings",
    subItems: [{ label: "Jobs Settings", href: "/users/system/settings/jobs" }],
  },
];

// ─── Jobs section ─────────────────────────────────────────────────────────────
export const jobsNavItems: SidebarItem[] = [
  {
    icon: "rocket_launch",
    label: "Active Jobs",
    href: "/users/system/jobs/active_jobs",
    activePattern: "/users/system/jobs/active_jobs",
  },
  {
    icon: "add_circle",
    label: "Create Job",
    href: "/users/system/jobs/create/details",
    activePattern: "/users/system/jobs/create",
  },
  {
    icon: "archive",
    label: "Closed Jobs",
    href: "/users/system/jobs/closed_jobs",
  },
  {
    icon: "content_copy",
    label: "Job Templates",
    href: "/users/system/jobs/templates",
  },
  {
    icon: "groups",
    label: "Hiring Teams",
    href: "/users/system/jobs/hiring-teams",
  },
];

// ─── Candidates section ───────────────────────────────────────────────────────
export const candidatesNavItems: SidebarItem[] = [
  {
    icon: "diversity_3",
    label: "All Candidates",
    href: "/users/system/candidates/all_candidates",
    activePattern: "/users/system/candidates/all_candidates",
  },
  {
    icon: "add_circle",
    label: "Add Candidate",
    href: "/users/system/candidates/Add_candidate/basic_info",
    activePattern: "/users/system/candidates/Add_candidate",
  },
  {
    icon: "groups",
    label: "Talent Pools",
    href: "/users/system/candidates/talent_pool",
    activePattern: "/users/system/candidates/talent_pool",
  },
];

// ─── Settings section ─────────────────────────────────────────────────────────
export const settingsNavItems: SidebarItem[] = [
  {
    icon: "settings",
    label: "Jobs Settings",
    href: "/users/system/settings/jobs",
    activePattern: "/users/system/settings/jobs",
  },
];
