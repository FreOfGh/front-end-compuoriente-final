"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeState = {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
};

type ThemeContextValue = ThemeState & {
  setPrimary: (color: string) => void;
  setAccent: (color: string) => void;
  setBackground: (color: string) => void;
  setForeground: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "edu-app-theme";

const DEFAULT: ThemeState = {
  primary: "#2563eb",
  accent: "#ec4899",
  background: "#f8fafc",
  foreground: "#0f172a",
};

function applyTheme(theme: ThemeState) {
  const root = document.documentElement;
  root.style.setProperty("--theme-primary", theme.primary);
  root.style.setProperty("--theme-accent", theme.accent);
  root.style.setProperty("--theme-background", theme.background);
  root.style.setProperty("--theme-foreground", theme.foreground);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(DEFAULT);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ThemeState;
        setTheme(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const value = useMemo(
    () => ({
      ...theme,
      setPrimary: (c: string) => setTheme((prev) => ({ ...prev, primary: c })),
      setAccent: (c: string) => setTheme((prev) => ({ ...prev, accent: c })),
      setBackground: (c: string) => setTheme((prev) => ({ ...prev, background: c })),
      setForeground: (c: string) => setTheme((prev) => ({ ...prev, foreground: c })),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
