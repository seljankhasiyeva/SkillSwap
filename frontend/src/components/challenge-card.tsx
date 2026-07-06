import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowUpRight } from "lucide-react";
import type { Challenge } from "@/lib/mock-data";
import { diffStyle } from "@/lib/difficulty-styles";

export function ChallengeCard({ c }: { c: Challenge }) {
  return (
    <div className="group bg-surface border rounded-lg p-5 hover:border-foreground/40 transition-colors flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
            {c.category}
          </Badge>
          <Badge className={`font-mono text-[10px] uppercase tracking-wider border ${diffStyle(c.difficulty)}`} variant="outline">
            {c.difficulty}
          </Badge>
          {c.isCompanyChallenge && (
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-foreground/30 text-foreground">
              Hiring · {c.companyName}
            </Badge>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold tabular-nums">{c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}</div>
          <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
            +{c.rewardPoints} PTS
          </div>
        </div>
      </div>

      <h3 className="text-base font-semibold leading-tight mb-1 group-hover:text-foreground">
        {c.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{c.summary}</p>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            ~{c.estimatedTime}h
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {c.completedCount}
          </span>
        </div>
        <Button asChild size="sm" variant="default">
          <Link to="/learner/challenges/$id" params={{ id: c.id }}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
