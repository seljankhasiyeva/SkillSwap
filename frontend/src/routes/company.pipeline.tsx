import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchAllSubmissions, fetchChallenges } from "@/lib/api";
import { GitBranch, User, ArrowRight, Calendar } from "lucide-react";
import { z } from "zod";

const STAGES = ["Submitted", "AI-Verified", "Shortlisted", "Interview", "Offer"] as const;
type Stage = (typeof STAGES)[number];

const searchSchema = z.object({
  challengeId: z.string().optional(),
});

export const Route = createFileRoute("/company/pipeline")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Hiring Pipeline — SkillSwap" },
      { name: "description", content: "Try Before Hire — move verified candidates through your pipeline." },
    ],
  }),
  component: Pipeline,
});

function Pipeline() {
  const { challengeId } = Route.useSearch();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customStages, setCustomStages] = useState<Record<string, Stage>>({});

  useEffect(() => {
    // Load custom stages from localStorage
    const saved = localStorage.getItem("skillswap.pipeline.customstages.v1");
    if (saved) {
      try {
        setCustomStages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Fetch submissions and challenges
    Promise.all([
      fetchAllSubmissions(),
      fetchChallenges()
    ]).then(([allSubs, allChallenges]) => {
      // Filter challenges for company
      const companyChalls = allChallenges.filter((c: any) => c.isCompanyChallenge);
      setChallenges(companyChalls);

      // Filter submissions belonging to company challenges
      const companyChallIds = new Set(companyChalls.map((c: any) => c.id));
      let filteredSubs = allSubs.filter((s: any) => companyChallIds.has(s.challengeId));

      // Further filter by specific challengeId if requested
      if (challengeId) {
        filteredSubs = filteredSubs.filter((s: any) => s.challengeId === challengeId);
      }

      setSubmissions(filteredSubs);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [challengeId]);

  const moveSubmission = (subId: string, newStage: Stage) => {
    const updated = { ...customStages, [subId]: newStage };
    setCustomStages(updated);
    localStorage.setItem("skillswap.pipeline.customstages.v1", JSON.stringify(updated));
  };

  // Group submissions by stage
  const getSubmissionsByStage = (stage: Stage) => {
    return submissions.filter((s) => {
      const custom = customStages[s.id];
      if (custom) return custom === stage;

      // Default stage mapping based on status
      const isVerified = s.status === "Approved" || s.status === "Completed" || (s.score !== null && s.score >= 70);
      const defaultStage: Stage = isVerified ? "AI-Verified" : "Submitted";
      return defaultStage === stage;
    });
  };

  const selectedChallenge = challenges.find(c => c.id === challengeId);

  return (
    <AppLayout breadcrumb={<>Company <span className="mx-2">/</span><span className="text-foreground font-medium">Pipeline</span></>}>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="label-mono mb-2">Try before hire</div>
            <h1 className="text-2xl font-bold tracking-tight">
              Hiring Pipeline {selectedChallenge ? `— ${selectedChallenge.title}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Candidates are scored automatically by AI. Move top performers into shortlist and interviews.
            </p>
          </div>

          {/* Challenge Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter by Challenge:</span>
            <select
              value={challengeId || ""}
              onChange={(e) => {
                const val = e.target.value;
                const route = Route as any;
                route.navigate({
                  search: val ? { challengeId: val } : {},
                });
              }}
              className="bg-surface border text-xs rounded-md p-2 max-w-xs focus:ring-1 focus:ring-primary"
            >
              <option value="">All Challenges</option>
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground border rounded-lg bg-surface">
            Loading hiring pipeline...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {STAGES.map((stage) => {
              const stageSubs = getSubmissionsByStage(stage);
              return (
                <div key={stage} className="border rounded-lg bg-surface flex flex-col min-h-[500px]">
                  {/* Column Header */}
                  <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/20">
                    <div className="font-mono text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {stage}
                    </div>
                    <Badge variant="secondary" className="font-mono text-[10px] tabular-nums">
                      {stageSubs.length}
                    </Badge>
                  </div>

                  {/* Column Cards */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                    {stageSubs.length === 0 ? (
                      <div className="text-xs text-muted-foreground/60 text-center py-12 border border-dashed rounded-lg">
                        Empty stage
                      </div>
                    ) : (
                      stageSubs.map((s) => (
                        <div
                          key={s.id}
                          className="border rounded-lg p-4 bg-background space-y-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-medium text-xs truncate" title={s.learnerEmail}>
                                {s.learnerEmail.split("@")[0]}
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                {s.challengeTitle}
                              </div>
                            </div>
                            {s.score !== null && (
                              <Badge
                                variant={s.score >= 80 ? "default" : "secondary"}
                                className="font-mono text-[10px]"
                              >
                                {s.score}/100
                              </Badge>
                            )}
                          </div>

                          {s.githubUrl && (
                            <div className="text-[10px] flex items-center gap-1 text-muted-foreground hover:text-foreground">
                              <GitBranch className="size-3 shrink-0" />
                              <a
                                href={s.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate underline"
                              >
                                View Codebase
                              </a>
                            </div>
                          )}

                          {/* Stage controls */}
                          <div className="pt-2 border-t flex flex-col gap-1.5">
                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                              Hiring Stage
                            </span>
                            <select
                              value={stage}
                              onChange={(e) => moveSubmission(s.id, e.target.value as Stage)}
                              className="w-full text-[10px] bg-muted border rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              {STAGES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}