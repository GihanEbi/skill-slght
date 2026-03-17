import {
  primarySkills,
  candidateStatuses,
} from "@/constants/candidate_constants";

/**
 * Returns the list of primary skills.
 */
export function getPrimarySkills() {
  return [...primarySkills];
}

/**
 * Returns the list of candidate statuses.
 */
export function getCandidateStatuses() {
  return [...candidateStatuses];
}

/**
 * Returns all candidates from local storage
 */
export function getAllCandidates() {
  const rawData = typeof window !== "undefined" ? localStorage.getItem("all-candidates") : null;
  if (!rawData) return [];
  try {
    const storedCandidates = JSON.parse(rawData);
    if (!Array.isArray(storedCandidates)) return [];
    
    return storedCandidates.map((item: any) => ({
      id: item.id || `CAND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: `${item.step1?.firstName || item.firstName || ""} ${item.step1?.lastName || item.lastName || ""}`.trim(),
      email: item.step1?.email || item.email || "",
      jobTitle: item.step2?.currentRole || item.current_role || item.jobTitle || "",
      avatar: item.profilePhotoUrl || item.step1?.profilePhotoUrl || item.step1?.profilePhoto || "avatar-1.jpg",
      status: item.step2?.status || item.status || "Active",
      skills: item.step3?.skills || item.skills || [],
      // Keep full original item as well just in case
      raw: item
    }));
  } catch (e) {
    console.error("Storage Retrieval Error", e);
    return [];
  }
}

