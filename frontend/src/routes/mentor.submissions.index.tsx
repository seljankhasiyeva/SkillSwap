import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAllSubmissions } from "@/lib/api";
import { formatSubmittedAt, type Submission } from "@/lib/submissions-store";
import { Sparkles, Eye } from "lucide-react";

export const Route = createFileRoute("/mentor/submissions/")({
  head: () => ({ meta: [{ title: "Submissions — SkillSwap" }, { name: "description", content: "Review learner submissions and AI evaluations." }] }),
  component: MentorSubmissionsIndex,
});

function MentorSubmissionsIndex() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSubmissions()
      .then(setSubmissions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout breadcrumb={<>Mentor <span className="mx-2">/</span><span className="text-foreground font-medium">Submissions</span></>}>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Review queue</div>
          <h1 className="text-2xl font-bold tracking-tight">Learner Submissions</h1>
        </div>

        {loading ? (
          <div className="border rounded-lg p-12 text-center bg-surface text-sm text-muted-foreground">
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="border rounded-lg p-12 text-center bg-surface text-sm text-muted-foreground">
            No submissions to review yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s.id} className="border rounded-lg p-5 bg-surface">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">{s.learnerEmail} · {s.challengeTitle}</div>
                    <div className="text-xs text-muted-foreground">{formatSubmittedAt(s.submittedAt)}</div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">{s.status}</Badge>
                </div>
                <div className="rounded-md bg-muted p-4 text-sm">
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="size-3" /> Feedback · Score {s.score ?? "—"}/100
                  </div>
                  {s.feedback || "No feedback yet."}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" asChild>
                    <Link to="/mentor/submissions/$id" params={{ id: s.id }}><Eye className="size-4 mr-2" />Review</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}