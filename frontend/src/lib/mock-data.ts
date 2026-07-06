// Shared domain types & static constants for SkillSwap.
// NOTE: this file used to also hold hard-coded mock data (CHALLENGES,
// SUBMISSIONS, BADGES, TALENT_POOL, LEARNER_STATS, MENTOR_STATS,
// COMPANY_STATS, getChallenge). All of that has been removed — every
// screen now reads real data from the API (see lib/api.ts,
// lib/challenges-store.ts, lib/submissions-store.ts). Only the static
// UI vocabulary (roles/categories/difficulties) lives here now.

export type Role = "learner" | "mentor" | "company";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Category =
  | "Software Engineering"
  | "Data Science"
  | "AI / Machine Learning"
  | "Product Management"
  | "UI/UX Design"
  | "Cybersecurity"
  | "Cloud Engineering";

export const CATEGORIES: Category[] = [
  "Software Engineering",
  "Data Science",
  "AI / Machine Learning",
  "Product Management",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Engineering",
];

export const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

// Shape returned by GET /api/Challenges and /api/Challenges/{id}.
export interface Challenge {
  id: string;
  title: string;
  summary: string;
  description?: string | null;
  requirements?: string;
  deliverables?: string;
  technologies?: string;
  outcomes?: string;
  evaluation?: string;
  category: string;
  difficulty: string;
  price: number;
  estimatedTime: number;
  rewardPoints: number;
  completedCount: number;
  isCompanyChallenge?: boolean;
  companyName?: string | null;
  mentorName?: string | null;
  mentorOrg?: string | null;
  status?: string;
  createdByUserId?: string;
}