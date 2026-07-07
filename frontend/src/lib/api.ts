import { getToken } from "./auth-store";
import { API_BASE } from "./config";

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Challenges
export async function fetchChallenges(params?: {
  category?: string;
  difficulty?: string;
  priceFilter?: string;
  mine?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.difficulty) query.set("difficulty", params.difficulty);
  if (params?.priceFilter) query.set("priceFilter", params.priceFilter);
  if (params?.mine) query.set("mine", "true");

  const res = await fetch(`${API_BASE}/Challenges?${query}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch challenges.");
  return res.json();
}

export async function fetchChallengeById(id: string) {
  const res = await fetch(`${API_BASE}/Challenges/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Challenge not found.");
  return res.json();
}

// Submissions
export async function fetchMySubmissions() {
  const res = await fetch(`${API_BASE}/Submissions/my`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch submissions.");
  return res.json();
}

// Mentor-only: all submissions across every challenge, newest first.
export async function fetchAllSubmissions() {
  const res = await fetch(`${API_BASE}/Submissions`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch submissions.");
  return res.json();
}

// Mentor-only: a single submission with challenge + learner context.
export async function fetchSubmissionById(id: string) {
  const res = await fetch(`${API_BASE}/Submissions/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Submission not found.");
  return res.json();
}

export async function createSubmission(data: {
  challengeId: string;
  githubUrl: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE}/Submissions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create submission.");
  return res.json();
}

// User
export async function fetchMe() {
  const res = await fetch(`${API_BASE}/Users/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user.");
  return res.json();
}

export async function updateProfile(data: {
  fullName?: string;
  bio?: string;
  skills?: string;
  githubUrl?: string;
  experienceLevel?: string;
  careerGoal?: string;
}) {
  const res = await fetch(`${API_BASE}/Users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile.");
  return res.json();
}