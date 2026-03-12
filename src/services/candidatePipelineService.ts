import { UUID, Timestamp, SkillSource } from "../types/common_types";
import {
  Candidate,
  CandidateStatus,
  CandidateSource,
  AvailabilityStatus,
} from "../types/candidate_types";
import { ProficiencyLevel, JobStatus } from "../types/job_types";
import { CandidateJobStatus } from "../types/candidate_job_types";
import { JobDraft, getActiveJobs, saveJobAsDraft } from "./jobService";

const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 600));

// ==========================================
// Jobs Wrapper
// ==========================================

export const fetchActiveJobs = async (): Promise<
  (JobDraft & { id: UUID; stats: any })[]
> => {
  await simulateDelay();
  const jobs = getActiveJobs();
  // Map Drafts to simulated DB Active Jobs
  return jobs.map((job, i) => ({
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
};

export const deleteActiveJobs = async (jobsToRemove: any[]): Promise<void> => {
  await simulateDelay();
  const activeJobs = getActiveJobs();
  const idsToRemove = jobsToRemove.map((j) => j.title); // Simulating deletion by title for now

  const updatedJobs = activeJobs.filter((j) => !idsToRemove.includes(j.title));
  localStorage.setItem("active_jobs", JSON.stringify(updatedJobs));
};

export const closeJob = async (job: any, reason: string): Promise<void> => {
  await simulateDelay();
  const activeJobs = getActiveJobs();
  const updatedJobs = activeJobs.map((j) => {
    if (j.title === job.title) {
      return { ...j, status: JobStatus.Closed };
    }
    return j;
  });
  localStorage.setItem("active_jobs", JSON.stringify(updatedJobs));
};

// ==========================================
// Candidates Mock Data
// ==========================================

let mockCandidates: Candidate[] = [
  {
    id: "CAND-001",
    first_name: "Marcus",
    last_name: "Thorne",
    email: "marcus.t@example.com",
    phone_no: "+49 151 234 5678",
    country: "Germany",
    city: "Berlin",
    status: CandidateStatus.Active,
    candidate_source: CandidateSource.LinkedIn,
    availability_status: AvailabilityStatus.Immediately,
    avatar_id: "user-preview.png",
    current_role: "Senior Software Engineer",
    current_company: "JIT",
    isUnicorn: true,
    pipeline_status: CandidateJobStatus.Active,
    pipeline_stage: "Offer Extended",
    created_at: "2024-02-12T08:30:00Z",
    updated_at: new Date().toISOString(),

    // Resume & Links
    social_links: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/marcusthorne",
      },
      {
        platform: "Website",
        url: "https://mthorne.io",
      },
      {
        platform: "GitHub",
        url: "https://github.com/mthorne-dev",
      },
    ],
    resume_file_name: "Marcus_Thorne_CV_2024.pdf",
    resume_size: "2.4 MB",

    // Profile Insights
    total_experience: "10+ Years",
    expected_salary: "$220k - $250k USD",
    languages: "English, German",

    // Core Expertise
    skills: [
      {
        category: "Languages",
        skills: ["Rust", "EVM", "Protocol", "Go", "Solidity", "Cryptography"],
      },
      {
        category: "Protocols & Tech",
        skills: ["EVM", "IPFS", "Zero Knowledge", "Multi-sig Auth", "libp2p"],
      },
      {
        category: "Frameworks",
        skills: ["Hardhat", "Foundry", "React", "Next.js", "Express"],
      },
      {
        category: "Infrastructure",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      },
    ],

    // Assessment Scores
    assessments: [
      { label: "Coding Challenge", score: 100 },
      { label: "Architecture Interview", score: 94 },
      { label: "System Design", score: 92 },
    ],

    experiences: [
      {
        id: "EXP-1",
        company_name: "Modular L2 Protocol (Open Source)",
        job_title: "Lead Core Developer",
        start_date: "2020-01-15",
        end_date: null,
        is_currently_work_here: true,
        role_contribution:
          "Architected a high-throughput consensus engine handling 10k+ TPS. Led a decentralized team of 15 contributors. Managed security audits and mainnet migration.",
        technologies: ["Go", "Solidity", "Cryptography"],
      },
      {
        id: "EXP-2",
        company_name: "Global Finance Systems",
        job_title: "Senior Software Engineer",
        start_date: "2016-04-01",
        end_date: "2019-12-31",
        is_currently_work_here: false,
        role_contribution:
          "Optimized HFT execution kernels using C++. Reduced latency by 45% through custom memory management and cache optimization.",
        technologies: ["C++", "Linux Kernel", "HFT"],
      },
      {
        id: "EXP-3",
        company_name: "TechScale Solutions",
        job_title: "Backend Engineer",
        start_date: "2013-08-01",
        end_date: "2016-03-15",
        is_currently_work_here: false,
        role_contribution:
          "Developed distributed microservices using Java and Spring Boot. Implemented CI/CD pipelines and automated testing suites.",
        technologies: ["Java", "Spring Boot", "Microservices"],
      },
    ],
  },
  {
    id: "CAND-002",
    first_name: "Sarah",
    last_name: "Chen",
    email: "sarah.c@example.com",
    phone_no: "+65 8123 4567",
    country: "Singapore",
    city: "Singapore",
    status: CandidateStatus.Active,
    candidate_source: CandidateSource.DirectApplication,
    availability_status: AvailabilityStatus.OneMonth,
    avatar_id: "ankit.png",
    current_role: "Backend Engineer",
    current_company: "Coinbase (Ex)",
    isUnicorn: false,
    pipeline_status: CandidateJobStatus.Active,
    pipeline_stage: "Interviewing",
    created_at: "2024-02-18T10:15:00Z",
    updated_at: new Date().toISOString(),

    // Resume & Links
    social_links: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/marcusthorne",
      },
      {
        platform: "Website",
        url: "https://mthorne.io",
      },
      {
        platform: "GitHub",
        url: "https://github.com/mthorne-dev",
      },
    ],

    resume_file_name: "S_Chen_Resume_Latest.pdf",
    resume_size: "1.8 MB",

    total_experience: "5 Years",
    expected_salary: "$140k - $160k USD",
    languages: "English, Mandarin",

    // Core Expertise
    skills: [
      {
        category: "Languages",
        skills: ["Rust", "EVM", "Protocol", "Go", "Solidity", "Cryptography"],
      },
      {
        category: "Protocols & Tech",
        skills: ["EVM", "IPFS", "Zero Knowledge", "Multi-sig Auth", "libp2p"],
      },
      {
        category: "Frameworks",
        skills: ["Hardhat", "Foundry", "React", "Next.js", "Express"],
      },
      {
        category: "Infrastructure",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      },
    ],

    assessments: [
      { label: "Coding Challenge", score: 88 },
      { label: "Backend Architecture", score: 95 },
    ],

    experiences: [
      {
        id: "EXP-4",
        company_name: "Coinbase",
        job_title: "Backend Engineer",
        start_date: "2021-06-01",
        end_date: "2024-01-30",
        is_currently_work_here: false,
        role_contribution:
          "Maintained highly available trading microservices. Designed scalable database schemas reducing query latency by 30%.",
        technologies: ["Node.js", "PostgreSQL", "Redis"],
      },
      {
        id: "EXP-5",
        company_name: "FinTech Startups Inc.",
        job_title: "Junior Developer",
        start_date: "2019-02-01",
        end_date: "2021-05-31",
        is_currently_work_here: false,
        role_contribution:
          "Built RESTful APIs and integrated third-party payment gateways for early-stage fintech applications.",
        technologies: ["TypeScript", "Express", "MongoDB"],
      },
    ],
  },
  {
    id: "CAND-003",
    first_name: "Elena",
    last_name: "Volkov",
    email: "elena.v@example.com",
    phone_no: "+44 7911 123456",
    country: "United Kingdom",
    city: "London",
    status: CandidateStatus.Active,
    candidate_source: CandidateSource.Agency,
    availability_status: AvailabilityStatus.TwoWeeks,
    avatar_id: "gihan.jpeg",
    current_role: "ZKP Researcher",
    current_company: "Privacy Labs",
    isUnicorn: false,
    pipeline_status: CandidateJobStatus.Active,
    pipeline_stage: "Screening",
    created_at: "2024-02-20T09:00:00Z",
    updated_at: new Date().toISOString(),

    resume_file_name: "Elena_Volkov_Academic_CV.pdf",
    resume_size: "3.1 MB",

    total_experience: "4 Years",
    expected_salary: "£120k - £140k GBP",
    languages: "English, Russian",

    // Resume & Links
    social_links: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/marcusthorne",
      },
      {
        platform: "Website",
        url: "https://mthorne.io",
      },
      {
        platform: "GitHub",
        url: "https://github.com/mthorne-dev",
      },
    ],

    // Core Expertise
    skills: [
      {
        category: "Languages",
        skills: ["Rust", "EVM", "Protocol", "Go", "Solidity", "Cryptography"],
      },
      {
        category: "Protocols & Tech",
        skills: ["EVM", "IPFS", "Zero Knowledge", "Multi-sig Auth", "libp2p"],
      },
      {
        category: "Frameworks",
        skills: ["Hardhat", "Foundry", "React", "Next.js", "Express"],
      },
      {
        category: "Infrastructure",
        skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
      },
    ],

    assessments: [
      { label: "Cryptography Quiz", score: 98 },
      { label: "Algorithms", score: 91 },
    ],

    experiences: [
      {
        id: "EXP-6",
        company_name: "Privacy Labs",
        job_title: "ZKP Researcher",
        start_date: "2022-09-01",
        end_date: null,
        is_currently_work_here: true,
        role_contribution:
          "Researching and implementing novel zk-SNARK circuits for privacy-preserving transactions.",
        technologies: ["C++", "Circom", "Python"],
      },
    ],
  },
];

let mockAiMatches: any[] = [
  {
    id: "AI-001",
    candidate_id: "CAND-901",
    first_name: "Julian",
    last_name: "Voss",
    score: 96,
    strength: "Cryptography / Zero-Knowledge",
    bio: "Lead author on several ZK-Rollup implementations. PhD in Applied Math.",
    avatar: "avatar-2.jpg",
    skills: ["Math", "Privacy"],
  },
  {
    id: "AI-002",
    candidate_id: "CAND-902",
    first_name: "Lina",
    last_name: "Wert",
    score: 94,
    strength: "Full-Stack Web3 / Go",
    bio: "Built scalable indexing protocols. Strong focus on decentralized data availability.",
    avatar: "avatar-4.jpg",
    skills: ["Go", "Indexing"],
  },
];

// ==========================================
// Candidate CRUD
// ==========================================

export const fetchJobCandidates = async (jobId: string | null) => {
  await simulateDelay();
  return [...mockCandidates];
};

export const fetchAiMatchesForJob = async (jobId: string | null) => {
  await simulateDelay();
  return [...mockAiMatches];
};

export const fetchCandidateDetails = async (candidateId: string) => {
  await simulateDelay();
  return mockCandidates.find((c) => c.id === candidateId) || mockCandidates[0];
};

export const addCandidateToPipeline = async (aiMatch: any) => {
  await simulateDelay();
  // Remove from AI matches
  mockAiMatches = mockAiMatches.filter((m) => m.id !== aiMatch.id);

  // Add to pipeline
  const newCandidate: Candidate = {
    id: aiMatch.candidate_id,
    first_name: aiMatch.first_name,
    last_name: aiMatch.last_name,
    email: `${aiMatch.first_name.toLowerCase()}@example.com`,
    phone_no: "+1 555-123-4567",
    country: "United States",
    city: "San Francisco",
    status: CandidateStatus.Active,
    candidate_source: CandidateSource.Other,
    availability_status: AvailabilityStatus.NotAvailable,
    avatar_id: aiMatch.avatar || "default-avatar.png",
    current_role: aiMatch.strength || "Software Engineer",
    current_company: "Tech Startups Inc.",
    isUnicorn: false,
    pipeline_status: CandidateJobStatus.Active,
    pipeline_stage: "Reviewing",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

    // Resume & Links
    social_links: [
      {
        platform: "LinkedIn",
        url: `https://linkedin.com/in/${aiMatch.first_name.toLowerCase()}${aiMatch.last_name.toLowerCase()}`,
      },
      {
        platform: "GitHub",
        url: `https://github.com/${aiMatch.first_name.toLowerCase()}-${aiMatch.last_name.toLowerCase()}`,
      }
    ],
    resume_file_name: `${aiMatch.first_name}_${aiMatch.last_name}_CV.pdf`,
    resume_size: "1.2 MB",

    // Profile Insights
    total_experience: "5+ Years",
    expected_salary: "$120k - $150k USD",
    languages: "English, Spanish",

    // Core Expertise
    skills: aiMatch.skills 
      ? [{ category: "General", skills: aiMatch.skills }] 
      : [{ category: "General", skills: ["JavaScript", "React", "Node.js"] }],

    // Assessment Scores
    assessments: [
      { label: "Technical Screen", score: 85 },
      { label: "Cultural Fit", score: 92 }
    ],

    // Experience
    experiences: [
      {
        id: `EXP-${Date.now()}`,
        company_name: "Tech Startups Inc.",
        job_title: aiMatch.strength || "Software Engineer",
        start_date: "2020-01-01",
        end_date: null,
        is_currently_work_here: true,
        role_contribution: `Developed scalable architecture and led a team in the ${aiMatch.strength || 'engineering'} department.`,
        technologies: ["TypeScript", "React", "Node.js"]
      }
    ],
  };

  mockCandidates = [newCandidate, ...mockCandidates];
  return newCandidate;
};

export const removeCandidateFromPipeline = async (candidateId: string) => {
  await simulateDelay();
  mockCandidates = mockCandidates.filter((c) => c.id !== candidateId);
};

export const updateCandidateStage = async (
  candidateId: string,
  newStage: string,
) => {
  await simulateDelay();
  const idx = mockCandidates.findIndex((c) => c.id === candidateId);
  if (idx !== -1) {
    mockCandidates[idx].pipeline_stage = newStage;
    mockCandidates[idx].updated_at = new Date().toISOString();
  }
};
