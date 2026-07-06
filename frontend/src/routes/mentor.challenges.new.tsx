import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createChallenge } from "@/lib/challenges-store";
import { useSession } from "@/lib/auth-store";
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from "@/lib/mock-data";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

export const Route = createFileRoute("/mentor/challenges/new")({
  head: () => ({
    meta: [
      { title: "New Challenge — SkillSwap" },
      { name: "description", content: "Create a new challenge for SkillSwap learners." },
    ],
  }),
  component: NewChallenge,
});

function NewChallenge() {
  const navigate = useNavigate();
  const session = useSession();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Software Engineering");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tags, setTags] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [price, setPrice] = useState(0);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill using AI simulation
  const handleAiDraft = () => {
    setTitle("Two-Phase Commit Across Postgres Shards");
    setCategory("Software Engineering");
    setDifficulty("Advanced");
    setDescription("Ship a Go service coordinating 2PC across two Postgres instances. Demonstrate correct behavior under coordinator crash mid-prepare and document recovery semantics.");
    setRequirements("Use Go 1.21+ with no third-party broker libraries\nPersist to local disk with WAL semantics\nExpose a gRPC API for publish/subscribe\nProvide benchmark script demonstrating throughput");
    setTags("Go, Postgres, gRPC, Distributed Systems");
    setEstimatedHours(12);
    setPrice(8);
    toast.success("AI Draft generated! Review the fields below.");
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!requirements.trim()) newErrors.requirements = "Requirements are required.";
    if (!tags.trim()) newErrors.tags = "Tags are required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const parsedReqs = requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      await createChallenge({
        title: title.trim(),
        summary: description.slice(0, 100) + "...",
        description: description.trim(),
        category,
        difficulty,
        price,
        estimatedHours,
        rewardPoints: estimatedHours * 3,
        requirements: parsedReqs,
        deliverables: ["GitHub Repository URL", "Design Document / Readme"],
        technologies: parsedTags,
        outcomes: ["Practical application of " + category, "Experience with " + parsedTags.slice(0, 2).join(", ")],
        evaluation: ["Correctness & Specs (40%)", "Code quality & tests (30%)", "Documentation (20%)", "Efficiency (10%)"],
        mentorName: session?.name || "",
        mentorOrg: "",
      });

      toast.success("Challenge published successfully!");
      navigate({ to: "/mentor/challenges" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to publish challenge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={
        <>
          Mentor <span className="mx-2">/</span>
          <span className="text-foreground font-medium">New Challenge</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/mentor/challenges" })}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="label-mono mb-1">Authoring</div>
            <h1 className="text-2xl font-bold tracking-tight">Create Challenge</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Form */}
          <form onSubmit={handlePublish} className="md:col-span-2 space-y-5 border rounded-lg p-6 bg-surface">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-1.5 block text-sm">
                  Challenge Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Architect a Distributed Key-Value Store"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="mb-1.5 block text-sm">
                    Category *
                  </Label>
                  <select
                    id="category"
                    className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="difficulty" className="mb-1.5 block text-sm">
                    Difficulty *
                  </Label>
                  <select
                    id="difficulty"
                    className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-1.5 block text-sm">
                  Description / Brief *
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Explain the background, scenario, and goals of this challenge..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="requirements" className="mb-1.5 block text-sm">
                  Requirements * (One requirement per line)
                </Label>
                <Textarea
                  id="requirements"
                  rows={4}
                  placeholder="e.g. Use Go 1.21&#10;Write comprehensive tests&#10;Zero external library dependencies"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className={errors.requirements ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.requirements && <p className="text-xs text-destructive mt-1">{errors.requirements}</p>}
              </div>

              <div>
                <Label htmlFor="tags" className="mb-1.5 block text-sm">
                  Tags / Technologies * (Comma separated)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g. Go, Postgres, Docker, Distributed Systems"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={errors.tags ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.tags && <p className="text-xs text-destructive mt-1">{errors.tags}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours" className="mb-1.5 block text-sm">
                    Est. Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min={1}
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 8)}
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="mb-1.5 block text-sm">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                <Save className="size-4" /> {isSubmitting ? "Publishing..." : "Publish Challenge"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/mentor/challenges" })}>
                Cancel
              </Button>
            </div>
          </form>

          {/* AI Helper Sidebar */}
          <div className="space-y-4">
            <div className="border rounded-lg p-5 bg-surface space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-4 animate-pulse" />
                <h3 className="font-semibold text-sm">Need Inspiration?</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Click below to generate an AI-drafted template for a "Two-Phase Commit Across Postgres" challenge. You can then edit it before publishing.
              </p>
              <Button type="button" variant="outline" className="w-full text-xs" onClick={handleAiDraft}>
                Load AI Template Draft
              </Button>
            </div>

            <div className="border rounded-lg p-5 bg-surface text-xs space-y-2 text-muted-foreground">
              <div className="font-semibold text-foreground">Tips for Mentors</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Clearly specify deliverables so learners know what to submit.</li>
                <li>Set an appropriate difficulty for the scope of the requirements.</li>
                <li>Add tags to help learners filter for your challenge in the marketplace.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}