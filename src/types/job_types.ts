// =============================================================================
// Job Types — SkillSight ATS
// =============================================================================
// All types are derived from job_constants.ts as the single source of truth.
// No hardcoded string literals here — if a constant list changes, the types
// update automatically.
// =============================================================================

import type {
  departments,
  jobCategories,
  jobStatuses,
  closeReasons,
  locationTypes,
  currencies,
  teamMemberRoles,
  memberStatuses,
  hiringProtocols,
  publishingPlatforms,
} from "../constants/job_constants";

// ---------------------------------------------------------------------------
// Union types — derived from constants
// ---------------------------------------------------------------------------

/** e.g. "Engineering" | "Marketing" | "Design" | … */
export type Department = (typeof departments)[number];

/** "Internal" | "External" */
export type JobCategory = (typeof jobCategories)[number];

/** "Active" | "Draft" | "Paused" | "Closed" | "Urgent" */
export type JobStatus = (typeof jobStatuses)[number];

/** "Position Filled" | "Hiring Paused" | "Budget Adjustments" | "Other" */
export type CloseReason = (typeof closeReasons)[number];

/** "Remote" | "Hybrid" | "Onsite" */
export type LocationType = (typeof locationTypes)[number];

/** "USD" | "LKR" */
export type Currency = (typeof currencies)[number];

/** "Admin" | "Recruiter" | "Interviewer" */
export type TeamMemberRole = (typeof teamMemberRoles)[number];

/** "online" | "offline" */
export type MemberStatus = (typeof memberStatuses)[number];

/** "Internal Only" | "External Public" */
export type HiringProtocol = (typeof hiringProtocols)[number];

/** "LinkedIn" | "Indeed" | "Glassdoor" */
export type PublishingPlatform = (typeof publishingPlatforms)[number];

// ---------------------------------------------------------------------------
// Pipeline Stats
// ---------------------------------------------------------------------------

export interface PipelineStats {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Hired Candidate (closed jobs)
// ---------------------------------------------------------------------------

export interface HiredCandidate {
  name: string;
  /** Filename relative to /images/avatar-img/ */
  avatar: string;
}

// ---------------------------------------------------------------------------
// Benefits & Perks
// ---------------------------------------------------------------------------

export interface StandardBenefits {
  healthInsurance: boolean;
  unlimitedPTO: boolean;
  matching401k: boolean;
  parentalLeave: boolean;
}

export interface WorkLifeToggles {
  flexibleHours: boolean;
  remoteFirst: boolean;
  mentalHealthDays: boolean;
}

export interface JobBenefits {
  standard: StandardBenefits;
  workLife: WorkLifeToggles;
  /** Free-form perks, e.g. "Token Allocation (0.1%–0.5%)" */
  customPerks: string[];
}

// ---------------------------------------------------------------------------
// Compensation
// ---------------------------------------------------------------------------

export interface BonusEquityToggles {
  performanceBonus: boolean;
  signingBonus: boolean;
  stockOptions: boolean;
}

export interface JobCompensation {
  currency: Currency;
  minSalary: number;
  maxSalary: number;
  bonusEquity: BonusEquityToggles;
  /** Free-form add-ons, e.g. "401k Matching (up to 4%)" */
  financialAddOns: string[];
}

// ---------------------------------------------------------------------------
// Publish Settings
// ---------------------------------------------------------------------------

export interface JobPublishSettings {
  protocol: HiringProtocol;
  platforms: PublishingPlatform[];
  hiringManager: string;
  saveAsTemplate: boolean;
}

// ---------------------------------------------------------------------------
// Hiring Team Member
// ---------------------------------------------------------------------------

export interface HiringTeamMember {
  id: number;
  name: string;
  /** Filename relative to /images/avatar-img/ */
  avatar: string;
  role: string;
  tag: TeamMemberRole;
  status: MemberStatus;
  stats: Array<{ label: string; value: string }>;
}

// ---------------------------------------------------------------------------
// Job Template
// ---------------------------------------------------------------------------

export interface JobTemplate {
  id: number;
  title: string;
  category: Department;
  /** Material Symbol icon name */
  icon: string;
  usage: number;
  /** Ordered pipeline stage labels, e.g. ["Screening", "Technical Test", …] */
  stages: string[];
}

// ---------------------------------------------------------------------------
// Core Job Model
// ---------------------------------------------------------------------------

export interface Job {
  // Identity
  id: string;
  title: string;
  department: Department;
  category: JobCategory;
  status: JobStatus;

  // Location
  location: string;
  locationType: LocationType;

  // Timestamps
  postedAt: string;
  createdAt: string;
  updatedAt: string;

  // Content
  description: string;
  skills: string[];

  // Badge (active listings only)
  tag?: string;
  tagColor?: "primary" | "orange";

  // Pipeline metrics (active jobs)
  stats?: PipelineStats;

  // Hiring team
  /** Avatar filenames of assigned team members */
  hiringTeamAvatars: string[];

  // Create-flow data
  benefits: JobBenefits;
  compensation: JobCompensation;
  publishSettings: JobPublishSettings;

  // Closed-job data
  dateClosed?: string;
  timeToFill?: string;
  hiredCandidate?: HiredCandidate;
  closeReason?: CloseReason;
  closeReasonOther?: string;

  // Template reference
  templateId?: number | null;
}
