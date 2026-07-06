import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  to?: string;
};

const sizeMap = {
  sm: "size-6",
  md: "size-7",
  lg: "size-9",
};

export function Logo({ size = "md", showText = true, className, to = "/" }: LogoProps) {
  const content = (
    <>
      <img
        src="/logo.png"
        alt="SkillSwap"
        className={cn(sizeMap[size], "object-contain shrink-0", className)}
      />
      {showText && (
        <span className="font-bold tracking-tight text-base group-data-[collapsible=icon]:hidden">
          SkillSwap
        </span>
      )}
    </>
  );

  return (
    <Link to={to} className="flex items-center gap-2 px-2 py-2">
      {content}
    </Link>
  );
}

export function LogoMark({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="SkillSwap"
      className={cn(sizeMap[size], "object-contain shrink-0", className)}
    />
  );
}
