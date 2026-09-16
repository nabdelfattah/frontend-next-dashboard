"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { useThemeConfig } from "@core/providers/theme-config-provider";
import useDropdownToggle from "@shared/hooks/use-dropdown-toggle";
import {
  PRIMARY_COLORS,
  SURFACE_COLORS,
  getSwatchColor,
  getSurfaceSwatchColor,
} from "@/lib/theme-config";
import { Palette } from "@/assets/icons";

export default function ThemeConfigurator() {
  const { isOpen, toggle, close } = useDropdownToggle();
  const { config, setPrimary, setSurface } = useThemeConfig();
  const t = useTranslations("common.theme");
  const anchorRef = useRef<HTMLButtonElement>(null);

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
        ref={anchorRef}
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center text-white transition-colors bg-brand-500 rounded-full transition hover:bg-brand-600 h-11 w-11"
        aria-label={t("settings")}
      >
        <Palette />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        anchorRef={anchorRef}
        className="flex w-64 flex-col gap-4 rounded-2xl border border-border bg-popover p-4 shadow-theme-lg"
      >
        <div>
          <span className="text-sm font-semibold text-muted-foreground">
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
          <span className="text-sm font-semibold text-muted-foreground">
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
