import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChallengeCard } from "@/components/challenge-card";
import { fetchChallenges } from "@/lib/api";
import { ArrowUpRight, CheckCircle2, GitBranch, Sparkles, Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo, LogoMark } from "@/components/logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkillSwap — Prove your skills, get hired" },
      { name: "description", content: "Challenge-based skill validation. Real projects, AI-evaluated, surfaced to companies that hire on proof — not resumes." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    fetchChallenges().then((all) => setFeatured(all.slice(0, 3))).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#challenges" className="hover:text-foreground">Challenges</a>
            <a href="#roles" className="hover:text-foreground">For mentors & companies</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link to="/signup">Get started</Link></Button>
          </div>
        </div>
      </header>

      <section className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest mb-5">
            <span className="size-1.5 rounded-full bg-success mr-2 animate-pulse" />
            Proof of work, not resumes
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance mb-6">
            Prove what you can build.
            <br />
            <span className="text-muted-foreground">Get found by companies that hire on evidence.</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Start with a free challenge <ArrowUpRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#challenges">Browse the marketplace</a>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> AI evaluation with mentor sign-off</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Verified skill badges</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Direct hiring pipeline</span>
          </div>
        </div>
      </section>

      <section id="how" className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="label-mono mb-3">How it works</div>
          <h2 className="text-3xl font-bold tracking-tight mb-10">One pipeline. From challenge to verified hire.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Pick a challenge", body: "Real briefs from mentors and companies. Filter by category, difficulty, and price." },
              { step: "02", title: "Submit proof", body: "Ship a GitHub repo. AI grades against a rubric and mentors sign off on verification." },
              { step: "03", title: "Get discovered", body: "Verified skills update your public proof-of-work profile — searchable by hiring companies." },
            ].map((s) => (
              <div key={s.step} className="border rounded-lg p-6 bg-surface">
                <div className="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">STEP {s.step}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="challenges" className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="label-mono mb-3">Challenge marketplace</div>
              <h2 className="text-3xl font-bold tracking-tight">Live briefs from the field.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/learner/challenges">Browse all <ArrowUpRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((c) => <ChallengeCard key={c.id} c={c} />)}
          </div>
        </div>
      </section>

      <section id="roles">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-5">
          {[
            { icon: GitBranch, role: "For learners", title: "Build a portfolio that recruiters trust.", cta: "Join as a learner", search: { role: "learner" as const } },
            { icon: Sparkles, role: "For mentors", title: "Author challenges. AI drafts; you sign off.", cta: "Become a mentor", search: { role: "mentor" as const } },
            { icon: Building2, role: "For companies", title: "Hire on evidence. Try before you sign.", cta: "Hire on SkillSwap", search: { role: "company" as const } },
          ].map((card) => (
            <div key={card.role} className="border rounded-lg p-6 bg-surface flex flex-col">
              <card.icon className="size-5 text-muted-foreground mb-4" />
              <div className="label-mono mb-2">{card.role}</div>
              <h3 className="text-lg font-semibold mb-6 text-balance">{card.title}</h3>
              <Button asChild className="mt-auto w-fit cursor-pointer" variant="outline">
                <Link to="/signup" search={card.search}>{card.cta} <ArrowUpRight className="size-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span>SkillSwap · proof of work, not resumes</span>
          </div>
          <div className="font-mono text-[10px] tracking-wider uppercase">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}