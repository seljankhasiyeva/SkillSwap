import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchChallenges } from "@/lib/api";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/company/challenges")({
  head: () => ({ meta: [{ title: "Company Challenges — SkillSwap" }, { name: "description", content: "Manage your hiring challenges." }] }),
  component: CompanyChallenges,
});

function CompanyChallenges() {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges().then((all) => {
      setChallenges(all.filter((c: any) => c.isCompanyChallenge));
    }).catch(console.error);
  }, []);

  return (
    <AppLayout breadcrumb={<>Company <span className="mx-2">/</span><span className="text-foreground font-medium">Open Challenges</span></>}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="label-mono mb-2">Hiring funnel</div>
            <h1 className="text-2xl font-bold tracking-tight">Open Challenges</h1>
          </div>
          <Button asChild><Link to="/company/challenges/new"><Plus className="size-4" /> New challenge</Link></Button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {challenges.length === 0 ? (
            <div className="col-span-2 border rounded-lg p-12 text-center bg-surface text-muted-foreground">
              No company challenges yet.
            </div>
          ) : (
            challenges.map((c) => (
              <div key={c.id} className="border rounded-lg p-5 bg-surface">
                <Badge variant="outline" className="font-mono text-[10px] mb-2">{c.category}</Badge>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.summary}</div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                  <span>{c.completedCount} submissions</span>
                  <Button size="sm" variant="outline">Review submissions</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}