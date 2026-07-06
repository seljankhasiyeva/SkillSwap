import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { StatCard, SectionLabel } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-store";
import { fetchChallenges } from "@/lib/api";
import { ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/company/")({
  head: () => ({
    meta: [
      { title: "Company Dashboard — SkillSwap" },
      { name: "description", content: "Hire on evidence. Browse verified talent, open challenges, and your hiring pipeline." },
    ],
  }),
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const session = useSession();
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges().then(setChallenges).catch(console.error);
  }, []);

  const companyChallenges = challenges.filter((c) => c.isCompanyChallenge);

  return (
    <AppLayout breadcrumb={<>Company <span className="mx-2">/</span><span className="text-foreground font-medium">Dashboard</span></>}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="label-mono mb-2">Overview</div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {session?.name ?? "Company"}.
            </h1>
          </div>
          <Button asChild><Link to="/company/challenges/new"><Plus className="size-4" /> Post a challenge</Link></Button>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Open Challenges" value={companyChallenges.length} hint="Active hiring challenges" />
          <StatCard label="Total Challenges" value={challenges.length} hint="All challenges" />
          <StatCard label="Company" value={session?.name ?? "—"} hint="Your organization" />
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>Your Open Challenges</SectionLabel>
              <Button asChild variant="ghost" size="sm" className="font-mono text-[10px] tracking-wider">
                <Link to="/company/challenges">MANAGE_ALL <ArrowUpRight className="size-3.5" /></Link>
              </Button>
            </div>
            <div className="border rounded-lg bg-surface overflow-hidden">
              {companyChallenges.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No challenges yet. Post your first hiring challenge.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left">
                    <tr>
                      <th className="px-5 py-3 label-mono">Title</th>
                      <th className="px-5 py-3 label-mono text-right">Submissions</th>
                      <th className="px-5 py-3 label-mono text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyChallenges.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-muted/40">
                        <td className="px-5 py-3">
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-muted-foreground">{c.category} · {c.difficulty}</div>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">{c.completedCount}</td>
                        <td className="px-5 py-3 text-right">
                          <Badge variant="outline" className="font-mono text-[10px]">{c.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <aside>
            <SectionLabel>Quick Actions</SectionLabel>
            <div className="space-y-3 mt-3">
              <Button asChild className="w-full" variant="outline">
                <Link to="/company/challenges/new">Post a new challenge</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/company/talent">Browse talent pool</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/company/pipeline">View pipeline</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}