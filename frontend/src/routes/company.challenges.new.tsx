import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/company/challenges/new")({
  head: () => ({ meta: [{ title: "Post a Challenge — SkillSwap" }, { name: "description", content: "Create a hiring challenge to surface verified talent." }] }),
  component: NewCompanyChallenge,
});

function NewCompanyChallenge() {
  const navigate = useNavigate();
  return (
    <AppLayout breadcrumb={<>Company <span className="mx-2">/</span><span className="text-foreground font-medium">New Challenge</span></>}>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div>
          <div className="label-mono mb-2">Hire on evidence</div>
          <h1 className="text-2xl font-bold tracking-tight">Post a Hiring Challenge</h1>
          <p className="text-sm text-muted-foreground mt-2">Learners who complete this challenge become visible to your team.</p>
        </div>

        <form
          className="border rounded-lg p-6 bg-surface space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/company/challenges" });
          }}
        >
          <Field id="title" label="Title" defaultValue="Optimize our payments ledger" />
          <div>
            <Label htmlFor="desc" className="mb-1.5 block text-sm">Description</Label>
            <Textarea id="desc" rows={4} defaultValue="Take our simulated ledger and ship a PR improving throughput by ≥30% without breaking invariants." />
          </div>
          <div>
            <Label htmlFor="deliverables" className="mb-1.5 block text-sm">Deliverables</Label>
            <Textarea id="deliverables" rows={3} defaultValue="Pull request, benchmark before/after, design note" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field id="skills" label="Required skills" defaultValue="Rust, Performance, Distributed Systems" />
            <Field id="difficulty" label="Difficulty" defaultValue="Advanced" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field id="evaluation" label="Evaluation criteria" defaultValue="Throughput delta, correctness, code review quality" />
            <Field id="reward" label="Reward" defaultValue="Fast-track interview + $500" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Publish challenge</Button>
            <Button type="button" variant="outline">Save draft</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

function Field({ id, label, defaultValue }: { id: string; label: string; defaultValue?: string }) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm">{label}</Label>
      <Input id={id} name={id} defaultValue={defaultValue} />
    </div>
  );
}
