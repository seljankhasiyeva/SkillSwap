import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-store";
import { fetchMe, fetchMySubmissions, updateProfile } from "@/lib/api";
import { GitBranch, Share2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMe().then(setUser).catch(console.error);
    fetchMySubmissions().then(setSubmissions).catch(console.error);
  }, []);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const data = new FormData(e.currentTarget);
    try {
      const updated = await updateProfile({
        fullName: String(data.get("fullName")),
        bio: String(data.get("bio")),
        skills: String(data.get("skills")),
        githubUrl: String(data.get("githubUrl")),
        experienceLevel: String(data.get("experienceLevel")),
        careerGoal: String(data.get("careerGoal")),
      });
      setUser(updated);
      toast.success("Profile updated successfully!");
      setOpenEdit(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = session?.name?.slice(0, 2).toUpperCase() ?? "??";
  const githubUsername = user?.githubUrl ? user.githubUrl.replace(/\/$/, "").split("/").pop() : null;
  const avatarUrl = githubUsername && user?.githubUrl?.includes("github.com")
    ? `https://github.com/${githubUsername}.png`
    : null;

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
          <div className="size-20 rounded-full bg-muted overflow-hidden grid place-items-center text-2xl font-bold shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={session?.name} className="size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{user?.fullName || session?.name || "—"}</h1>
              
              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 rounded-full cursor-pointer hover:bg-muted">
                    <Edit2 className="size-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information. Clicking save will update your public proof-of-work.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSaveProfile} className="space-y-4 py-4">
                    <div className="space-y-1">
                      <Label htmlFor="edit-name">Full Name</Label>
                      <Input id="edit-name" name="fullName" defaultValue={user?.fullName || ""} required />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-bio">Bio</Label>
                      <Textarea id="edit-bio" name="bio" rows={3} defaultValue={user?.bio || ""} placeholder="Tell us about yourself..." />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
                      <Input id="edit-skills" name="skills" defaultValue={user?.skills || ""} placeholder="e.g. React, Go, Docker" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-github">GitHub Profile URL</Label>
                      <Input id="edit-github" name="githubUrl" defaultValue={user?.githubUrl || ""} placeholder="https://github.com/username" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-level">Experience Level</Label>
                      <Input id="edit-level" name="experienceLevel" defaultValue={user?.experienceLevel || ""} placeholder="e.g. Junior, Mid-Level, Senior" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-goal">Career Goal</Label>
                      <Input id="edit-goal" name="careerGoal" defaultValue={user?.careerGoal || ""} placeholder="e.g. Senior Backend Engineer" />
                    </div>
                    <DialogFooter className="pt-2">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl whitespace-pre-wrap">
              {user?.bio || "No bio set yet. Click the edit icon to add one!"}
            </p>
            
            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground pt-1">
              {user?.experienceLevel && (
                <Badge variant="secondary" className="font-sans font-normal">
                  Level: {user.experienceLevel}
                </Badge>
              )}
              {user?.careerGoal && (
                <Badge variant="secondary" className="font-sans font-normal">
                  Goal: {user.careerGoal}
                </Badge>
              )}
            </div>

            {user?.githubUrl && (
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                <a href={user.githubUrl} className="flex items-center gap-1 hover:text-foreground" target="_blank" rel="noreferrer">
                  <GitBranch className="size-3.5" /> {user.githubUrl}
                </a>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold tabular-nums">{user?.xpPoints ?? 0}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">XP Points</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Profile link copied to clipboard!");
              }}
            >
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