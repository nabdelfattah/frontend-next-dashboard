"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useDropdownGroup } from "@layout/header/DropdownGroupContext";
import { Languages } from "@/icons";

export default function LanguageSwitcher({
  position = "top",
}: {
  /** Where the trigger sits in the viewport: "top" opens the panel downward
   *  (default, header usage), "bottom" opens it upward (e.g. auth pages). */
  position?: "top" | "bottom";
}) {
  const { isOpen, toggle, close } = useDropdownGroup("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common.language");

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
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label={t("label")}
      >
        <Languages />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className={`absolute end-0 flex w-40 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${
          position === "bottom" ? "bottom-full !mt-0 mb-[17px]" : "mt-[17px]"
        }`}
      >
        <span className="block px-3 pb-2 text-xs font-semibold uppercase text-gray-400">
          {t("label")}
        </span>
        <ul className="flex flex-col gap-1">
          {routing.locales.map((loc) => (
            <li key={loc}>
              <DropdownItem
                onItemClick={() => handleSelect(loc)}
                className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 ${
                  locale === loc
                    ? "bg-brand-50 text-brand-500 dark:bg-brand-500/[0.12] dark:text-brand-400"
                    : "text-gray-700 dark:text-gray-400"
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
