import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth-store";
import type { Role } from "@/lib/mock-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SkillSwap" },
      { name: "description", content: "Sign in to your SkillSwap account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("learner");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">
          <Logo size="md" />
          <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">
            Need an account? Sign up
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="label-mono mb-2">Sign in</div>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Welcome back</h1>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {(["learner", "mentor", "company"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer capitalize",
                  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  role === r
                    ? "bg-background text-foreground shadow border"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <form
            className="border rounded-lg p-6 bg-surface space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              const data = new FormData(e.currentTarget);
              const email = String(data.get("email"));
              const password = String(data.get("password"));
              try {
                await login(email, password);
                navigate({
                  to: role === "company" ? "/company" : role === "mentor" ? "/mentor" : "/learner",
                });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Login failed.");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <Label htmlFor="email" className="mb-1.5 block text-sm">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 block text-sm">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Signing in..." : `Sign in as ${role}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}