"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "../button";
import { useModal } from "../../hooks/use-modal";
import { Search } from "@/assets/icons";
import { SearchToolbarProps } from "./types";
import SearchFilterModal from "./filter-modal";
import { shallowEqualRecord } from "../../utils/shallow-equal-record";

/**
 * Search + filter UI. Doesn't fetch anything itself — it just reports what
 * the user did, via `onSearchChange`/`onFilterFieldChange`, so a parent page
 * can merge it with other inputs (e.g. `Table`'s own sort/filter/page-size)
 * into one combined query and run a single fetch.
 *
 * @param dataSchema - Filter popup fields. Each needs a stable `key`, a `label`, a `type`, and — for `type: "select"`/`"checkbox"` — an `enum` of selectable values.
 * @param onSearchChange - Called with the search text: debounced while typing, immediately on Enter or Clear.
 * @param onFilterFieldChange - Called with a field's `key` and its new value once Apply is clicked in the filter popup — once per field that actually changed, not on every edit while the popup is open. Empty string means cleared. The standalone Clear button reports every set field cleared immediately (a distinct action from Apply).
 * @param filters - Authoritative filter values, if shared with something else (e.g. `Table`) via a parent page. When a value here differs from what this component's own popup last showed, the popup resyncs to match. Omit for standalone use.
 * @param debounceMs - Debounce delay in ms for typing. Defaults to `400`.
 *
 * @example
 * <SearchToolbar
 *   dataSchema={[
 *     { key: "name", label: "Name", type: "text" },
 *     { key: "job", label: "Job", type: "select", enum: ["hr", "customer service", "manager"] },
 *   ]}
 *   onSearchChange={(search) => setSearch(search)}
 *   onFilterFieldChange={(field, value) =>
 *     setFilters((prev) => ({ ...prev, [field]: value }))
 *   }
 * />
 */
export default function SearchToolbar({
  dataSchema,
  onSearchChange,
  onFilterFieldChange,
  filters: externalFilters,
  debounceMs = 400,
}: SearchToolbarProps) {
  const t = useTranslations("shared.table");
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isOpen: isFilterOpen,
    toggleModal: toggleFilter,
    closeModal: closeFilter,
  } = useModal();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  // The last filter set actually reported upward (via Apply, Clear, or an
  // external resync) — the baseline `handleApplyFilters` diffs the draft
  // against, so Apply only reports fields that actually changed.
  const appliedFiltersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const timeoutId = setTimeout(() => onSearchChange?.(query), debounceMs);
    return () => clearTimeout(timeoutId);
    // Only the search text debounces this way — filter fields are local
    // draft state until Apply (see `handleApplyFilters`), so `filters`
    // intentionally isn't a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Resyncs the filter popup's draft when `filters` changes from *outside*
  // this component (e.g. the same field was set via Table's column filter
  // menu). Guarded by the equality check so this never fires from our own
  // Apply/Clear round-tripping back through the parent — those always arrive
  // equal to what's already here. Bumping `resetKey` remounts every field so
  // its `defaultValue` (uncontrolled, like `Input`/`DatePicker`) picks up the
  // new value; `Checkbox` fields update immediately either way, since they're
  // already fully controlled off `filters`.
  useEffect(() => {
    if (!externalFilters) return;
    if (shallowEqualRecord(externalFilters, filters)) return;
    setFilters(externalFilters);
    appliedFiltersRef.current = externalFilters;
    setResetKey((key) => key + 1);
    // Intentionally only reacting to the prop — `filters` is read for the
    // equality check, not as a trigger (that would refire on our own edits).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFilters]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchChange?.(query);
  }

  function handleClear() {
    setQuery("");
    Object.keys(filters).forEach((key) => onFilterFieldChange?.(key, ""));
    setFilters({});
    appliedFiltersRef.current = {};
    setResetKey((key) => key + 1);
    closeFilter();
    onSearchChange?.("");
  }

  /** Updates the draft only — nothing is reported upward until Apply. */
  function setFilterValue(key: string, value: string) {
    setFilters((prev) => {
      if (!value) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }

  /**
   * Resets every field's draft to empty — a "reset the form" action inside
   * the popup itself. Doesn't report anything or close the popup: like any
   * other field edit, it only takes effect once Apply is clicked (matching
   * the "nothing emits until Apply" rule). Distinct from the standalone
   * `handleClear` button outside the popup, which clears the search box too,
   * reports immediately, and closes.
   */
  function handleClearDraft() {
    setFilters({});
    setResetKey((key) => key + 1);
  }

  /** Reports every field that changed since the last Apply/Clear/resync, then closes. */
  function handleApplyFilters() {
    const applied = appliedFiltersRef.current;
    const changedKeys = new Set([...Object.keys(applied), ...Object.keys(filters)]);
    changedKeys.forEach((key) => {
      const nextValue = filters[key] ?? "";
      const prevValue = applied[key] ?? "";
      if (nextValue !== prevValue) {
        onFilterFieldChange?.(key, nextValue);
      }
    });
    appliedFiltersRef.current = filters;
    closeFilter();
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <form onSubmit={handleSubmit}>
        <div className="relative xl:w-[430px]">
          <span className="absolute -translate-y-1/2 start-4 top-1/2 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 ps-12 pe-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="absolute end-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
          >
            <span> ⌘ </span>
            <span> K </span>
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <Button type="button" variant="primary" size="sm" onClick={toggleFilter}>
          {t("filter")}
        </Button>

        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          {t("clear")}
        </Button>
      </div>

      <SearchFilterModal
        isOpen={isFilterOpen}
        onClose={closeFilter}
        onApply={handleApplyFilters}
        onClearDraft={handleClearDraft}
        dataSchema={dataSchema}
        filters={filters}
        onFieldChange={setFilterValue}
        resetKey={resetKey}
      />
    </div>
  );
}
