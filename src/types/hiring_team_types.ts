import { UUID, Timestamp } from "./common_types";

export enum TeamMemberRole {
  Admin = "ADMIN",
  Interviewer = "INTERVIEWER",
  Recruiter = "RECRUITER",
  HiringManager = "HIRING_MANAGER",
}

export enum MemberStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
  Busy = "BUSY",
}

export interface TeamMemberStat {
  label: string;
  value: string | number;
}

export interface HiringTeamMember {
  id: UUID;
  /** FK → User (Links to the actual system user) */
  user_id: UUID;
  first_name: string;
  last_name: string;
  /** File name or URL, e.g., "avatar-2.jpg" */
  avatar_url: string;
  /** Professional Job Title, e.g., "Senior Recruiter" */
  job_title: string;
  /** System access level/tag */
  system_role: TeamMemberRole;
  status: MemberStatus;
  /** Array of stats to display on their card */
  stats: TeamMemberStat[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TeamMemberActivity {
  id: UUID;
  action: string;
  target: string;
  date: string;
}

export interface TeamMemberPermission {
  id: UUID;
  module: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
}
