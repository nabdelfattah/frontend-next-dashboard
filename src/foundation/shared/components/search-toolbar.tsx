"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Input from "./form/input/input-field";
import Select from "./form/select";
import DatePicker from "./form/date-picker";
import Label from "./form/label";
import Button from "./button";
import { Dropdown } from "./dropdown/dropdown";
import useDropdownToggle from "../hooks/use-dropdown-toggle";
import { showToast } from "../stores/toast-store";

export type SearchFilterFieldType = "text" | "select" | "date" | "number";

export interface SearchFilterField {
  /** Stable identifier for this field — used as its query param name, and as its key in the `filters` sent with every search. Distinct from `label` since `label` may be translated. */
  key: string;
  label: string;
  type: SearchFilterFieldType;
  /** Selectable values. Required (and only used) when `type` is `"select"`. */
  enum?: string[];
}

interface SearchToolbarProps {
  /** Endpoint queried for results — searching is always server-side, so this is required. */
  route: string;
  /** Fields rendered in the filter popup, and the keys their values are sent under. */
  dataSchema: SearchFilterField[];
  /** Called with the parsed JSON response body of every search request. Its shape depends on `route` — this component doesn't assume one. */
  onResults: (data: unknown) => void;
  /** Delay, in ms, after the last text/filter change before a request fires. Defaults to `400`. Explicit actions (submitting the search, clicking Clear) skip the delay. */
  debounceMs?: number;
}

function buildQueryString(
  search: string,
  filters: Record<string, string>
): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}

/**
 * Server-side search toolbar: a search input plus a Filter popup (its fields
 * driven by `dataSchema`) and a Clear button. Every search — typing (debounced),
 * pressing Enter, changing a filter (debounced), or clicking Clear (immediate) —
 * queries `route` and hands the parsed response to `onResults`; this component
 * holds no results state of its own.
 *
 * @param route - Endpoint queried for results, as `${route}?search=...&<filterKey>=...`.
 * @param dataSchema - Filter popup fields. Each needs a stable `key` (the query param name), a `label`, a `type`, and — for `type: "select"` — an `enum` of selectable values.
 * @param onResults - Called with the parsed JSON response of each search request.
 * @param debounceMs - Debounce delay in ms for typing/filter changes. Defaults to `400`.
 *
 * @example
 * <SearchToolbar
 *   route="/api/users/search"
 *   dataSchema={[
 *     { key: "name", label: "Name", type: "text" },
 *     { key: "job", label: "Job", type: "select", enum: ["hr", "customer service", "manager"] },
 *     { key: "licenceExpiry", label: "Licence expiry date", type: "date" },
 *     { key: "age", label: "Age", type: "number" },
 *   ]}
 *   onResults={(data) => setTableData(data.result)}
 * />
 */
export default function SearchToolbar({
  route,
  dataSchema,
  onResults,
  debounceMs = 400,
}: SearchToolbarProps) {
  const t = useTranslations("shared.table");
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { isOpen: isFilterOpen, toggle: toggleFilter, close: closeFilter } =
    useDropdownToggle();

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);

  const hasActiveFilters = Object.keys(filters).length > 0;

  async function runSearch(overrides?: {
    query?: string;
    filters?: Record<string, string>;
  }) {
    const queryString = buildQueryString(
      overrides?.query ?? query,
      overrides?.filters ?? filters
    );

    try {
      const response = await fetch(
        queryString ? `${route}?${queryString}` : route
      );
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      onResults(await response.json());
    } catch {
      showToast({
        variant: "error",
        title: t("searchFailedTitle"),
        message: t("searchFailedMessage"),
      });
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(runSearch, debounceMs);
    return () => clearTimeout(timeoutId);
    // Only re-debounce on actual search-input changes; `runSearch`/`debounceMs`
    // reading the latest `query`/`filters` via closure is fine here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runSearch();
  }

  function handleClear() {
    setQuery("");
    setFilters({});
    setResetKey((key) => key + 1);
    closeFilter();
    runSearch({ query: "", filters: {} });
  }

  function setFilterValue(key: string, value: string) {
    setFilters((prev) => {
      if (!value) {
        const { [key]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }

  function renderField(field: SearchFilterField) {
    const value = filters[field.key] ?? "";

    switch (field.type) {
      case "select":
        return (
          <Select
            options={(field.enum ?? []).map((option) => ({
              value: option,
              label: option,
            }))}
            defaultValue={value}
            onChange={(next) => setFilterValue(field.key, next)}
          />
        );
      case "date":
        return (
          <DatePicker
            id={`search-filter-${field.key}`}
            defaultDate={value || undefined}
            onChange={(_, dateStr) => setFilterValue(field.key, dateStr)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            defaultValue={value}
            onChange={(event) =>
              setFilterValue(field.key, event.target.value)
            }
          />
        );
      case "text":
      default:
        return (
          <Input
            type="text"
            defaultValue={value}
            onChange={(event) =>
              setFilterValue(field.key, event.target.value)
            }
          />
        );
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <form onSubmit={handleSubmit}>
        <div className="relative xl:w-[430px]">
          <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />

          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
          >
            <span> ⌘ </span>
            <span> K </span>
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        <div ref={anchorRef} className="dropdown-toggle relative">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={toggleFilter}
            className={hasActiveFilters ? "!border-brand-500 !text-brand-500" : ""}
          >
            {t("filter")}
          </Button>

          <Dropdown
            isOpen={isFilterOpen}
            onClose={closeFilter}
            anchorRef={anchorRef}
            placement="bottom-end"
            className="flex w-80 flex-col gap-3 p-4"
          >
            {dataSchema.map((field) => (
              <div key={`${field.key}-${resetKey}`} className="flex flex-col gap-1.5">
                <Label>{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </Dropdown>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          {t("clear")}
        </Button>
      </div>
    </div>
  );
}
