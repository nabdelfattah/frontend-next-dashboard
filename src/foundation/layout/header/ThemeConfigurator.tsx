"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { useThemeConfig } from "@core/context/ThemeConfigContext";
import { useDropdownGroup } from "@layout/header/DropdownGroupContext";
import {
  PRIMARY_COLORS,
  SURFACE_COLORS,
  getSwatchColor,
  getSurfaceSwatchColor,
} from "@/lib/theme-config";
import { Palette } from "@/icons";

export default function ThemeConfigurator({
  position = "top",
}: {
  /** Where the trigger sits in the viewport: "top" opens the panel downward
   *  (default, header usage), "bottom" opens it upward (e.g. auth pages). */
  position?: "top" | "bottom";
}) {
  const { isOpen, toggle, close } = useDropdownGroup("theme");
  const { config, setPrimary, setSurface } = useThemeConfig();
  const t = useTranslations("common.theme");

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    toggle();
  }

  function closeDropdown() {
    close();
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center text-white transition-colors bg-brand-500 rounded-full transition hover:bg-brand-600 h-11 w-11 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label={t("settings")}
      >
        <Palette />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className={`absolute end-0 flex w-64 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${
          position === "bottom" ? "bottom-full !mt-0 mb-[17px]" : "mt-[17px]"
        }`}
      >
        <div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("primary")}
          </span>
          <div className="mt-3 flex flex-wrap gap-2.5 justify-between">
            {PRIMARY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                aria-label={t("setPrimaryColor", { color })}
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
            {t("surface")}
          </span>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {SURFACE_COLORS.map((surface) => (
              <button
                key={surface}
                type="button"
                title={surface}
                aria-label={t("setSurfaceColor", { surface })}
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
