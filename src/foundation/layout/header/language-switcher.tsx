"use client";

import React, { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { DropdownItem } from "@shared/components/dropdown/dropdown-item";
import useDropdownToggle from "@shared/hooks/use-dropdown-toggle";
import { Languages } from "@/assets/icons";

export default function LanguageSwitcher() {
  const { isOpen, toggle, close } = useDropdownToggle();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.language");
  const anchorRef = useRef<HTMLButtonElement>(null);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    toggle();
  }

  function closeDropdown() {
    close();
  }

  function handleSelect(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
    closeDropdown();
  }

  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center text-muted-foreground transition-colors bg-surface border border-border rounded-full hover:text-foreground h-11 w-11 hover:bg-muted"
        aria-label={t("label")}
      >
        <Languages />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        anchorRef={anchorRef}
        className="flex w-40 flex-col rounded-2xl border border-border bg-popover p-3 shadow-theme-lg"
      >
        <span className="block px-3 pb-2 text-xs font-semibold uppercase text-gray-400">
          {t("label")}
        </span>
        <ul className="flex flex-col gap-1">
          {routing.locales.map((loc) => (
            <li key={loc}>
              <DropdownItem
                onItemClick={() => handleSelect(loc)}
                className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-theme-sm hover:bg-muted hover:text-foreground ${
                  locale === loc
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {t(loc)}
              </DropdownItem>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
