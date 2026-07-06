import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Input } from "@/components/ui/input";
import { CATEGORIES, type Category } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/company/talent")({
  head: () => ({
    meta: [
      { title: "Verified Talent — SkillSwap" },
      { name: "description", content: "Search the verified talent pool by skill and Talent Score." },
    ],
  }),
  component: Talent,
});

function Talent() {
  const [q, setQ] = useState("");

  return (
    <AppLayout breadcrumb={<>Company <span className="mx-2">/</span><span className="text-foreground font-medium">Verified Talent</span></>}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Talent Pool</div>
          <h1 className="text-2xl font-bold tracking-tight">Verified Candidates</h1>
        </div>

        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input placeholder="Search by name or skill…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>

        <div className="border rounded-lg p-12 text-center bg-surface text-sm text-muted-foreground">
          Talent pool search will be available once learners complete and verify challenges.
        </div>
      </div>
    </AppLayout>
  );
}