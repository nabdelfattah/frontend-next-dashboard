"use client";

import { useTranslations } from "next-intl";
import Select from "../form/select";

export const PAGE_SIZE_OPTIONS = [6, 12, 24] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface PageSizeSelectProps {
  value: number;
  onChange: (size: PageSize) => void;
}

/**
 * "Rows per page" picker for the table footer, next to `Pagination`.
 * Options are fixed to `PAGE_SIZE_OPTIONS` (6 / 12 / 24).
 */
export default function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  const t = useTranslations("shared.table");

  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-muted-foreground text-theme-sm">
        {t("rowsPerPage")}
      </span>
      <div className="w-20">
        <Select
          options={PAGE_SIZE_OPTIONS.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          defaultValue={String(value)}
          onChange={(next) => onChange(Number(next) as PageSize)}
        />
      </div>
    </div>
  );
}
