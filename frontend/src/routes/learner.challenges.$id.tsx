import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { diffStyle } from "@/lib/difficulty-styles";
import { useSession } from "@/lib/auth-store";
import { fetchChallengeById, createSubmission, fetchMySubmissions } from "@/lib/api";
import { Clock, Users, ArrowLeft, CheckCircle2, GitBranch, Send } from "lucide-react";

export const Route = createFileRoute("/learner/challenges/$id")({
  component: ChallengeDetail,
});

function ChallengeDetail() {
  const { id } = Route.useParams();
  const session = useSession();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const submitRef = useRef<HTMLDivElement>(null);

  const scrollToSubmit = () => {
    submitRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChallengeById(id)
      .then(setChallenge)
      .catch(() => toast.error("Challenge not found."))
      .finally(() => setLoading(false));

    fetchMySubmissions()
      .then((subs) => {
        const existing = subs.find((s: any) => s.challengeId === id);
        if (existing) setExistingSubmission(existing);
      })
      .catch(console.error);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!githubUrl.trim() || !githubUrl.includes("github.com")) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    if (!session) {
      toast.error("Please sign in to submit a solution.");
      return;
    }

    setSubmitting(true);
    try {
      await createSubmission({
        challengeId: id,
        githubUrl: githubUrl.trim(),
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
      toast.success("Submission received! AI evaluation is queued.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground">Loading...</div>
      </AppLayout>
    );
  }

  if (!challenge) {
    return (
      <AppLayout>
        <div className="p-12 text-center">
          <h1 className="text-xl font-semibold">Challenge not found</h1>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/learner/challenges">Back to marketplace</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      breadcrumb={
        <Link to="/learner/challenges" className="flex items-center gap-1.5 hover:text-foreground">
          <ArrowLeft className="size-3.5" /> All challenges
        </Link>
      }
    >
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
            {challenge.category}
          </Badge>
          <Badge
            className={`font-mono text-[10px] uppercase tracking-wider border ${diffStyle(challenge.difficulty)}`}
            variant="outline"
          >
            {challenge.difficulty}
          </Badge>
          {challenge.isCompanyChallenge && (
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-foreground/30">
              Hiring · {challenge.companyName}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-balance">{challenge.title}</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-3xl text-pretty">{challenge.summary}</p>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description & Overview */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {challenge.description || challenge.summary}
              </div>
            </div>

            {/* Technologies Used */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Technologies & Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(challenge.technologies?.split("\n") || []).map((t: string) => (
                  <Badge key={t} variant="secondary" className="font-mono text-xs">
                    {t.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Requirements</h2>
              <ul className="list-dash pl-4 space-y-1 text-sm text-muted-foreground leading-relaxed">
                {(challenge.requirements?.split("\n") || ["Deliver high quality code."]).map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">Deliverables</h2>
              <ul className="list-dash pl-4 space-y-1 text-sm text-muted-foreground leading-relaxed">
                {(challenge.deliverables?.split("\n") || ["GitHub Repository URL", "Design Document / Readme"]).map((d: string) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>

            {/* Outcomes */}
            {challenge.outcomes && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold tracking-tight">What You'll Learn & Achieve</h2>
                <ul className="list-dash pl-4 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {(challenge.outcomes.split("\n")).map((o: string) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Evaluation Criteria */}
            {challenge.evaluation && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold tracking-tight">Evaluation Criteria</h2>
                <ul className="list-dash pl-4 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {(challenge.evaluation.split("\n")).map((e: string) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <section id="submit-section" ref={submitRef} className="border rounded-lg p-6 bg-surface space-y-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Submit Solution
              </div>
              {existingSubmission || submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-success/15 grid place-items-center">
                      <CheckCircle2 className="size-4 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">Submission received</div>
                      <div className="text-xs text-muted-foreground">
                        AI evaluation usually completes in 1–3 minutes.
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/learner/submissions">View in My Submissions</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="github" className="mb-1.5 block text-sm">
                      GitHub repository URL
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/you/project"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="mb-1.5 block text-sm">
                      Notes for the reviewer (optional)
                    </Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      placeholder="Anything the AI / mentor should know…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {!session && (
                    <p className="text-sm text-muted-foreground">
                      <Link to="/login" className="underline hover:text-foreground">Sign in</Link>{" "}
                      to submit your solution.
                    </p>
                  )}
                  <Button type="submit" className="w-full cursor-pointer" disabled={submitting || !session}>
                    <Send className="size-4" />
                    {submitting ? "Submitting…" : "Submit Solution"}
                  </Button>
                </form>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <div className="border rounded-lg p-5 bg-surface space-y-4 sticky top-20">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold tabular-nums">
                  {challenge.price === 0 ? "Free" : `$${challenge.price.toFixed(2)}`}
                </div>
                <div className="font-mono text-[10px] tracking-wider text-muted-foreground">
                  +{challenge.rewardPoints} PTS
                </div>
              </div>

              <Button onClick={scrollToSubmit} className="w-full cursor-pointer animate-pulse-subtle" size="lg">
                {challenge.price === 0 ? "Start challenge" : "Unlock & start"}
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="size-3" /> Estimated
                  </div>
                  <div className="text-sm font-semibold">~{challenge.estimatedTime}h</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                    <Users className="size-3" /> Completed
                  </div>
                  <div className="text-sm font-semibold">{challenge.completedCount}</div>
                </div>
              </div>

              {challenge.mentorName && (
                <div className="pt-3 border-t">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Authored by
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-muted grid place-items-center text-xs font-semibold">
                      {challenge.mentorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{challenge.mentorName}</div>
                      <div className="text-[11px] text-muted-foreground">{challenge.mentorOrg}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-muted/40 flex items-start gap-3 text-xs text-muted-foreground">
              <GitBranch className="size-4 mt-0.5 shrink-0" />
              <span>Submit via GitHub. AI grades against the rubric and the mentor signs off on verification.</span>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}