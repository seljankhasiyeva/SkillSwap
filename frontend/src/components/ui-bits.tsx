export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="label-mono mb-3">{children}</h2>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "success" | "primary";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary text-primary-foreground border-primary"
      : tone === "success"
      ? "bg-success/5 border-success/20"
      : "bg-surface";
  return (
    <div className={`border rounded-lg p-5 ${toneClass}`}>
      <div
        className={`font-mono text-[10px] uppercase tracking-wider mb-2 ${
          tone === "primary" ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      <div className="text-2xl font-bold tracking-tight tabular-nums">{value}</div>
      {hint && (
        <div
          className={`mt-2 text-[11px] ${
            tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {hint}
        </div>
      )}
    </div>
  );
}
