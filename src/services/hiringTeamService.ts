import { UUID } from "../types/common_types";
import {
  HiringTeamMember,
  TeamMemberRole,
  MemberStatus,
  TeamMemberActivity,
  TeamMemberPermission,
} from "../types/hiring_team_types";

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 800));

// ==========================================
// Mock Data
// ==========================================

let mockTeamMembers: HiringTeamMember[] = [
  {
    id: "HT-001",
    user_id: "USR-101",
    first_name: "Alex",
    last_name: "Rivers",
    avatar_url: "avatar-2.jpg",
    job_title: "Senior Recruiter",
    system_role: TeamMemberRole.Admin,
    status: MemberStatus.Online,
    stats: [
      { label: "Active Jobs", value: "12" },
      { label: "Candidates Managed", value: "1.4k" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "HT-002",
    user_id: "USR-102",
    first_name: "Sarah",
    last_name: "Chen",
    avatar_url: "alkesh.png",
    job_title: "Engineering Manager",
    system_role: TeamMemberRole.Interviewer,
    status: MemberStatus.Online,
    stats: [
      { label: "Active Jobs", value: "4" },
      { label: "Avg. Interview Score", value: "4.8" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "HT-003",
    user_id: "USR-103",
    first_name: "Marcus",
    last_name: "Thorne",
    avatar_url: "profile-pic.png",
    job_title: "Tech Talent Partner",
    system_role: TeamMemberRole.Recruiter,
    status: MemberStatus.Offline,
    stats: [
      { label: "Active Jobs", value: "18" },
      { label: "Hires this month", value: "5" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Activities Map (Keyed by Member ID)
const mockActivities: Record<string, TeamMemberActivity[]> = {
  "HT-001": [
    {
      id: "ACT-1",
      action: "Published Job Post",
      target: "Senior Blockchain Engineer",
      date: "2 hours ago",
    },
    {
      id: "ACT-2",
      action: "Moved Candidate to Offer",
      target: "Elena Volkov",
      date: "Yesterday",
    },
    {
      id: "ACT-3",
      action: "Updated Protocol Settings",
      target: "Global Pipeline",
      date: "2 days ago",
    },
  ],
  "HT-002": [
    {
      id: "ACT-4",
      action: "Submitted Interview Score",
      target: "Marcus Thorne (94%)",
      date: "4 hours ago",
    },
    {
      id: "ACT-5",
      action: "Added Note to Candidate",
      target: "Sarah Chen",
      date: "Yesterday",
    },
  ],
  "HT-003": [
    {
      id: "ACT-6",
      action: "Sourced New Candidate",
      target: "Julian Voss",
      date: "1 hour ago",
    },
    {
      id: "ACT-7",
      action: "Sent Email",
      target: "Offer Letter - Julian Voss",
      date: "Yesterday",
    },
    {
      id: "ACT-8",
      action: "Closed Job Post",
      target: "Frontend Developer",
      date: "3 days ago",
    },
  ],
};

// Mock Permissions Map (Keyed by Member Role to make it generic for new users)
const rolePermissionsMap: Record<TeamMemberRole, TeamMemberPermission[]> = {
  [TeamMemberRole.Admin]: [
    {
      id: "PERM-1",
      module: "Job Postings",
      can_view: true,
      can_edit: true,
      can_delete: true,
    },
    {
      id: "PERM-2",
      module: "Candidate Pipeline",
      can_view: true,
      can_edit: true,
      can_delete: true,
    },
    {
      id: "PERM-3",
      module: "System Settings",
      can_view: true,
      can_edit: true,
      can_delete: true,
    },
  ],
  [TeamMemberRole.HiringManager]: [
    {
      id: "PERM-4",
      module: "Job Postings",
      can_view: true,
      can_edit: true,
      can_delete: false,
    },
    {
      id: "PERM-5",
      module: "Candidate Pipeline",
      can_view: true,
      can_edit: true,
      can_delete: false,
    },
    {
      id: "PERM-6",
      module: "System Settings",
      can_view: false,
      can_edit: false,
      can_delete: false,
    },
  ],
  [TeamMemberRole.Recruiter]: [
    {
      id: "PERM-7",
      module: "Job Postings",
      can_view: true,
      can_edit: true,
      can_delete: false,
    },
    {
      id: "PERM-8",
      module: "Candidate Pipeline",
      can_view: true,
      can_edit: true,
      can_delete: false,
    },
    {
      id: "PERM-9",
      module: "System Settings",
      can_view: false,
      can_edit: false,
      can_delete: false,
    },
  ],
  [TeamMemberRole.Interviewer]: [
    {
      id: "PERM-10",
      module: "Job Postings",
      can_view: true,
      can_edit: false,
      can_delete: false,
    },
    {
      id: "PERM-11",
      module: "Candidate Pipeline",
      can_view: true,
      can_edit: true,
      can_delete: false,
    },
    {
      id: "PERM-12",
      module: "System Settings",
      can_view: false,
      can_edit: false,
      can_delete: false,
    },
  ],
};

// ==========================================
// CRUD Operations
// ==========================================

export const fetchHiringTeam = async (): Promise<HiringTeamMember[]> => {
  await simulateDelay();
  return [...mockTeamMembers];
};

export const fetchTeamMemberById = async (
  id: UUID,
): Promise<HiringTeamMember | undefined> => {
  await simulateDelay();
  return mockTeamMembers.find((m) => m.id === id);
};

export const addTeamMember = async (
  memberData: Omit<HiringTeamMember, "id" | "created_at" | "updated_at">,
): Promise<HiringTeamMember> => {
  await simulateDelay();
  const newMember: HiringTeamMember = {
    ...memberData,
    id: `HT-${Math.floor(Math.random() * 10000)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockTeamMembers = [newMember, ...mockTeamMembers];
  return newMember;
};

export const updateTeamMember = async (
  id: UUID,
  updates: Partial<HiringTeamMember>,
): Promise<HiringTeamMember> => {
  await simulateDelay();
  const index = mockTeamMembers.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Team member not found");

  const updatedMember = {
    ...mockTeamMembers[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  mockTeamMembers[index] = updatedMember;
  return updatedMember;
};

export const removeTeamMember = async (id: UUID): Promise<void> => {
  await simulateDelay();
  mockTeamMembers = mockTeamMembers.filter((m) => m.id !== id);
};

// --- NEW POPUP FUNCTIONS ---

export const fetchTeamMemberActivities = async (
  id: UUID,
): Promise<TeamMemberActivity[]> => {
  await simulateDelay();
  // Return specific mock data or a generic fallback for newly created users
  return (
    mockActivities[id] || [
      {
        id: `ACT-${Date.now()}`,
        action: "Joined Hiring Team",
        target: "System",
        date: "Just now",
      },
    ]
  );
};

export const fetchTeamMemberPermissions = async (
  role: TeamMemberRole,
): Promise<TeamMemberPermission[]> => {
  await simulateDelay();
  // Fetch based on system role
  return (
    rolePermissionsMap[role] || rolePermissionsMap[TeamMemberRole.Interviewer]
  );
};
