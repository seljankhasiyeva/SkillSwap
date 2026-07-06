import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { StatCard } from "@/components/ui-bits";
import { fetchChallenges, fetchAllSubmissions } from "@/lib/api";

export const Route = createFileRoute("/mentor/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SkillSwap" }, { name: "description", content: "Challenge performance and learner outcomes." }] }),
  component: MentorAnalytics,
});

function MentorAnalytics() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchChallenges({ mine: true }),
      fetchAllSubmissions().catch(() => []), // non-mentor accounts get 403 here; treat as empty
    ])
      .then(([c, s]) => {
        setChallenges(c);
        setSubmissions(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const ownChallengeIds = new Set(challenges.map((c) => c.id));
    const ownSubmissions = submissions.filter((s) => ownChallengeIds.has(s.challengeId));

    const totalLearners = new Set(ownSubmissions.map((s) => s.learnerId)).size;
    const scored = ownSubmissions.filter((s) => typeof s.score === "number");
    const avgScore = scored.length
      ? Math.round(scored.reduce((sum, s) => sum + s.score, 0) / scored.length)
      : null;
    const approved = ownSubmissions.filter((s) => s.status === "Approved").length;
    const completionRate = ownSubmissions.length
      ? Math.round((approved / ownSubmissions.length) * 100)
      : null;

    return {
      totalLearners,
      avgScore,
      completionRate,
      publishedChallenges: challenges.length,
      activeChallenges: challenges.filter((c) => c.status === "Active").length,
    };
  }, [challenges, submissions]);

  return (
    <AppLayout breadcrumb={<>Mentor <span className="mx-2">/</span><span className="text-foreground font-medium">Analytics</span></>}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Performance</div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        </div>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Learners"
            value={loading ? "…" : stats.totalLearners}
            hint="Unique learners across your challenges"
          />
          <StatCard
            label="Completion Rate"
            value={loading ? "…" : stats.completionRate !== null ? `${stats.completionRate}%` : "—"}
            hint="Approved / total submissions"
          />
          <StatCard
            label="Avg Score"
            value={loading ? "…" : stats.avgScore ?? "—"}
            hint="Across scored submissions"
          />
          <StatCard
            label="Published Challenges"
            value={loading ? "…" : stats.publishedChallenges}
            hint={`${loading ? "…" : stats.activeChallenges} active`}
          />
        </section>
        <div className="border rounded-lg p-12 bg-surface text-center text-sm text-muted-foreground">
          Detailed time-series charts coming in the next iteration.
        </div>
      </div>
    </AppLayout>
  );
}