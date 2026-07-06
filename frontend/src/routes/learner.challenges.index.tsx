import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/app-layout";
import { ChallengeCard } from "@/components/challenge-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from "@/lib/mock-data";
import { fetchChallenges } from "@/lib/api";
import { Search } from "lucide-react";

export const Route = createFileRoute("/learner/challenges/")({
  head: () => ({
    meta: [
      { title: "Challenge Marketplace — SkillSwap" },
      { name: "description", content: "Browse real-world challenges by category, difficulty, and price." },
    ],
  }),
  component: ChallengeMarketplace,
});

function ChallengeMarketplace() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const [diff, setDiff] = useState<Difficulty | "All">("All");
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Paid">("All");

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (cat !== "All" && c.category !== cat) return false;
      if (diff !== "All" && c.difficulty !== diff) return false;
      if (priceFilter === "Free" && c.price !== 0) return false;
      if (priceFilter === "Paid" && c.price === 0) return false;
      if (q && !(c.title + " " + c.summary).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [challenges, q, cat, diff, priceFilter]);

  return (
    <AppLayout
      breadcrumb={
        <>
          Learner <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Challenges</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Marketplace</div>
          <h1 className="text-2xl font-bold tracking-tight">Find your next proof-of-work.</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search challenges…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterChip label="All" active={cat === "All"} onClick={() => setCat("All")} />
            {CATEGORIES.map((c) => (
              <FilterChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-1">Difficulty</span>
            <FilterChip label="All" active={diff === "All"} onClick={() => setDiff("All")} small />
            {DIFFICULTIES.map((d) => (
              <FilterChip key={d} label={d} active={diff === d} onClick={() => setDiff(d)} small />
            ))}
            <span className="label-mono mx-2">Price</span>
            {(["All", "Free", "Paid"] as const).map((p) => (
              <FilterChip key={p} label={p} active={priceFilter === p} onClick={() => setPriceFilter(p)} small />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-mono text-[11px] tracking-wider uppercase">
            {loading ? "Loading..." : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          </span>
          <Badge variant="outline" className="font-mono text-[10px]">Sort: Recommended</Badge>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="border rounded-lg p-12 text-center bg-surface">
            <p className="text-muted-foreground">No challenges match those filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQ("");
                setCat("All");
                setDiff("All");
                setPriceFilter("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  small,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border transition-colors cursor-pointer ${
        small ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
      } ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-surface text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}