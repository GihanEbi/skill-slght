import { Job, JobStatus } from "@/types/types";

export const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    department: "Design",
    location: "SF, CA",
    postedAt: "2d ago",
    status: JobStatus.ACTIVE,
    candidateCount: 24,
    icon: "architecture",
    featuredCandidates: [
      {
        id: "c1",
        name: "Alex Johnson",
        avatarUrl: "https://i.pravatar.cc/150?u=c1",
      },
      {
        id: "c2",
        name: "Maria Garcia",
        avatarUrl: "https://i.pravatar.cc/150?u=c2",
      },
    ],
  },
  {
    id: "2",
    title: "Lead Backend Engineer",
    department: "Engineering",
    location: "Remote",
    postedAt: "5d ago",
    status: JobStatus.ACTIVE,
    candidateCount: 12,
    icon: "code",
    featuredCandidates: [
      {
        id: "c3",
        name: "Sam Smith",
        avatarUrl: "https://i.pravatar.cc/150?u=c3",
      },
      {
        id: "c4",
        name: "Jordan Lee",
        avatarUrl: "https://i.pravatar.cc/150?u=c4",
      },
    ],
  },
  {
    id: "3",
    title: "Marketing Growth Lead",
    department: "Marketing",
    location: "London",
    postedAt: "1d ago",
    status: JobStatus.URGENT,
    candidateCount: 8,
    icon: "bolt",
    featuredCandidates: [
      {
        id: "c5",
        name: "Chris Evans",
        avatarUrl: "https://i.pravatar.cc/150?u=c5",
      },
    ],
  },
  {
    id: "4",
    title: "Staff Frontend Engineer",
    department: "Engineering",
    location: "NY, USA",
    postedAt: "3d ago",
    status: JobStatus.ACTIVE,
    candidateCount: 42,
    icon: "terminal",
    featuredCandidates: [
      {
        id: "c6",
        name: "Lisa Ray",
        avatarUrl: "https://i.pravatar.cc/150?u=c6",
      },
      {
        id: "c7",
        name: "Dave Wood",
        avatarUrl: "https://i.pravatar.cc/150?u=c7",
      },
      {
        id: "c8",
        name: "Sarah Wu",
        avatarUrl: "https://i.pravatar.cc/150?u=c8",
      },
    ],
  },
  {
    id: "5",
    title: "HR Business Partner",
    department: "Operations",
    location: "Paris, FR",
    postedAt: "1w ago",
    status: JobStatus.ACTIVE,
    candidateCount: 15,
    icon: "groups",
    featuredCandidates: [
      {
        id: "c9",
        name: "Jean Doe",
        avatarUrl: "https://i.pravatar.cc/150?u=c9",
      },
    ],
  },
  {
    id: "6",
    title: "Data Scientist",
    department: "Data",
    location: "Berlin, DE",
    postedAt: "2w ago",
    status: JobStatus.CLOSED,
    candidateCount: 94,
    icon: "insights",
    featuredCandidates: [
      {
        id: "c10",
        name: "Hans Müller",
        avatarUrl: "https://i.pravatar.cc/150?u=c10",
      },
    ],
  },
];
