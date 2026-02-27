// =============================================================================
// Job Constants — SkillSight ATS
// =============================================================================
// Single source of truth for all job-domain option lists.
// "as const" lets TypeScript infer narrow literal types from these arrays,
// which job_types.ts uses to derive union types automatically.
// =============================================================================

export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Product",
  "Design",
  "Data",
  "Legal",
  "Customer Success",
  "Support",
  "Other",
] as const;

export const jobCategories = ["Internal", "External"] as const;

export const jobStatuses = [
  "Active",
  "Draft",
  "Paused",
  "Closed",
  "Urgent",
] as const;

export const closeReasons = [
  "Position Filled",
  "Hiring Paused",
  "Budget Adjustments",
  "Other",
] as const;

export const locationTypes = ["Remote", "Hybrid", "Onsite"] as const;

export const currencies = ["USD", "LKR"] as const;

export const teamMemberRoles = ["Admin", "Recruiter", "Interviewer"] as const;

export const memberStatuses = ["online", "offline"] as const;

export const hiringProtocols = ["Internal Only", "External Public"] as const;

export const publishingPlatforms = ["LinkedIn", "Indeed", "Glassdoor"] as const;
