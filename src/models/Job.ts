// =============================================================================
// Job Model — SkillSight ATS
// =============================================================================
// Helper functions and factory utilities for the Job domain.
// All types are imported from src/types/job_types.ts.
// All option values are imported from src/constants/job_constants.ts.
// =============================================================================

import { type Job, type JobCompensation } from "../types/job_types";
import { currencies } from "../constants/job_constants";

// Re-export everything so consumers can import from a single place if needed.
export * from "../types/job_types";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a blank Job with sensible defaults for the Create Job wizard.
 * Uses plain string literals that match the constants — no enum references.
 */
export function createBlankJob(overrides?: Partial<Job>): Job {
  const now = new Date().toISOString();

  return {
    id: "",
    title: "",
    department: "Engineering",
    category: "External",
    status: "Draft",
    location: "Remote",
    locationType: "Remote",
    postedAt: "",
    createdAt: now,
    updatedAt: now,
    description: "",
    skills: [],
    hiringTeamAvatars: [],
    templateId: null,

    // Benefits defaults
    benefits: {
      standard: {
        healthInsurance: false,
        unlimitedPTO: false,
        matching401k: false,
        parentalLeave: false,
      },
      workLife: {
        flexibleHours: false,
        remoteFirst: false,
        mentalHealthDays: false,
      },
      customPerks: [],
    },

    // Compensation defaults
    compensation: {
      currency: "USD",
      minSalary: 100000,
      maxSalary: 150000,
      bonusEquity: {
        performanceBonus: true,
        signingBonus: false,
        stockOptions: true,
      },
      financialAddOns: [],
    },

    // Publish defaults
    publishSettings: {
      protocol: "Internal Only",
      platforms: [],
      hiringManager: "Alex Rivera (Product Lead)",
      saveAsTemplate: false,
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/** Returns true if the job is in an active, recruitable state. */
export function isJobActive(job: Job): boolean {
  return job.status === "Active" || job.status === "Urgent";
}

/** Returns true if the job has been archived / closed. */
export function isJobClosed(job: Job): boolean {
  return job.status === "Closed";
}

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------

/**
 * Formats the salary range as a human-readable display string.
 * Example: "$120,000 – $180,000 USD"
 */
export function formatSalaryRange(comp: JobCompensation): string {
  const symbol = comp.currency === currencies[0] ? "$" : "LKR ";
  const min = comp.minSalary.toLocaleString();
  const max = comp.maxSalary.toLocaleString();
  return `${symbol}${min} – ${symbol}${max} ${comp.currency}`;
}
