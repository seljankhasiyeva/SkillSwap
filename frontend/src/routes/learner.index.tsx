import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { SectionLabel, StatCard } from "@/components/ui-bits";
import { ChallengeCard } from "@/components/challenge-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-store";
import { fetchChallenges, fetchMySubmissions } from "@/lib/api";
import { ArrowUpRight, GitBranch, CheckCircle2, Eye } from "lucide-react";

export const Route = createFileRoute("/learner/")({
  head: () => ({
    meta: [
      { title: "Learner Dashboard — SkillSwap" },
      { name: "description", content: "Your proof-of-work dashboard: talent score, skill progress, and recommended challenges." },
    ],
  }),
  component: LearnerDashboard,
});

function LearnerDashboard() {
  const session = useSession();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges().then(setChallenges).catch(console.error);
    fetchMySubmissions().then(setSubmissions).catch(console.error);
  }, []);

  const recommended = challenges.slice(0, 3);

  return (
    <AppLayout
      breadcrumb={
        <>
          Learner <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Dashboard</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <div className="label-mono mb-2">Overview</div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {session?.name ?? "there"}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Three companies viewed your proof-of-work this week.
          </p>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Submissions" value={submissions.length} hint="Total submitted" />
          <StatCard
            label="Verified"
            value={submissions.filter((s) => s.status === "Approved").length}
            hint="Verified submissions"
          />
          <StatCard
            label="Pending"
            value={submissions.filter((s) => s.status === "Pending").length}
            hint="Awaiting review"
          />
          <StatCard label="Challenges" value={challenges.length} hint="Available challenges" />
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <SectionLabel>Recommended Challenges</SectionLabel>
              <Button asChild variant="ghost" size="sm" className="font-mono text-[10px] tracking-wider">
                <Link to="/learner/challenges">VIEW_ALL <ArrowUpRight className="size-3.5" /></Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recommended.map((c) => (
                <ChallengeCard key={c.id} c={c} />
              ))}
            </div>

            <div className="pt-4">
              <SectionLabel>Recent Submissions</SectionLabel>
              <div className="border rounded-lg overflow-hidden bg-surface">
                {submissions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No submissions yet.
                  </div>
                ) : (
                  submissions.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 p-4 border-b last:border-0">
                      <CheckCircle2
                        className={`size-4 shrink-0 ${
                          s.status === "Approved" ? "text-success" : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{s.challengeTitle || "Challenge"}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(s.submittedAt).toLocaleDateString()} · {s.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums">{s.score ?? "—"}/100</div>
                        <div className="font-mono text-[10px] text-muted-foreground tracking-wider">SCORE</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-lg p-5 bg-primary text-primary-foreground">
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary-foreground/60 mb-4">
                System Logs
              </div>
              <ul className="space-y-3 font-mono text-[11px]">
                <li className="flex gap-3">
                  <span className="text-success">[PASS]</span>
                  <span className="opacity-80">14/14 unit tests on "Load Balancer"</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-info">[SYNC]</span>
                  <span className="opacity-80">GitHub commit 8f2a1b validated</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-warning">[VIEW]</span>
                  <span className="opacity-80">Stripe viewed your profile</span>
                </li>
              </ul>
              <div className="mt-5 flex items-center gap-2 text-xs">
                <Eye className="size-3.5" />
                <Link to="/learner/profile" className="hover:underline">
                  View public profile
                </Link>
              </div>
            </div>

            <div className="border rounded-lg p-5 bg-surface">
              <SectionLabel>Hiring Activity</SectionLabel>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <GitBranch className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Stripe</div>
                    <div className="text-[11px] text-muted-foreground">Reviewed your ledger submission</div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">2h</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <GitBranch className="size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Linear</div>
                    <div className="text-[11px] text-muted-foreground">Shortlisted you</div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">1d</Badge>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}