export function diffStyle(d: string): string {
  switch (d) {
    case "Beginner":
      return "bg-success/15 text-success border-success/40 dark:bg-success/25 dark:text-[oklch(0.85_0.14_155)] dark:border-success/50";
    case "Intermediate":
      return "bg-info/15 text-info border-info/40 dark:bg-info/25 dark:text-[oklch(0.82_0.12_245)] dark:border-info/50";
    case "Advanced":
      return "bg-warning/15 text-warning-foreground border-warning/40 dark:bg-warning/25 dark:text-[oklch(0.88_0.12_75)] dark:border-warning/50";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}