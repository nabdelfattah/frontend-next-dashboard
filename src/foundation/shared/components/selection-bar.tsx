"use client";

import { useTranslations } from "next-intl";
import Button from "./button";

interface SelectionBarProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

/**
 * Floating bulk-action bar shown while at least one row is selected. Always
 * mounted (not conditionally rendered) so it can transition in/out — it just
 * fades/slides away and stops accepting pointer events when `count` is 0.
 *
 * @param count - Number of currently selected rows. `0` hides the bar (still mounted, but transitioned out and non-interactive).
 * @param onDelete - Called when the delete action is clicked.
 * @param onClear - Called when the clear-selection action is clicked.
 *
 * @example
 * <SelectionBar count={selectedIds.length} onDelete={handleBulkDelete} onClear={clearSelection} />
 */
export default function SelectionBar({ count, onDelete, onClear }: SelectionBarProps) {
  const t = useTranslations("shared.table");
  const isVisible = count > 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      inert={!isVisible}
    >
      <div className="flex items-center gap-4 rounded-xl border border-border bg-floating-card px-4 py-3 shadow-theme-lg">
        <span className="text-sm font-medium text-foreground">
          {t("selectedCount", { count })}
        </span>
        <Button
          size="sm"
          variant="outline"
          className="!text-error-500 hover:!bg-error-soft"
          onClick={onDelete}
        >
          {t("delete")}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear}>
          {t("clearSelection")}
        </Button>
      </div>
    </div>
  );
}
