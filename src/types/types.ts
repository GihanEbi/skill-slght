export enum JobStatus {
  ACTIVE = "Active",
  URGENT = "Urgent",
  CLOSED = "Closed",
  DRAFT = "Draft",
}

export interface Candidate {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  postedAt: string;
  status: JobStatus;
  candidateCount: number;
  featuredCandidates: Candidate[];
  icon: string;
}

export interface AIInsight {
  summary: string;
  rankingReason: string;
  topSkillFound: string;
}
