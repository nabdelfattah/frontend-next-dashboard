"use client";
import { Moon, Sun } from "@/icons";
import { useTheme } from "@core/context/ThemeContext";
import React from "react";


export default function ThemeTogglerTwo() {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="inline-flex size-14 items-center justify-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600"
    >
      <Sun className="hidden dark:block"/>
      <Moon className="dark:hidden" />
    </button>
  );
}
