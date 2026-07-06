import { useEffect, useState, useCallback } from "react";
import { getToken } from "./auth-store";
import { API_BASE as BASE } from "./config";

const API_BASE = `${BASE}/Challenges`;

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Arrays (requirements/deliverables/technologies/outcomes/evaluation) are
// stored as newline-joined text on the backend — join/split at the edges.
function joinLines(items?: string[]): string {
  return (items ?? []).filter(Boolean).join("\n");
}

export async function createChallenge(input: any): Promise<any> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title: input.title,
      summary: input.summary || input.description || "",
      description: input.description || "",
      requirements: joinLines(input.requirements),
      deliverables: joinLines(input.deliverables),
      technologies: joinLines(input.technologies),
      outcomes: joinLines(input.outcomes),
      evaluation: joinLines(input.evaluation),
      category: input.category,
      difficulty: input.difficulty,
      price: input.price ?? 0,
      estimatedTime: input.estimatedHours ?? 0,
      rewardPoints: input.rewardPoints ?? 0,
      isCompanyChallenge: input.isCompanyChallenge ?? false,
      companyName: input.companyName || "",
      mentorName: input.mentorName || "",
      mentorOrg: input.mentorOrg || "",
      status: "Active",
    }),
  });

  if (!response.ok) throw new Error("Failed to create challenge.");
  return response.json();
}

export async function updateChallenge(id: string, input: any): Promise<any> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      id,
      title: input.title,
      summary: input.summary || input.description || "",
      description: input.description || "",
      requirements: joinLines(input.requirements),
      deliverables: joinLines(input.deliverables),
      technologies: joinLines(input.technologies),
      outcomes: joinLines(input.outcomes),
      evaluation: joinLines(input.evaluation),
      category: input.category,
      difficulty: input.difficulty,
      price: input.price ?? 0,
      estimatedTime: input.estimatedHours ?? 0,
      rewardPoints: input.rewardPoints ?? 0,
      isCompanyChallenge: input.isCompanyChallenge ?? false,
      companyName: input.companyName || "",
      mentorName: input.mentorName || "",
      mentorOrg: input.mentorOrg || "",
      status: input.status || "Active",
    }),
  });

  if (!response.ok) throw new Error("Failed to update challenge.");
  return response.json();
}

export function useChallenges(mine = false) {
  const [challenges, setChallenges] = useState<any[]>([]);

  const refresh = useCallback(() => {
    const query = mine ? "?mine=true" : "";
    fetch(`${API_BASE}${query}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setChallenges)
      .catch(console.error);
  }, [mine]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { challenges, refresh };
}