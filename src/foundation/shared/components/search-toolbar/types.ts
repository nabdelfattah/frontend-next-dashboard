export type SearchFilterFieldType =
  | "text"
  | "select"
  | "date"
  | "number"
  | "checkbox";

export interface SearchFilterField {
  /** Stable identifier for this field — used as its query param name, and as its key in the `filters` sent with every search. Distinct from `label` since `label` may be translated. */
  key: string;
  label: string;
  type: SearchFilterFieldType;
  /** Selectable values. Required (and only used) when `type` is `"select"` or `"checkbox"`. */
  enum?: string[];
}

export interface SearchToolbarProps {
  /** Fields rendered in the filter popup, and the keys their values are reported under. */
  dataSchema: SearchFilterField[];
  /**
   * Called with the free-text search value: debounced while typing, and
   * immediately (bypassing the debounce) on Enter or Clear.
   */
  onSearchChange?: (search: string) => void;
  /**
   * Called with a field's `key` and its new value once the user clicks
   * Apply in the filter popup — called once per field that actually changed
   * since the last Apply (or Clear, or external resync via `filters`), not
   * on every keystroke/selection while the popup is open. An empty string
   * means the field was cleared. Clicking the standalone Clear button (not
   * Apply) reports every currently-set field as cleared immediately, since
   * that's a distinct "clear everything now" action, not a popup edit.
   */
  onFilterFieldChange?: (field: string, value: string) => void;
  /**
   * The authoritative filter values, if this component's filters are shared
   * with something else (e.g. `Table`'s own per-column filters) via a parent
   * page. When a value here differs from what this component's own filter
   * popup last showed for that field — meaning something else changed it —
   * the popup's fields resync to match. Omit this prop to use `SearchToolbar`
   * standalone; its filter popup then only ever reflects its own edits.
   */
  filters?: Record<string, string>;
  /** Debounce delay in ms for typing in the search box. Defaults to `400`. */
  debounceMs?: number;
}
