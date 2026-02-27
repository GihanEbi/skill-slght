import {
  departments,
  jobCategories,
  locationTypes,
} from "../constants/job_constants";
import { Department } from "../types/job_types";

export const LS_KEY = "job-createing-data";
export const ACTIVE_JOBS_KEY = "active-jobs";

// Types for the service
export interface JobTemplate {
  id: number;
  title: string;
  dept: Department;
  icon: string;
}

/**
 * Mocking a backend service for job-related data.
 * These functions simulate API calls with a slight delay.
 */

export const fetchDepartments = async (): Promise<string[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...departments];
};

export const fetchJobCategories = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...jobCategories];
};

export const fetchLocationTypes = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...locationTypes];
};

export const fetchJobTemplates = async (): Promise<JobTemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    { id: 1, title: "Blockchain Engineer", dept: "Engineering", icon: "hub" },
    { id: 2, title: "Product Designer", dept: "Design", icon: "palette" },
    {
      id: 3,
      title: "Smart Contract Auditor",
      dept: "Engineering",
      icon: "verified_user",
    },
    { id: 4, title: "Frontend Lead", dept: "Engineering", icon: "terminal" },
  ];
};

export const fetchAiSkillSuggestions = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return ["Hardhat", "Rust", "Go", "TypeScript", "AWS"];
};

export interface BenefitOption {
  id: string;
  label: string;
  icon: string;
}

export interface WorkLifeOption {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export const fetchStandardBenefitOptions = async (): Promise<
  BenefitOption[]
> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: "Health Insurance",
      label: "Health Insurance",
      icon: "health_and_safety",
    },
    { id: "Paid Time Off", label: "Unlimited PTO", icon: "event_available" },
    { id: "401k Matching", label: "401k Matching", icon: "savings" },
    { id: "Parental Leave", label: "Parental Leave", icon: "family_restroom" },
  ];
};

export const fetchWorkLifeOptions = async (): Promise<WorkLifeOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    {
      id: "flexible",
      icon: "schedule",
      title: "Flexible Hours",
      desc: "Autonomy to set your own working schedule",
    },
    {
      id: "remote",
      icon: "public",
      title: "Remote First",
      desc: "Work from anywhere in the world",
    },
    {
      id: "mental",
      icon: "self_improvement",
      title: "Mental Health Days",
      desc: "Dedicated quarterly rejuvenation leave",
    },
  ];
};

export const fetchAiPerkSuggestions = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [
    "Token Allocation (0.1% - 0.5%)",
    "Home Office Stipend ($1.5k)",
    "Learning & Development Budget",
    "Gym & Wellness Membership",
    "Annual Company Retreat",
  ];
};

export const fetchCurrencies = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return ["USD", "LKR"];
};

export const fetchFinancialAiSuggestions = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    "401k Matching (up to 4%)",
    "Relocation Assistance",
    "Performance-based Tokens",
    "Quarterly Profit Sharing",
    "Referral Bonus Program",
  ];
};

export const fetchHiringManagers = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    "Alex Rivera (Product Lead)",
    "Sarah Chen (Engineering Manager)",
    "James Wilson (Talent Acquisition)",
  ];
};

export const fetchTargetPlatforms = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ["LinkedIn", "Indeed", "Glassdoor"];
};
export const fetchActiveJobs = async (): Promise<any[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ACTIVE_JOBS_KEY);
  console.log(raw);

  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse active jobs", e);
    return [];
  }
};
export const deleteActiveJobs = async (jobsToRemove: any[]): Promise<void> => {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(ACTIVE_JOBS_KEY);
  if (!raw) return;
  try {
    const allJobs = JSON.parse(raw);
    const filtered = allJobs.filter((localJob: any) => {
      // Return false if this localJob should be removed
      return !jobsToRemove.some((toRemove) => {
        // Match by ID if both exist
        if (toRemove.id && localJob.id && toRemove.id === localJob.id)
          return true;
        // Match by composite key (Title + Dept + Location) if ID is missing or safe-id
        return (
          toRemove.title === localJob.title &&
          toRemove.dept === localJob.department &&
          toRemove.location === localJob.location
        );
      });
    });
    localStorage.setItem(ACTIVE_JOBS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete jobs", e);
  }
};
