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
