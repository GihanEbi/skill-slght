import { Timestamp, UUID } from "./common_types";
import { ChatUserType, InterviewType } from "./job_types";

export interface CandidateJob {
  id: UUID;
  job_id: UUID;
  candidate_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export enum CandidateJobStatus {
  Active = "ACTIVE",
  Draft = "DRAFT",
  Urgent = "URGENT",
  Paused = "PAUSED",
  Closed = "CLOSED",
}

export interface CandidateJobStatusHistory {
  id: UUID;
  candidate_jobs_id: UUID;
  status: CandidateJobStatus;
  remark: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface CandidateJobInterview {
  id: UUID;
  candidate_job_id: UUID;
  interview_type: InterviewType;
  remarks: string | null;
  /** Array of ISO datetime strings offered by the candidate */
  candidate_available_times: Timestamp[];
  schedule_time: Timestamp | null;
  /** FK → FileStorage (recorded video) */
  interview_video_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface HiringManagerCandidateJobInterview {
  id: UUID;
  candidate_job_interview_id: UUID;
  hiring_manager_id: UUID;
  /** Array of ISO datetime strings offered by the hiring manager */
  available_times: Timestamp[];
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface AiInterviewChat {
  id: UUID;
  candidate_job_id: UUID;
  user_type: ChatUserType;
  message: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}

export interface AiMatchingCandidateJob {
  id: UUID;
  job_id: UUID;
  candidate_id: UUID;
  /** 0.00 – 100.00 */
  match_score: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: UUID;
  updated_by: UUID;
}
