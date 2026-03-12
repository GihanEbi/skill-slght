export type UUID = string;
export type Timestamp = string;

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export enum FileType {
  PDF = "PDF",
  ZIP = "ZIP",
  Video = "VIDEO",
  Image = "IMAGE",
}

export enum UploadStatus {
  Uploaded = "UPLOADED",
  Embedded = "EMBEDDED",
}

export enum SkillSource {
  CvExtraction = "CV_EXTRACTION",
  InterviewUpdate = "INTERVIEW_UPDATE",
  Manual = "MANUAL",
}

export enum SkillCategory {
  Technical = "TECHNICAL",
  Soft = "SOFT",
  Domain = "DOMAIN",
  Tool = "TOOL",
  Certification = "CERTIFICATION",
}

export interface Skill {
  id: UUID;
  name: string;
  description: string | null;
  category: SkillCategory;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface FileStorage {
  id: UUID;
  file_type: FileType;
  upload_status: UploadStatus;
  file_url: string;
  /** Duration in seconds — populated for VIDEO files only */
  duration_sec: number | null;
  /** File size in bytes */
  file_size: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}
