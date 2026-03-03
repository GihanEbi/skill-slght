// ─── ENUMS ───────────────────────────────────────────────────

export enum CandidateStatus {
  ACTIVE = "active", // Currently in pipeline / looking
  PASSIVE = "passive", // Open but not actively seeking
  PLACED = "placed", // Hired via system
  BLACKLISTED = "blacklisted", // Not eligible for rehire
  ARCHIVED = "archived",
}

export enum CandidateSource {
  LINKEDIN = "linkedin",
  INDEED = "indeed",
  REFERRAL = "referral",
  DIRECT_APPLICATION = "direct_application",
  AI_SUGGESTED = "ai_suggested",
  INTERNAL = "internal",
  AGENCY = "agency",
  CAREER_FAIR = "career_fair",
  OTHER = "other",
}

export enum ApplicationStatus {
  SOURCED = "sourced",
  OUTREACH_SENT = "outreach_sent",
  CONSENT_RECEIVED = "consent_received",
  APPLIED = "applied",
  SCREENING = "screening",
  ASSESSMENT = "assessment",
  INTERVIEW_STAGE_1 = "interview_stage_1",
  INTERVIEW_STAGE_2 = "interview_stage_2",
  INTERVIEW_STAGE_3 = "interview_stage_3",
  OFFER_EXTENDED = "offer_extended",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_DECLINED = "offer_declined",
  HIRED = "hired",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  ON_HOLD = "on_hold",
}

export enum ConsentStatus {
  PENDING = "pending",
  GRANTED = "granted",
  DECLINED = "declined",
  REVOKED = "revoked",
}

export enum SkillProficiency {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

// ─── SUB-MODELS ──────────────────────────────────────────────

export interface CandidateSkill {
  id: string;
  candidateId: string;
  skillName: string;
  proficiency: SkillProficiency;
  yearsOfExperience?: number;
}

export interface WorkExperience {
  id: string;
  candidateId: string;
  companyName: string;
  jobTitle: string;
  startDate: Date;
  endDate?: Date; // null = current role
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface Education {
  id: string;
  candidateId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
}

export interface CandidateDocument {
  id: string;
  candidateId: string;
  documentType: string; // "resume" | "cover_letter" | "certificate" | "id_proof"
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string; // userId of HR verifier
}

export interface CandidateNote {
  id: string;
  candidateId: string;
  content: string;
  createdBy: string; // userId
  createdAt: Date;
  updatedAt?: Date;
}

export interface OutreachLog {
  id: string;
  candidateId: string;
  jobId: string;
  channel: "email" | "sms" | "whatsapp" | "phone" | "in_app";
  message: string;
  sentAt: Date;
  responseReceivedAt?: Date;
  responseType?: "interested" | "not_interested" | "no_response";
}

export interface ConsentRecord {
  id: string;
  candidateId: string;
  consentType: "data_processing" | "marketing" | "background_check";
  status: ConsentStatus;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string; // For GDPR audit
}

// ─── APPLICATION (Candidate ↔ Job link) ──────────────────────

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;

  status: ApplicationStatus;
  currentStage?: string; // e.g. "Technical Interview"
  source: CandidateSource;
  referredBy?: string; // userId or external name

  aiMatchScore?: number; // 0–100
  aiMatchJustification?: string; // e.g. "Matches: Java, PM; Same region"

  appliedAt: Date;
  lastUpdatedAt: Date;
  closedAt?: Date;

  isInternalCandidate: boolean;
  isOffshoreInterview: boolean;

  offerId?: string;
  createdBy: string; // userId who added to pipeline
}

// ─── CORE CANDIDATE MODEL ────────────────────────────────────

export interface Candidate {
  // Identity
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  profilePhotoUrl?: string;

  // Location
  country: string;
  city?: string;
  timezone?: string;
  willingToRelocate?: boolean;

  // Current Role
  currentJobTitle?: string;
  currentCompany?: string;
  currentSalary?: number;
  currentSalaryCurrency?: string; // ISO 4217 e.g. "USD", "LKR"

  // Availability
  availabilityStatus:
    | "immediately"
    | "2_weeks"
    | "1_month"
    | "3_months"
    | "not_available";
  earliestStartDate?: Date;
  noticePeriodDays?: number;

  // Status & Source
  status: CandidateStatus;
  source: CandidateSource;
  sourceDetail?: string; // e.g. "LinkedIn Recruiter - Nov 2025 campaign"

  // GDPR / Privacy
  gdprConsent: boolean;
  gdprConsentDate?: Date;
  dataRetentionExpiry?: Date;
  isAnonymized: boolean;

  // Tags (searchable labels)
  tags: string[]; // e.g. ["strong_communicator", "eligible_for_rehire", "leadership_talent"]

  // System Fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastContactedAt?: Date;
  lastContactedBy?: string;

  // Relations (populated via joins)
  skills?: CandidateSkill[];
  workExperience?: WorkExperience[];
  education?: Education[];
  documents?: CandidateDocument[];
  notes?: CandidateNote[];
  applications?: Application[];
  consentRecords?: ConsentRecord[];
  outreachLogs?: OutreachLog[];
}

// ─── ADD CANDIDATE FORM DATA (Multi-Step) ──────────────────────

export interface BasicInfo {
  firstName: string; // required
  lastName: string; // required
  email: string; // required, unique
  phone?: string;
  whatsapp?: string;

  // Profile
  profilePhoto?: File | string; // File for upload, string for URL after parsing
  linkedInUrl?: string;
  portfolioUrl?: string;

  // Location
  country: string; // required
  city?: string;
  timezone?: string;
  willingToRelocate?: boolean;

  // Source (how they entered the system)
  source: CandidateSource; // required
  sourceDetail?: string; // e.g. "LinkedIn Nov 2025 campaign"
}

export interface CurrentRoleInfo {
  // Current Position
  currentJobTitle?: string;
  currentCompany?: string;
  currentSalary?: number;
  currentSalaryCurrency?: string; // e.g. "USD", "LKR"

  // Availability
  availabilityStatus:
    | "immediately"
    | "2_weeks"
    | "1_month"
    | "3_months"
    | "not_available"; // required
  earliestStartDate?: Date | string;
  noticePeriodDays?: number;

  // Overall Status
  status: CandidateStatus; // active | passive | etc.
}

export interface SkillEntry {
  skillName: string; // required
  proficiency: SkillProficiency; // beginner | intermediate | advanced | expert
  yearsOfExperience?: number;
}

export interface SkillsInfo {
  skills: SkillEntry[]; // at least 1 recommended
}

export interface WorkExperienceEntry {
  companyName: string; // required
  jobTitle: string; // required
  startDate: Date | string; // required
  endDate?: Date | string; // null if current
  isCurrent: boolean;
  location?: string;
  description?: string;
}

export interface WorkExperienceInfo {
  workExperience: WorkExperienceEntry[]; // repeatable section
}

export interface EducationEntry {
  institution: string; // required
  degree: string; // required, e.g. "Bachelor of Science"
  fieldOfStudy: string; // required, e.g. "Computer Science"
  startDate: Date | string; // required
  endDate?: Date | string;
  grade?: string;
}

export interface EducationInfo {
  education: EducationEntry[]; // repeatable section
}

export interface DocumentsInfo {
  resume?: File; // parsed on upload to auto-fill earlier fields
  coverLetter?: File;
  certifications?: File[];
  portfolioFiles?: File[];

  // Additional for onboarding readiness (Phase 2)
  idProof?: File;
  addressProof?: File;
}

export interface ConsentAndTagsInfo {
  internalNotes: string;
  // GDPR Consent
  gdprConsent: boolean; // required checkbox
  gdprConsentDate: Date | string; // auto-set to now on submit

  // Recruiter-added tags
  tags: string[]; // e.g. ["strong_communicator", "eligible_for_rehire"]

  // Internal notes (optional, recruiter-only)
  initialNote?: string;

  // Data retention
  dataRetentionExpiry?: Date | string; // auto-calculated if not set
}

export interface AddCandidateFormData {
  id?: string;
  step1: BasicInfo;
  step2: CurrentRoleInfo;
  step3: SkillsInfo;
  step4: WorkExperienceInfo;
  step5: EducationInfo;
  step6: DocumentsInfo;
  step7: ConsentAndTagsInfo;
}
