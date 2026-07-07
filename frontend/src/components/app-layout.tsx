import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Swords,
  FileCheck2,
  Trophy,
  UserRound,
  Plus,
  Sparkles,
  BarChart3,
  Users,
  Briefcase,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession, signOut, type Session } from "@/lib/auth-store";
import { fetchMe } from "@/lib/api";
import { useTheme } from "@/hooks/use-theme";
import { Logo } from "@/components/logo";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const LEARNER_NAV: NavItem[] = [
  { title: "Dashboard", url: "/learner", icon: LayoutDashboard },
  { title: "Challenges", url: "/learner/challenges", icon: Swords },
  { title: "My Submissions", url: "/learner/submissions", icon: FileCheck2 },
  { title: "Leaderboard", url: "/learner/leaderboard", icon: Trophy },
  { title: "Proof-of-Work", url: "/learner/profile", icon: UserRound },
];

const MENTOR_NAV: NavItem[] = [
  { title: "Dashboard", url: "/mentor", icon: LayoutDashboard },
  { title: "My Challenges", url: "/mentor/challenges", icon: Swords },
  { title: "Create with AI", url: "/mentor/challenges/new?ai=true", icon: Sparkles },
  { title: "Submissions", url: "/mentor/submissions", icon: FileCheck2 },
  { title: "Analytics", url: "/mentor/analytics", icon: BarChart3 },
];

const COMPANY_NAV: NavItem[] = [
  { title: "Dashboard", url: "/company", icon: LayoutDashboard },
  { title: "Verified Talent", url: "/company/talent", icon: Users },
  { title: "Open Challenges", url: "/company/challenges", icon: Briefcase },
  { title: "New Challenge", url: "/company/challenges/new", icon: Plus },
  { title: "Pipeline", url: "/company/pipeline", icon: BarChart3 },
];

function navFor(session: Session | null): { items: NavItem[]; label: string } {
  switch (session?.role) {
    case "mentor":
      return { items: MENTOR_NAV, label: "Mentor" };
    case "company":
      return { items: COMPANY_NAV, label: "Company" };
    case "learner":
    default:
      return { items: LEARNER_NAV, label: "Learner" };
  }
}

function AppSidebar() {
  const session = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { items, label } = navFor(session);

  const isActive = (url: string) => {
    const normalized = pathname.replace(/\/$/, "") || "/";
    const normalizedUrl = url.replace(/\/$/, "") || "/";

    if (normalized === normalizedUrl) return true;

    if (normalized.startsWith(normalizedUrl + "/")) {
      const hasMoreSpecificMatch = items.some((other) => {
        const otherUrl = other.url.replace(/\/$/, "") || "/";
        if (otherUrl === normalizedUrl) return false;
        if (!otherUrl.startsWith(normalizedUrl + "/")) return false;
        return normalized === otherUrl || normalized.startsWith(otherUrl + "/");
      });
      return !hasMoreSpecificMatch;
    }

    return false;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Logo size="md" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="label-mono">{label} Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    {item.url.includes("?") ? (
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link to={item.url as any} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {session ? (
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs font-semibold">
                {session.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{session.name}</p>
              <p className="text-[11px] text-muted-foreground truncate capitalize">{session.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 group-data-[collapsible=icon]:hidden"
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              aria-label="Sign out"
            >
              <LogOut className="size-3.5" />
            </Button>
          </div>
        ) : (
          <Link to="/login" className="px-2 py-2 text-xs text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden">
            Sign in
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({
  children,
  breadcrumb,
  rightSlot,
}: {
  children: ReactNode;
  breadcrumb?: ReactNode;
  rightSlot?: ReactNode;
}) {
  const session = useSession();
  const { theme, toggle } = useTheme();
  const [xpPoints, setXpPoints] = useState<number | null>(null);

  useEffect(() => {
    if (session?.role === "learner") {
      fetchMe()
        .then((u) => setXpPoints(u.xpPoints ?? 0))
        .catch(() => setXpPoints(null));
    } else {
      setXpPoints(null);
    }
  }, [session?.role]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b bg-background/80 backdrop-blur sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="text-sm text-muted-foreground">{breadcrumb}</div>
            </div>
            <div className="flex items-center gap-3">
              {rightSlot}
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
              {session?.role === "learner" && xpPoints !== null && (
                <div className="hidden md:flex items-center gap-2 py-1 px-3 bg-muted border border-border rounded-full">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground">
                    XP_POINTS
                  </span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {xpPoints.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}