import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "skillswap-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setThemeState((t) => (t === "light" ? "dark" : "light"));
  const setTheme = (t: Theme) => setThemeState(t);

  return { theme, toggle, setTheme };
}

export function getThemeScript(): string {
  return `
    (function() {
      try {
        var t = localStorage.getItem('${STORAGE_KEY}');
        if (t === 'dark') document.documentElement.classList.add('dark');
      } catch(e) {}
    })();
  `;
}
