import { useEffect, useState } from "react";
import type { Role } from "./mock-data";
import { API_BASE } from "./config";

const SESSION_KEY = "skillswap.session.v1";
const TOKEN_KEY = "skillswap.token.v1";

export interface Session {
  role: Role;
  name: string;
  email: string;
}

function read(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function write(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("skillswap-session"));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function writeToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// Real API register
export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  role: string;
  companyName?: string;
  bio?: string;
  skills?: string;
  githubUrl?: string;
  organization?: string;
  expertise?: string;
  companySize?: string;
  industry?: string;
  hiringRoles?: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE}/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Registration failed.");
  }

  const result = await response.json();

  writeToken(result.token);
  write({
    role: result.role.toLowerCase() as Role,
    name: result.fullName,
    email: result.email,
  });
}

// Real API login
export async function login(email: string, password: string): Promise<Session> {
  const response = await fetch(`${API_BASE}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  const result = await response.json();

  writeToken(result.token);
  const session: Session = {
    role: result.role.toLowerCase() as Role,
    name: result.fullName,
    email: result.email,
  };
  write(session);
  return session;
}

// Keep signIn for backward compatibility (mock fallback)
export function signIn(s: Session) {
  write(s);
}

export function signOut() {
  write(null);
  writeToken(null);
}

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    setSession(read());
    const handler = () => setSession(read());
    window.addEventListener("skillswap-session", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("skillswap-session", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return session;
}