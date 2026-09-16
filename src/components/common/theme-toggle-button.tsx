"use client";
import React from "react";
import { useTheme } from "@core/providers/theme-provider";
import { Moon, Sun } from "@/assets/icons";

export const ThemeToggleButton: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center text-muted-foreground transition-colors bg-surface border border-border rounded-full hover:text-dark-900 h-11 w-11 hover:bg-muted hover:text-foreground"
    >
      <Sun className="hidden dark:block"/>
      <Moon className="dark:hidden" />
    </button>
  );
};
