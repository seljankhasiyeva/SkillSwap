import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, GitBranch } from "lucide-react";
import { useSession } from "@/lib/auth-store";
import { fetchMySubmissions } from "@/lib/api";

export const Route = createFileRoute("/learner/submissions")({
  head: () => ({
    meta: [
      { title: "My Submissions — SkillSwap" },
      { name: "description", content: "Track AI feedback and verification status on your challenge submissions." },
    ],
  }),
  component: Submissions,
});

function Submissions() {
  const session = useSession();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySubmissions()
      .then(setSubmissions)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      breadcrumb={
        <>
          Learner <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Submissions</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Evidence trail</div>
          <h1 className="text-2xl font-bold tracking-tight">My Submissions</h1>
        </div>

        {loading ? (
          <div className="border rounded-lg p-12 text-center bg-surface">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="border rounded-lg p-12 text-center bg-surface">
            <p className="text-muted-foreground">You haven't submitted any challenges yet.</p>
            <Button asChild className="mt-4 cursor-pointer">
              <Link to="/learner/challenges">Browse challenges</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s.id} className="border rounded-lg p-5 bg-surface">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-semibold mt-1">{s.challengeTitle || "Challenge"}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        s.status === "Approved"
                          ? "bg-success/10 text-success-foreground border-success/30 font-mono text-[10px]"
                          : "font-mono text-[10px]"
                      }
                    >
                      {s.status}
                    </Badge>
                    {s.score !== null && (
                      <div className="text-right">
                        <div className="text-xl font-bold tabular-nums">
                          {s.score}
                          <span className="text-sm text-muted-foreground">/100</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {s.feedback && (
                  <div className="rounded-md bg-muted p-4 text-sm leading-relaxed">
                    <div className="flex items-center gap-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="size-3" /> Feedback
                    </div>
                    {s.feedback}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span>{new Date(s.submittedAt).toLocaleDateString()}</span>
                  {s.githubUrl && (
                    <Button asChild variant="ghost" size="sm" className="cursor-pointer">
                      <a href={s.githubUrl} target="_blank" rel="noreferrer">
                        <GitBranch className="size-3.5" /> View repo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}