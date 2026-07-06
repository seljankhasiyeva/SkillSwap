import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { register } from "@/lib/auth-store";
import type { Role } from "@/lib/mock-data";
import { GitBranch, Sparkles, Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

const searchSchema = z.object({
  role: z.enum(["learner", "mentor", "company"]).optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign up — SkillSwap" },
      { name: "description", content: "Create a learner, mentor, or company account on SkillSwap." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const search = useSearch({ from: "/signup" });
  const initial: Role = (search.role as Role) ?? "learner";
  const [role, setRole] = useState<Role>(initial);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">
          <Logo size="md" />
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? Sign in
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="label-mono mb-2">Create account</div>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Join SkillSwap</h1>

          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 h-auto p-1">
              <TabsTrigger value="learner" className="flex flex-col gap-1 py-2.5">
                <GitBranch className="size-4" />
                <span>Learner</span>
              </TabsTrigger>
              <TabsTrigger value="mentor" className="flex flex-col gap-1 py-2.5">
                <Sparkles className="size-4" />
                <span>Mentor</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex flex-col gap-1 py-2.5">
                <Building2 className="size-4" />
                <span>Company</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learner">
              <LearnerForm />
            </TabsContent>
            <TabsContent value="mentor">
              <MentorForm />
            </TabsContent>
            <TabsContent value="company">
              <CompanyForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function FormShell({
  children,
  onSubmit,
  cta,
  error,
  loading,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  cta: string;
  error?: string | null;
  loading?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="border rounded-lg p-6 bg-surface space-y-5">
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : cta}
      </Button>
    </form>
  );
}

function LearnerForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <FormShell
      cta="Create learner account"
      error={error}
      loading={loading}
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const data = new FormData(e.currentTarget);
        try {
          await register({
            fullName: String(data.get("name")),
            email: String(data.get("email")),
            password: String(data.get("password")),
            role: "Learner",
            skills: String(data.get("skills") || ""),
            githubUrl: String(data.get("github") || ""),
          });
          navigate({ to: "/learner" });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field id="name" label="Full name" />
        <Field id="email" label="Email" type="email" />
      </div>
      <Field id="password" label="Password" type="password" />
      <Field id="skills" label="Skills (comma-separated)" placeholder="Go, Postgres, Distributed Systems" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field id="level" label="Experience level" />
        <Field id="goal" label="Career goal" />
      </div>
      <Field id="github" label="GitHub URL" placeholder="https://github.com/yourname" />
    </FormShell>
  );
}

function MentorForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <FormShell
      cta="Create mentor account"
      error={error}
      loading={loading}
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const data = new FormData(e.currentTarget);
        try {
          await register({
            fullName: String(data.get("name")),
            email: String(data.get("email")),
            password: String(data.get("password")),
            role: "Mentor",
            organization: String(data.get("org") || ""),
            expertise: String(data.get("expertise") || ""),
            bio: String(data.get("bio") || ""),
          });
          navigate({ to: "/mentor" });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field id="name" label="Full name" />
        <Field id="email" label="Email" type="email" />
      </div>
      <Field id="password" label="Password" type="password" />
      <Field id="org" label="Current / past organization" />
      <Field id="expertise" label="Areas of expertise" />
      <div>
        <Label htmlFor="bio" className="mb-1.5 block text-sm">Mentor bio</Label>
        <Textarea id="bio" name="bio" rows={3} />
      </div>
    </FormShell>
  );
}

function CompanyForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <FormShell
      cta="Create company account"
      error={error}
      loading={loading}
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const data = new FormData(e.currentTarget);
        try {
          await register({
            fullName: String(data.get("company")),
            email: String(data.get("email")),
            password: String(data.get("password")),
            role: "Company",
            companyName: String(data.get("company") || ""),
            companySize: String(data.get("size") || ""),
            industry: String(data.get("industry") || ""),
            hiringRoles: String(data.get("hiring") || ""),
          });
          navigate({ to: "/company" });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Registration failed.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field id="company" label="Company name" />
        <Field id="email" label="Work email" type="email" />
      </div>
      <Field id="password" label="Password" type="password" />
      <div className="grid md:grid-cols-2 gap-4">
        <Field id="size" label="Company size" />
        <Field id="industry" label="Industry" />
      </div>
      <Field id="hiring" label="Roles you're hiring for" />
    </FormShell>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm">{label}</Label>
      <Input id={id} name={id} type={type} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  );
}