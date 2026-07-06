import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";

export const Route = createFileRoute("/learner/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — SkillSwap" },
      { name: "description", content: "Global talent leaderboard ranked by Talent Score." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <AppLayout
      breadcrumb={
        <>
          Learner <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Leaderboard</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Global standing</div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        </div>
        <div className="border rounded-lg p-12 text-center bg-surface text-sm text-muted-foreground">
          Leaderboard coming soon — rankings will be based on verified challenge completions and XP points.
        </div>
      </div>
    </AppLayout>
  );
}