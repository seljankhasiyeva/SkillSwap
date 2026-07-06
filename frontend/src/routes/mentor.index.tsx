import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { SectionLabel, StatCard } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-store";
import { fetchChallenges } from "@/lib/api";
import { Sparkles, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/mentor/")({
  head: () => ({
    meta: [
      { title: "Mentor Dashboard — SkillSwap" },
      { name: "description", content: "Author challenges, review learner submissions, and track challenge performance." },
    ],
  }),
  component: MentorDashboard,
});

function MentorDashboard() {
  const session = useSession();
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges().then(setChallenges).catch(console.error);
  }, []);

  const mine = challenges.slice(0, 4);

  return (
    <AppLayout breadcrumb={<>Mentor <span className="mx-2">/</span><span className="text-foreground font-medium">Dashboard</span></>}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="label-mono mb-2">Overview</div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {session?.name ?? "Mentor"}.
            </h1>
          </div>
          <Button asChild>
            <Link to="/mentor/challenges/new"><Sparkles className="size-4" /> New Challenge</Link>
          </Button>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Challenges" value={challenges.length} hint="All challenges" />
          <StatCard label="Active" value={challenges.filter((c) => c.status === "Active").length} hint="Currently active" />
          <StatCard label="Draft" value={challenges.filter((c) => c.status === "Draft").length} hint="Not published yet" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Your Challenges</SectionLabel>
            <Button asChild variant="ghost" size="sm" className="font-mono text-[10px] tracking-wider">
              <Link to="/mentor/challenges">MANAGE_ALL <ArrowUpRight className="size-3.5" /></Link>
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-surface">
            {mine.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No challenges yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="px-5 py-3 label-mono">Title</th>
                    <th className="px-5 py-3 label-mono hidden md:table-cell">Category</th>
                    <th className="px-5 py-3 label-mono text-right">Learners</th>
                    <th className="px-5 py-3 label-mono text-right hidden sm:table-cell">Price</th>
                    <th className="px-5 py-3 label-mono text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.difficulty}</div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">{c.category}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{c.completedCount}</td>
                      <td className="px-5 py-3 text-right tabular-nums hidden sm:table-cell">
                        {c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}