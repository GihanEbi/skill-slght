import { Timestamp, UUID } from "./common_types";

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum WorkArrangement {
  Remote = "REMOTE",
  Hybrid = "HYBRID",
  OnSite = "ON_SITE",
}

export enum EmploymentType {
  FullTime = "FULL_TIME",
  PartTime = "PART_TIME",
  Contract = "CONTRACT",
  Intern = "INTERN",
}

export enum JobStatus {
  Draft = "DRAFT",
  Active = "ACTIVE",
  Closed = "CLOSED",
  OnHold = "ON_HOLD",
}

export enum CandidateJobStatus {
  Active = "ACTIVE",
  Draft = "DRAFT",
  Urgent = "URGENT",
  Paused = "PAUSED",
  Closed = "CLOSED",
}

export enum ProficiencyLevel {
  Beginner = "BEGINNER",
  Intermediate = "INTERMEDIATE",
  Advanced = "ADVANCED",
  Expert = "EXPERT",
}

export enum InterviewType {
  AI = "AI",
  Technical = "TECHNICAL",
}

export enum ChatUserType {
  AI = "AI",
  Candidate = "CANDIDATE",
}

export interface Department {
  id: UUID;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface Benefit {
  id: UUID;
  name: string;
  icon_url: string | null;
  description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface JobTemplate {
  id: UUID;
  /** FK → Job — template linked to a base job */
  job_id: UUID | null;
  name: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface ExternalPublisher {
  id: UUID;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface Job {
  id: UUID;
  department_id: UUID;
  /** FK → JobTemplate */
  template_id: UUID | null;
  /** FK → Benefit (primary benefit; many-to-many via JobBenefit) */
  benefit_id: UUID | null;
  title: string;
  location: string | null;
  work_arrangement: WorkArrangement;
  employment_type: EmploymentType;
  description: string;
  is_internal: boolean;
  salary_min: number | null;
  salary_max: number | null;
  /** e.g. "USD", "LKR" */
  currency: string | null;
  published_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

/** Many-to-many: Job ↔ Benefit */
export interface JobBenefit {
  job_id: UUID;
  benefit_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface JobSkill {
  job_id: UUID;
  skill_id: UUID;
  /** Priority weight, e.g. 1–5 */
  importance: number | null;
  min_years: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface JobHiringManager {
  job_id: UUID;
  hiring_manager_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

/** Many-to-many: Job ↔ ExternalPublisher */
export interface JobExternalPublisher {
  job_id: UUID;
  external_publisher_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface JobStatusHistory {
  id: UUID;
  job_id: UUID;
  status: JobStatus;
  remark: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface JobScoreCard {
  id: UUID;
  job_id: UUID;
  title: string;
  description: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}
