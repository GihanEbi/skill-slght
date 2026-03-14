/**
 * src/services/jobService.ts
 *
 * Central service for the Job Creation Workflow.
 * All data is stored in localStorage (replace with API calls when backend is ready).
 * Aligned to job_types.ts, candidate_job_types.ts, and common_types.ts.
 */

import {
  Job,
  JobBenefit,
  JobSkill,
  JobHiringManager,
  JobExternalPublisher,
  JobStatusHistory,
  JobScoreCard,
  JobTemplate,
  Department,
  Benefit,
  ExternalPublisher,
  JobStatus,
  WorkArrangement,
  EmploymentType,
} from "../types/job_types";
import { UUID } from "../types/common_types";
import {
  fetchDepartments,
  fetchBenefits,
  fetchJobTemplates,
  fetchExternalPublishers,
} from "./settingsServices/jobSettingsServices";

// ---------------------------------------------------------------------------
// LocalStorage Keys
// ---------------------------------------------------------------------------
export const LS_DRAFT_KEY = "job_creation_draft";
export const LS_ACTIVE_JOBS_KEY = "active_jobs";

// ---------------------------------------------------------------------------
// UI-only helper types (not persisted as-is — mapped to DB types on save)
// ---------------------------------------------------------------------------

export interface JobDraft {
  // Step 1 – Details
  title: string;
  department_id: UUID | null;
  department_name: string; // UI display only
  location: string | null;
  work_arrangement: WorkArrangement;
  employment_type: EmploymentType;
  description: string;
  skill_ids: UUID[]; // maps to JobSkill[]
  skill_names: string[]; // UI display only
  template_id: UUID | null;

  // Step 2 – Benefits
  benefit_ids: UUID[]; // maps to JobBenefit[]
  benefit_names: string[]; // UI display only
  custom_perks: string[]; // stored as extra data (not in core schema)
  work_life_flexible_hours: boolean;
  work_life_remote_first: boolean;
  work_life_mental_health_days: boolean;

  // Step 3 – Compensation
  currency: string;
  salary_min: number | null;
  salary_max: number | null;
  performance_bonus: boolean;
  signing_bonus: boolean;
  stock_options: boolean;
  financial_add_ons: string[];

  // Step 4 – Publish Settings
  is_internal: boolean;
  external_publisher_ids: UUID[];
  external_publisher_names: string[]; // UI display only
  hiring_manager_ids: UUID[];
  hiring_manager_names: string[]; // UI display only
  save_as_template: boolean;
  status: JobStatus;

  // Meta
  created_at: string;
  updated_at: string;
}

/** Creates a blank draft with sensible defaults */
export function createBlankDraft(): JobDraft {
  const now = new Date().toISOString();
  return {
    title: "",
    department_id: null,
    department_name: "",
    location: null,
    work_arrangement: WorkArrangement.Hybrid,
    employment_type: EmploymentType.FullTime,
    description: "",
    skill_ids: [],
    skill_names: [],
    template_id: null,

    benefit_ids: [],
    benefit_names: [],
    custom_perks: [],
    work_life_flexible_hours: false,
    work_life_remote_first: false,
    work_life_mental_health_days: false,

    currency: "USD",
    salary_min: 120000,
    salary_max: 180000,
    performance_bonus: true,
    signing_bonus: false,
    stock_options: true,
    financial_add_ons: [],

    is_internal: true,
    external_publisher_ids: [],
    external_publisher_names: [],
    hiring_manager_ids: [],
    hiring_manager_names: [],
    save_as_template: false,
    status: JobStatus.Draft,

    created_at: now,
    updated_at: now,
  };
}
// ==========================================
// Job Templates Mock & Service
// ==========================================

export interface ExtendedJobTemplate {
  id: string;
  name: string;
  is_active: boolean;
  category: string;
  icon: string;
  usage: number;
  stages: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

const mockJobTemplates: JobDraft[] = [
  {
    title: "Senior Blockchain Engineer",
    department_id: "DEPT-101",
    department_name: "Engineering",
    location: "Berlin, Germany",
    work_arrangement: WorkArrangement.Remote,
    employment_type: EmploymentType.FullTime,
    description:
      "We are looking for a Senior Blockchain Engineer to lead the development of our L2 scaling solutions. You will be responsible for smart contract architecture, protocol security, and optimizing zero-knowledge proofs.",
    skill_ids: ["SK-1", "SK-2", "SK-3"],
    skill_names: ["Rust", "Solidity", "Cryptography", "Go"],
    template_id: "TPL-001",
    benefit_ids: ["BEN-1", "BEN-2"],
    benefit_names: ["Premium Health Insurance", "Home Office Setup"],
    custom_perks: [
      "Annual Web3 Conference Ticket",
      "Crypto hardware wallet allowance",
    ],
    work_life_flexible_hours: true,
    work_life_remote_first: true,
    work_life_mental_health_days: true,
    currency: "USD",
    salary_min: 160000,
    salary_max: 210000,
    performance_bonus: true,
    signing_bonus: true,
    stock_options: true,
    financial_add_ons: ["Token Token Allocation", "Quarterly Protocol Grants"],
    is_internal: false,
    external_publisher_ids: ["PUB-1", "PUB-2"],
    external_publisher_names: ["LinkedIn", "Web3Jobs"],
    hiring_manager_ids: ["HM-001"],
    hiring_manager_names: ["Sarah Chen"],
    save_as_template: true,
    status: JobStatus.Draft,
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-12T14:30:00Z",
  },
  {
    title: "Product Marketing Manager",
    department_id: "DEPT-102",
    department_name: "Marketing",
    location: "New York, USA",
    work_arrangement: WorkArrangement.Hybrid,
    employment_type: EmploymentType.FullTime,
    description:
      "Join our growth team to drive adoption of our enterprise suite. You will craft go-to-market strategies, manage competitive positioning, and lead product launches.",
    skill_ids: ["SK-4", "SK-5"],
    skill_names: ["Go-to-Market Strategy", "Copywriting", "Data Analytics"],
    template_id: null,
    benefit_ids: ["BEN-1", "BEN-3"],
    benefit_names: ["Premium Health Insurance", "Learning Stipend"],
    custom_perks: ["Gym Membership"],
    work_life_flexible_hours: true,
    work_life_remote_first: false,
    work_life_mental_health_days: false,
    currency: "USD",
    salary_min: 110000,
    salary_max: 140000,
    performance_bonus: true,
    signing_bonus: false,
    stock_options: true,
    financial_add_ons: ["Annual Performance Bonus"],
    is_internal: true,
    external_publisher_ids: [],
    external_publisher_names: [],
    hiring_manager_ids: ["HM-002", "HM-003"],
    hiring_manager_names: ["Marcus Thorne", "Elena Voss"],
    save_as_template: false,
    status: JobStatus.Draft,
    created_at: "2024-03-11T09:15:00Z",
    updated_at: "2024-03-11T09:15:00Z",
  },
];

export const fetchRichJobTemplates = async (): Promise<JobDraft[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockJobTemplates];
};

// ---------------------------------------------------------------------------
// Draft CRUD (localStorage)
// ---------------------------------------------------------------------------

export function getDraft(): JobDraft {
  try {
    const raw = localStorage.getItem(LS_DRAFT_KEY);
    if (raw) return { ...createBlankDraft(), ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return createBlankDraft();
}

export function saveDraft(patch: Partial<JobDraft>): JobDraft {
  const current = getDraft();
  const updated: JobDraft = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(LS_DRAFT_KEY, JSON.stringify(updated));
  return updated;
}

export function clearDraft(): void {
  localStorage.removeItem(LS_DRAFT_KEY);
}

// ---------------------------------------------------------------------------
// Active Jobs CRUD (localStorage — replace with API)
// ---------------------------------------------------------------------------

export function getActiveJobs(): JobDraft[] {
  try {
    const raw = localStorage.getItem(LS_ACTIVE_JOBS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export async function fetchActiveJobs(): Promise<any[]> {
  await new Promise((r) => setTimeout(r, 600));
  return getActiveJobs().map((job, i) => ({
    ...job,
    id: `JOB-${1000 + i}`,
    stats: {
      applied: Math.floor(Math.random() * 50) + 10,
      screening: Math.floor(Math.random() * 20) + 5,
      interview: Math.floor(Math.random() * 10) + 2,
      offer: Math.floor(Math.random() * 3),
      total: Math.floor(Math.random() * 100) + 30,
    },
  }));
}

export async function deleteActiveJobs(jobsToRemove: any[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  const activeJobs = getActiveJobs();
  // We use title for matching because draft id isn't fully set up with a uuid in the current localstorage implementation
  const idsToRemove = jobsToRemove.map((j) => j.title);
  const updatedJobs = activeJobs.filter((j) => !idsToRemove.includes(j.title));
  localStorage.setItem(LS_ACTIVE_JOBS_KEY, JSON.stringify(updatedJobs));
}

export function publishJob(draft: JobDraft): JobDraft {
  const jobs = getActiveJobs();
  const now = new Date().toISOString();
  const published: JobDraft = {
    ...draft,
    status: JobStatus.Active,
    updated_at: now,
  };
  localStorage.setItem(
    LS_ACTIVE_JOBS_KEY,
    JSON.stringify([...jobs, published]),
  );
  clearDraft();
  return published;
}

export function saveJobAsDraft(draft: JobDraft): JobDraft {
  const jobs = getActiveJobs();
  const now = new Date().toISOString();
  const saved: JobDraft = {
    ...draft,
    status: JobStatus.Draft,
    updated_at: now,
  };
  localStorage.setItem(LS_ACTIVE_JOBS_KEY, JSON.stringify([...jobs, saved]));
  clearDraft();
  return saved;
}

export function updateActiveJob(
  index: number,
  patch: Partial<JobDraft>,
): JobDraft[] {
  const jobs = getActiveJobs();
  jobs[index] = {
    ...jobs[index],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(LS_ACTIVE_JOBS_KEY, JSON.stringify(jobs));
  return jobs;
}

export function deleteActiveJob(index: number): JobDraft[] {
  const jobs = getActiveJobs();
  jobs.splice(index, 1);
  localStorage.setItem(LS_ACTIVE_JOBS_KEY, JSON.stringify(jobs));
  return jobs;
}

// ---------------------------------------------------------------------------
// Fetch helpers — wrapping settingsServices + adding workflow-specific data
// ---------------------------------------------------------------------------

/** Returns Department[] from settings service */
export {
  fetchDepartments,
  fetchJobTemplates,
  fetchBenefits,
  fetchExternalPublishers,
};

/** Work arrangement options derived from enum */
export async function fetchWorkArrangements(): Promise<WorkArrangement[]> {
  return Object.values(WorkArrangement);
}

/** Employment type options derived from enum */
export async function fetchEmploymentTypes(): Promise<EmploymentType[]> {
  return Object.values(EmploymentType);
}

/** Mock AI skill suggestions */
export async function fetchAiSkillSuggestions(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "GraphQL",
    "Python",
    "Kubernetes",
    "Terraform",
  ];
}

/** Mock AI perk suggestions */
export async function fetchAiPerkSuggestions(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    "Learning & Development Stipend",
    "Home Office Setup Budget",
    "Wellness Allowance",
    "Annual Team Retreat",
    "Conference Attendance",
    "Gym Membership",
    "Meal Allowance",
    "Internet Reimbursement",
  ];
}

/** Mock AI financial add-on suggestions */
export async function fetchFinancialAiSuggestions(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    "Quarterly Performance Review",
    "Profit Sharing",
    "Retention Bonus (12 months)",
    "Annual Salary Review",
    "Travel Reimbursement",
    "Relocation Assistance",
  ];
}

/** Supported currencies */
export async function fetchCurrencies(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 200));
  return ["USD", "LKR", "EUR", "GBP", "AUD", "CAD"];
}

/** Mock hiring managers (replace with User fetch filtered by role) */
export async function fetchHiringManagers(): Promise<
  { id: UUID; name: string }[]
> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: "HM-001", name: "Alex Johnson" },
    { id: "HM-002", name: "Sarah Chen" },
    { id: "HM-003", name: "Marcus Williams" },
    { id: "HM-004", name: "Priya Patel" },
  ];
}

// ---------------------------------------------------------------------------
// UI display helpers — icon maps etc.
// ---------------------------------------------------------------------------

export const WORK_ARRANGEMENT_ICONS: Record<WorkArrangement, string> = {
  [WorkArrangement.Remote]: "home",
  [WorkArrangement.Hybrid]: "apartment",
  [WorkArrangement.OnSite]: "corporate_fare",
};

export const WORK_ARRANGEMENT_LABELS: Record<WorkArrangement, string> = {
  [WorkArrangement.Remote]: "Remote",
  [WorkArrangement.Hybrid]: "Hybrid",
  [WorkArrangement.OnSite]: "On-Site",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Full-Time",
  [EmploymentType.PartTime]: "Part-Time",
  [EmploymentType.Contract]: "Contract",
  [EmploymentType.Intern]: "Internship",
};
