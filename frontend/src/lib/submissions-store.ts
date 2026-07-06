import { getToken } from "./auth-store";
import { API_BASE as BASE } from "./config";

const API_BASE = `${BASE}/Submissions`;

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Matches SkillSwap.Domain.Enums.SubmissionStatus on the backend exactly.
export type SubmissionStatus =
  | "Pending"
  | "UnderReview"
  | "Completed"
  | "Failed"
  | "RevisionRequested"
  | "Approved";

export interface Submission {
  id: string;
  challengeId: string;
  learnerId: string;
  challengeTitle?: string;
  challengeCategory?: string;
  challengeDifficulty?: string;
  learnerName?: string;
  learnerEmail?: string;
  submittedAt: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string;
  githubUrl?: string;
  notes?: string;
}

export function formatSubmittedAt(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// A submission counts as "verified" once a mentor has approved it.
export function isApproved(status: string): boolean {
  return status === "Approved";
}

export async function reviewSubmission(
  id: string,
  status: SubmissionStatus,
  feedback: string,
  score: number
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ submissionId: id, status, score, feedback }),
  });

  if (!response.ok) throw new Error("Failed to review submission.");
  return response.json();
}