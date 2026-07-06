import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateChallenge } from "@/lib/challenges-store";
import { fetchChallengeById } from "@/lib/api";
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from "@/lib/mock-data";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/mentor/challenges/$id/edit")({
  component: EditChallenge,
});

function EditChallenge() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Software Engineering");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tags, setTags] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("Active");
  const [mentorName, setMentorName] = useState("");
  const [mentorOrg, setMentorOrg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchChallengeById(id)
      .then((c) => {
        setTitle(c.title);
        setCategory(c.category);
        setDifficulty(c.difficulty);
        setDescription(c.description || c.summary || "");
        setRequirements((c.requirements || "").split("\n").filter(Boolean).join("\n"));
        setTags((c.technologies || "").split("\n").filter(Boolean).join(", "));
        setEstimatedHours(c.estimatedTime || 8);
        setPrice(c.price || 0);
        setStatus(c.status || "Active");
        setMentorName(c.mentorName || "");
        setMentorOrg(c.mentorOrg || "");
      })
      .catch(() => toast.error("Challenge not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      const parsedReqs = requirements.split("\n").map((r) => r.trim()).filter(Boolean);

      await updateChallenge(id, {
        title: title.trim(),
        summary: description.trim(),
        description: description.trim(),
        requirements: parsedReqs,
        technologies: parsedTags,
        category,
        difficulty,
        price,
        estimatedHours,
        rewardPoints: estimatedHours * 3,
        status,
        mentorName,
        mentorOrg,
      });

      toast.success("Challenge updated successfully!");
      navigate({ to: "/mentor/challenges" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update challenge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumb={<>Mentor <span className="mx-2">/</span><span className="text-foreground font-medium">Edit Challenge</span></>}>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/mentor/challenges" })}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="label-mono mb-1">Editing</div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Challenge</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 border rounded-lg p-6 bg-surface max-w-3xl">
          <div>
            <Label htmlFor="title" className="mb-1.5 block text-sm">Challenge Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="mb-1.5 block text-sm">Category</Label>
              <select id="category"
                className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm"
                value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="difficulty" className="mb-1.5 block text-sm">Difficulty</Label>
              <select id="difficulty"
                className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm"
                value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="mb-1.5 block text-sm">Description *</Label>
            <Textarea id="description" rows={4} value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? "border-destructive" : ""} />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="requirements" className="mb-1.5 block text-sm">Requirements (One per line)</Label>
            <Textarea id="requirements" rows={4} value={requirements}
              onChange={(e) => setRequirements(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="tags" className="mb-1.5 block text-sm">Tags / Technologies (Comma separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours" className="mb-1.5 block text-sm">Est. Hours</Label>
              <Input id="hours" type="number" min={1} value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 8)} />
            </div>
            <div>
              <Label htmlFor="price" className="mb-1.5 block text-sm">Price ($)</Label>
              <Input id="price" type="number" min={0} value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="mb-1.5 block text-sm">Status</Label>
            <select id="status"
              className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm"
              value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/mentor/challenges" })}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}