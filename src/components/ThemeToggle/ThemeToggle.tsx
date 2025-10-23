import { useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}
function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return saved === "dark" || saved === "light"
    ? saved
    : prefersDark()
    ? "dark"
    : "light";
}
function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}
const INITIAL = getInitialTheme();
applyTheme(INITIAL);

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(INITIAL);

  useLayoutEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";
  const icon = isDark ? "☾" : "☀";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  const handleClick = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      title={label}
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--text)",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
        transition:
          "background .2s ease, color .2s ease, border-color .2s ease",
      }}
    >
      {icon}
    </button>
  );
}
