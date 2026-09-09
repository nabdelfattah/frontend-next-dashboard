"use client";

import React, { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { useThemeConfig } from "@core/context/ThemeConfigContext";
import {
  PRIMARY_COLORS,
  SURFACE_COLORS,
  getSwatchColor,
  getSurfaceSwatchColor,
} from "@/lib/theme-config";
import { Palette } from "@/icons";

export default function ThemeConfigurator() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, setPrimary, setSurface } = useThemeConfig();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center text-white transition-colors bg-brand-500 border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-700 h-11 w-11 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label="Theme settings"
      >
        <Palette />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-64 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Primary
          </span>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {PRIMARY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                aria-label={`Set primary color to ${color}`}
                aria-pressed={config.primary === color}
                onClick={() => setPrimary(color)}
                className={`size-6 shrink-0 rounded-full shadow-theme-xs transition-transform hover:scale-110 ${
                  config.primary === color
                    ? "outline outline-2 outline-offset-2 outline-brand-500"
                    : ""
                }`}
                style={{ backgroundColor: getSwatchColor(color) }}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Surface
          </span>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {SURFACE_COLORS.map((surface) => (
              <button
                key={surface}
                type="button"
                title={surface}
                aria-label={`Set surface color to ${surface}`}
                aria-pressed={config.surface === surface}
                onClick={() => setSurface(surface)}
                className={`size-6 shrink-0 rounded-full shadow-theme-xs transition-transform hover:scale-110 ${
                  config.surface === surface
                    ? "outline outline-2 outline-offset-2 outline-brand-500"
                    : ""
                }`}
                style={{ backgroundColor: getSurfaceSwatchColor(surface) }}
              />
            ))}
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
