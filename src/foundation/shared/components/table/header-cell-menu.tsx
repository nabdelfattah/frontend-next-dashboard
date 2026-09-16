"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { EllipsisVertical, ChevronUp, ChevronDown, Filter } from "@/assets/icons";
import { Dropdown } from "../dropdown/dropdown";
import Button from "../button";
import FilterWidget from "./filter-widget";
import { TableMetaDataColumn } from "./types";
import { isFilterable, isSortable } from "./utils";
import useDropdownToggle from "../../hooks/use-dropdown-toggle";

interface HeaderCellMenuProps {
  column: TableMetaDataColumn;
  /** This column's current sort direction, or `null` if it isn't the sorted column. */
  sortOrder: "asc" | "desc" | null;
  /** This column's committed (applied) filter value, if any. */
  committedFilter: string | undefined;
  /** `null` clears the sort entirely (this column is no longer the sorted one). */
  onSort: (order: "asc" | "desc" | null) => void;
  onApplyFilter: (value: string) => void;
  onClearFilter: () => void;
}

/**
 * The "⋮" menu on a sortable/filterable column header: Ascending/Descending
 * sort buttons, plus that column's filter widget with Apply/Clear. Renders
 * nothing for a column that is neither sortable nor filterable (e.g. `IMAGE`).
 *
 * Filter changes only update a local draft until Apply is clicked — the
 * draft is discarded (reset to the last committed value) whenever the menu
 * is reopened.
 */
export default function HeaderCellMenu({
  column,
  sortOrder,
  committedFilter,
  onSort,
  onApplyFilter,
  onClearFilter,
}: HeaderCellMenuProps) {
  const t = useTranslations("shared.table");
  const { isOpen, toggle: toggleOpen, close } = useDropdownToggle();
  const [draft, setDraft] = useState(committedFilter ?? "");
  const anchorRef = useRef<HTMLButtonElement>(null);

  const sortable = isSortable(column);
  const filterable = isFilterable(column);

  if (!sortable && !filterable) return null;

  const toggle = () => {
    if (!isOpen) setDraft(committedFilter ?? "");
    toggleOpen();
  };

  const handleApply = () => {
    onApplyFilter(draft);
    close();
  };

  const handleClear = () => {
    setDraft("");
    onClearFilter();
    if (sortOrder !== null) onSort(null);
    close();
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={anchorRef}
        onClick={toggle}
        className={`dropdown-toggle flex h-6 w-6 items-center justify-center rounded text-gray-400 transition duration-300 hover:bg-muted hover:bg-gray-100 hover:text-foreground ${
          sortOrder || committedFilter ? "text-brand-500" : ""
        }`}
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={close}
        anchorRef={anchorRef}
        className="flex w-72 flex-col gap-2 p-3"
      >
        {sortable && (
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              aria-pressed={sortOrder === "asc"}
              onClick={() => onSort(sortOrder === "asc" ? null : "asc")}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                sortOrder === "asc"
                  ? "bg-card text-brand-500 shadow-theme-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
              {t("sortAscending")}
            </button>
            <button
              type="button"
              aria-pressed={sortOrder === "desc"}
              onClick={() => onSort(sortOrder === "desc" ? null : "desc")}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
                sortOrder === "desc"
                  ? "bg-card text-brand-500 shadow-theme-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ChevronDown className="h-4 w-4" />
              {t("sortDescending")}
            </button>
          </div>
        )}

        {sortable && filterable && (
          <div className="h-px bg-border" />
        )}

        {filterable && (
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              {t("filter")}
            </span>
            <FilterWidget column={column} value={draft} onChange={setDraft} />
            <div className="mt-1 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleClear}>
                {t("clear")}
              </Button>
              <Button size="sm" onClick={handleApply}>
                {t("apply")}
              </Button>
            </div>
          </div>
        )}
      </Dropdown>
    </div>
  );
}
