import { SkillSource, Timestamp, UUID } from "./common_types";
import { ProficiencyLevel } from "./job_types";
// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum CandidateJobStatus {
  Active = "ACTIVE",
  Draft = "DRAFT",
  Urgent = "URGENT",
  Paused = "PAUSED",
  Closed = "CLOSED",
}

export enum CandidateStatus {
  Active = "ACTIVE",
  Placed = "PLACED",
  Archived = "ARCHIVED",
  Passive = "PASSIVE",
  Blacklisted = "BLACKLISTED",
}

export enum CandidateSource {
  LinkedIn = "LINKEDIN",
  Indeed = "INDEED",
  Referral = "REFERRAL",
  DirectApplication = "DIRECT_APPLICATION",
  Internal = "INTERNAL",
  Agency = "AGENCY",
  CareerFair = "CAREER_FAIR",
  Other = "OTHER",
}

export enum AvailabilityStatus {
  Immediately = "IMMEDIATELY",
  TwoWeeks = "2_WEEKS",
  OneMonth = "1_MONTH",
  ThreeMonths = "3_MONTHS",
  NotAvailable = "NOT_AVAILABLE",
}
export enum CertificateType {
  CoverLetter = "COVER_LETTER",
  Identification = "IDENTIFICATION",
}

export interface CandidateSocialLink {
  platform: string;
  url: string;
}

export interface CandidateSkillCategory {
  category: string;
  skills: string[];
}

export interface CandidateAssessment {
  label: string;
  score: number;
}

export interface CandidateExperience {
  id: string;
  company_name: string;
  job_title: string;
  start_date: string;
  end_date: string | null;
  is_currently_work_here: boolean;
  role_contribution: string;
  technologies: string[];
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  country: string;
  city: string;
  status: CandidateStatus;
  candidate_source: CandidateSource;
  availability_status: AvailabilityStatus;
  avatar_id: string;
  current_role: string;
  current_company: string;
  isUnicorn: boolean;
  pipeline_status: CandidateJobStatus;
  pipeline_stage: string;
  created_at: string;
  updated_at: string;

  // Resume & Links
  social_links: CandidateSocialLink[];
  resume_file_name: string;
  resume_size: string;

  // Profile Insights
  total_experience: string;
  expected_salary: string;
  languages: string;

  // Core Expertise
  skills: CandidateSkillCategory[];

  // Assessment Scores
  assessments: CandidateAssessment[];

  // Experience
  experiences: CandidateExperience[];

  // Retained Original Fields (Optional)
  cv_url_id?: string | null;
  is_verified?: boolean;
  linkedin_url?: string | null;
  website_url?: string | null;
  source_details?: string | null;
  current_salary?: number | null;
  earliest_start_date?: string | null; // ISO date "YYYY-MM-DD"
  created_by?: string | null;
  updated_by?: string | null;
}

export interface CandidateSkill {
  id: UUID;
  candidate_id: UUID;
  skill_id: UUID;
  years_experience: number | null;
  proficiency_level: ProficiencyLevel;
  skill_source: SkillSource;
  is_extracted_by_ai: boolean;
  /** 0.00 – 100.00 */
  confidence_score: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface CandidateWorkExperience {
  id: UUID;
  candidate_id: UUID;
  company_name: string;
  job_title: string;
  start_date: string; // "YYYY-MM-DD"
  end_date: string | null; // "YYYY-MM-DD"
  is_currently_work_here: boolean;
  role_contribution: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface CandidateEducation {
  id: UUID;
  candidate_id: UUID;
  institute_name: string;
  degree_qualification: string;
  field_of_study: string | null;
  start_date: string; // "YYYY-MM-DD"
  end_date: string | null; // "YYYY-MM-DD"
  is_currently_study: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface CertificationFile {
  id: UUID;
  candidate_id: UUID;
  file_storage_id: UUID;
  certificate_type: CertificateType;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface AddCandidateFormData {
  id?: string;
  step1: {
    profilePhotoUrl?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    country: string;
    city?: string;
    timezone?: string;
    willingToRelocate?: boolean;
    linkedInUrl?: string;
    portfolioUrl?: string;
    source: CandidateSource | string;
    sourceDetail?: string;
  };
  step2: {
    currentJobTitle?: string;
    currentCompany?: string;
    currentSalary?: number;
    currentSalaryCurrency?: string;
    availabilityStatus: string;
    status: CandidateStatus | string;
  };
  step3: {
    skills: any[];
  };
  step4: {
    workExperience: any[];
  };
  step5: {
    education: any[];
  };
  step6: {
    certifications: any[];
    portfolioFiles: any[];
  };
  step7: {
    internalNotes: string;
    gdprConsent: boolean;
    gdprConsentDate: string;
    tags: string[];
  };
}
