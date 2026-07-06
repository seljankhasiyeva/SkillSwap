import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-store";
import { fetchMe, fetchMySubmissions } from "@/lib/api";
import { GitBranch, Share2 } from "lucide-react";

export const Route = createFileRoute("/learner/profile")({
  head: () => ({
    meta: [
      { title: "Proof-of-Work Profile — SkillSwap" },
      { name: "description", content: "Your public proof-of-work profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const session = useSession();
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    fetchMe().then(setUser).catch(console.error);
    fetchMySubmissions().then(setSubmissions).catch(console.error);
  }, []);

  const initials = session?.name?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <AppLayout
      breadcrumb={
        <>
          Learner <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Proof-of-Work</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <header className="border rounded-lg p-6 bg-surface flex flex-wrap items-start gap-6">
          <div className="size-20 rounded-full bg-muted grid place-items-center text-2xl font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{session?.name ?? "—"}</h1>
            </div>
            <p className="text-muted-foreground">{user?.expertise || user?.skills || "—"}</p>
            {user?.githubUrl && (
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                <a href={user.githubUrl} className="flex items-center gap-1 hover:text-foreground" target="_blank" rel="noreferrer">
                  <GitBranch className="size-3.5" /> {user.githubUrl}
                </a>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tabular-nums">{user?.xpPoints ?? 0}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">XP Points</div>
            <Button size="sm" variant="outline" className="mt-3">
              <Share2 className="size-3.5" /> Share profile
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Stat label="Submissions" value={submissions.length} />
          <Stat label="Verified" value={submissions.filter((s) => s.status === "Approved").length} />
          <Stat label="Role" value={session?.role ?? "—"} />
        </section>

        <section>
          <div className="label-mono mb-3">Completed Proof-of-Work</div>
          <div className="border rounded-lg overflow-hidden bg-surface">
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No submissions yet.</div>
            ) : (
              submissions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{s.challengeTitle || "Challenge"}</div>
                  </div>
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
                  <div className="text-right shrink-0">
                    <div className="font-bold tabular-nums">{s.score ?? "—"}/100</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-5 bg-surface">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      <div className="text-xl font-bold tabular-nums">{value}</div>
    </div>
  );
}