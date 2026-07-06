import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchSubmissionById } from "@/lib/api";
import { reviewSubmission, type Submission } from "@/lib/submissions-store";
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, XCircle, FileText, Github, ExternalLink, Clock } from "lucide-react";

export const Route = createFileRoute("/mentor/submissions/$id")({
  head: () => ({
    meta: [
      { title: "Review Submission — SkillSwap" },
      { name: "description", content: "Review learner submission and provide mentor feedback." },
    ],
  }),
  component: ReviewSubmission,
});

function ReviewSubmission() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissionById(id)
      .then(setSubmission)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const [overallRating, setOverallRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [revisionTitle, setRevisionTitle] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [revisionDeadline, setRevisionDeadline] = useState("");
  const [revisionPriority, setRevisionPriority] = useState<"low" | "medium" | "high">("medium");

  if (loading) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground">Loading...</div>
      </AppLayout>
    );
  }

  if (!submission) {
    return (
      <AppLayout breadcrumb={<>Mentor <span className="mx-2">/</span><span className="text-foreground">Review Submission</span></>}>
        <div className="p-12 text-center">
          <h1 className="text-xl font-semibold">Submission not found</h1>
          <p className="text-muted-foreground mt-2">The requested submission could not be loaded.</p>
          <Button asChild variant="outline" className="mt-4">
            <button onClick={() => navigate({ to: "/mentor/submissions" })}>Back to Submissions</button>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleVerify = async () => {
    setIsSubmitting(true);
    try {
      await reviewSubmission(
        id,
        "Approved",
        feedback || "Submission verified by mentor.",
        overallRating * 10
      );
      toast.success("Submission verified successfully!");
      navigate({ to: "/mentor/submissions" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to verify submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!revisionTitle.trim() || !revisionMessage.trim()) {
      toast.error("Please fill in revision title and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewSubmission(
        id,
        "RevisionRequested",
        `Revision Request: ${revisionTitle}\n\n${revisionMessage}${revisionDeadline ? `\n\nDeadline: ${revisionDeadline}` : ""}${revisionPriority ? `\nPriority: ${revisionPriority}` : ""}`,
        overallRating * 10
      );
      toast.success("Revision request sent successfully!");
      setShowRevisionModal(false);
      navigate({ to: "/mentor/submissions" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to request revision.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await reviewSubmission(
        id,
        "Failed",
        feedback || "Submission rejected by mentor. Please review and resubmit.",
        0
      );
      toast.success("Submission rejected.");
      navigate({ to: "/mentor/submissions" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to reject submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      breadcrumb={
        <>
          Mentor <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Review Submission</span>
        </>
      }
    >
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/mentor/submissions" })}>
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="label-mono mb-1">Review</div>
            <h1 className="text-2xl font-bold tracking-tight">Submission Review</h1>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-surface space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{submission.challengeTitle}</h2>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span>{submission.learnerEmail}</span>
                <span>·</span>
                <span>{submission.challengeCategory}</span>
                <span>·</span>
                <Badge variant="outline" className="font-mono text-[10px]">{submission.challengeDifficulty}</Badge>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">{submission.status}</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-surface space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="size-4" />
            Submitted Work
          </h3>
          {submission.githubUrl && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
              <Github className="size-4" />
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {submission.githubUrl}
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}
          {submission.notes && (
            <div className="p-3 rounded-md bg-muted text-sm">
              <Label className="text-xs font-semibold mb-1 block">Notes</Label>
              <p className="text-muted-foreground">{submission.notes}</p>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6 bg-surface space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="size-4" />
            AI Evaluation
          </h3>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold">{submission.score ?? "—"}</div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
          <div className="rounded-md bg-muted p-4 text-sm">
            {submission.feedback || "No AI feedback yet."}
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-surface space-y-4">
          <h3 className="font-semibold">Mentor Review</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating" className="mb-1.5 block text-sm">
                Overall Rating (1-10)
              </Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={10}
                value={overallRating}
                onChange={(e) => setOverallRating(parseInt(e.target.value) || 5)}
                className="w-24"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="feedback" className="mb-1.5 block text-sm">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              rows={4}
              placeholder="Provide detailed feedback to the learner..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setShowVerifyModal(true)} className="flex-1">
            <CheckCircle2 className="size-4 mr-2" />
            Verify Submission
          </Button>
          <Button onClick={() => setShowRevisionModal(true)} variant="outline" className="flex-1">
            <AlertCircle className="size-4 mr-2" />
            Request Revision
          </Button>
          <Button onClick={() => setShowRejectModal(true)} variant="destructive" className="flex-1">
            <XCircle className="size-4 mr-2" />
            Reject Submission
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/mentor/submissions" })}>
            Back
          </Button>
        </div>
      </div>

      <Dialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
            <DialogDescription>
              Request specific changes from the learner before final verification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="revision-title" className="mb-1.5 block text-sm">
                Revision Title *
              </Label>
              <Input
                id="revision-title"
                placeholder="e.g. Add error handling for edge cases"
                value={revisionTitle}
                onChange={(e) => setRevisionTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="revision-message" className="mb-1.5 block text-sm">
                Revision Message *
              </Label>
              <Textarea
                id="revision-message"
                rows={4}
                placeholder="Describe the changes needed..."
                value={revisionMessage}
                onChange={(e) => setRevisionMessage(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revision-deadline" className="mb-1.5 block text-sm">
                  Deadline (optional)
                </Label>
                <Input
                  id="revision-deadline"
                  type="date"
                  value={revisionDeadline}
                  onChange={(e) => setRevisionDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="revision-priority" className="mb-1.5 block text-sm">
                  Priority
                </Label>
                <select
                  id="revision-priority"
                  className="flex h-9 w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={revisionPriority}
                  onChange={(e) => setRevisionPriority(e.target.value as "low" | "medium" | "high")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevisionModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestRevision} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Revision Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the submission as verified and the learner will receive credit. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerify} disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the submission and the learner will need to resubmit. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}