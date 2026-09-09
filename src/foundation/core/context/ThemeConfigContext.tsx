"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import {
  DEFAULT_THEME_CONFIG,
  THEME_CONFIG_STORAGE_KEY,
  type PrimaryColor,
  type SurfaceColor,
  type ThemeConfig,
} from "@/lib/theme-config";

type ThemeConfigContextType = {
  config: ThemeConfig;
  setPrimary: (primary: PrimaryColor) => void;
  setSurface: (surface: SurfaceColor) => void;
};

const ThemeConfigContext = createContext<ThemeConfigContextType | undefined>(undefined);

export const ThemeConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read persisted config on mount (the anti-FOUC script in layout.tsx already applied it to <html>).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_CONFIG_STORAGE_KEY);
      if (stored) setConfig({ ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored) });
    } catch {
      // localStorage unavailable (private mode, etc.) — fall back to defaults silently.
    }
    setIsInitialized(true);
  }, []);

  // Apply to <html> + persist whenever config changes.
  useEffect(() => {
    if (!isInitialized) return;
    const root = document.documentElement;
    root.setAttribute("data-primary", config.primary);
    root.setAttribute("data-surface", config.surface);
    try {
      localStorage.setItem(THEME_CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore write failures (e.g. storage quota, private mode)
    }
  }, [config, isInitialized]);

  const setPrimary = (primary: PrimaryColor) =>
    setConfig((c) => ({ ...c, primary }));
  const setSurface = (surface: SurfaceColor) =>
    setConfig((c) => ({ ...c, surface }));

  return (
    <ThemeConfigContext.Provider value={{ config, setPrimary, setSurface }}>
      {children}
    </ThemeConfigContext.Provider>
  );
};

export const useThemeConfig = () => {
  const context = useContext(ThemeConfigContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeConfigProvider");
  }
  return context;
};
