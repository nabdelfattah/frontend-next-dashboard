# SearchToolbar

**File:** `src/foundation/shared/components/search-toolbar/`

A search bar plus a "Filter" popup, made for sitting on top of a [`Table`](./table.md). It handles
the *UI* for searching and filtering — the actual fetching is your job, done by a parent page.

## The big idea

`SearchToolbar` doesn't fetch anything and doesn't hold any results. All it does is show a search
box and a "Filter" button, and **report what the user did**:

1. Typing in the search box, pressing Enter, or clicking Clear → calls `onSearchChange`.
2. Changing a field in the filter popup → calls `onFilterFieldChange`, once per field.

Your page listens to those two callbacks, keeps its own `search`/`filters` state, and is
responsible for actually fetching data with them (usually alongside [`Table`](./table.md)'s own
sort/filter/page-size reports — see [Combining with `Table`](#combining-with-table) below).

## Basic usage

```tsx
<SearchToolbar
  dataSchema={[
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Role", type: "checkbox", enum: ["admin", "manager", "staff"] },
    { key: "joinDate", label: "Join date", type: "date" },
  ]}
  onSearchChange={(search) => setSearch(search)}
  onFilterFieldChange={(field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }))
  }
/>
```

- **`dataSchema`** — the list of fields shown in the filter popup (see below).
- **`onSearchChange`** — called with the search box's text. Debounced while typing (waits a short
  pause before calling), but fires immediately on Enter.
- **`onFilterFieldChange`** — called with **one field's key and its new value**, every time that
  field changes. Never debounced. An empty string means the field was cleared.

## The filter popup fields (`dataSchema`)

Each entry in `dataSchema` describes one filter field:

```ts
{ key: "role", label: "Role", type: "checkbox", enum: ["admin", "manager", "staff"] }
```

- **`key`** — the name this field is reported under (the first argument to
  `onFilterFieldChange`). Use the same key your API expects as a query parameter.
- **`label`** — the text shown above the field in the popup.
- **`type`** — which input is shown:

  | `type` | What it shows |
  | --- | --- |
  | `text` | A plain text box. |
  | `number` | A number box. |
  | `date` | A date picker. |
  | `select` | A dropdown with the options from `enum`. |
  | `checkbox` | A list of checkboxes, one per value in `enum`. Checking more than one sends them together, comma-separated. |

- **`enum`** — only needed for `select` and `checkbox`. The list of choices to show.

### Don't want to write this list by hand?

If you already have a `Table` on the same page, its `tableData.metaData` already describes every
column — turn that straight into a `dataSchema` instead of typing it out twice:

```tsx
import { buildSearchDataSchema } from "@/foundation/shared/utils/search-data-schema";

const dataSchema = buildSearchDataSchema(tableData.metaData);
```

This looks at each column and works out a sensible filter for it:

- The column's `secondaryCode` becomes the `key`, and `name` becomes the `label`.
- A column with an `enum` (a fixed list of values, like a status) always becomes a `checkbox`
  field.
- Otherwise, the column's `type` decides the field: `DATE` → `date`, `NUMBER`/`RATING` → `number`,
  `STRING` → `text`.
- Fields come out in the same order as the columns (`order`).
- Columns that don't make sense to filter on (like an avatar picture) are left out automatically.

Because this uses the same `secondaryCode` as `Table`'s own per-column filters, a field built this
way can be set from *either* `SearchToolbar`'s popup or `Table`'s own column filter menu — see
[Combining with `Table`](#combining-with-table).

## How searching actually happens

- **Typing** in the search box waits a short moment after you stop typing (400ms by default), then
  calls `onSearchChange`. Pressing **Enter** calls it immediately, skipping the wait.
- **Changing a filter field** reports immediately via `onFilterFieldChange` — no waiting, and only
  that one field is reported, not the whole filter set.
- **Clicking Clear** empties the search box and every filter: it calls `onSearchChange("")` and
  `onFilterFieldChange(key, "")` once for every field that had a value.

You can change the "wait a moment" delay for the search box with the `debounceMs` prop (default
`400`). Filter fields are never debounced, regardless of this setting.

## Combining with `Table`

`Table` has the same kind of reporting props (`onSortChange`, `onFilterChange`,
`onPageSizeChange`, `onPageChange` — see [table.md](./table.md#reporting-changes-upward)). A page
that renders both typically keeps one combined query in state and fetches once, in one effect:

```tsx
"use client";

import { PageHeading, SearchToolbar } from "@/foundation/shared/components";
import { buildSearchDataSchema } from "@/foundation/shared/utils/search-data-schema";
import Table, { TableData } from "@/foundation/shared/components/table/table";
import { TableSortState } from "@/foundation/shared/components/table/types";
import { PageSize } from "@/foundation/shared/components/table/page-size-select";
import { useEffect, useState } from "react";

async function fetchTableData(query: {
  search: string;
  filters: Record<string, string>;
  sort: TableSortState | null;
  page: number;
  limit: number;
}): Promise<TableData> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  Object.entries(query.filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (query.sort) {
    params.set("sortBy", query.sort.field);
    params.set("sortOrder", query.sort.order);
  }
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  const response = await fetch(`/api/users?${params.toString()}`);
  return (await response.json()).result as TableData;
}

export default function UsersPage() {
  const [tableData, setTableData] = useState<TableData | null>(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageSize>(6);

  useEffect(() => {
    fetchTableData({ search, filters, sort, page, limit }).then(setTableData);
  }, [search, filters, sort, page, limit]);

  if (!tableData) return null;

  return (
    <div>
      <PageHeading>Users</PageHeading>
      <SearchToolbar
        dataSchema={buildSearchDataSchema(tableData.metaData)}
        filters={filters}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onFilterFieldChange={(field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
          setPage(1);
        }}
      />
      <Table
        tableData={tableData}
        filters={filters}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onFilterChange={(field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
          setPage(1);
        }}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onPageChange={(value) => setPage(value)}
      />
    </div>
  );
}
```

A few things worth calling out about this pattern:

- **One merged field wins, no matter which UI touched it last.** Both `onFilterFieldChange` and
  `Table`'s `onFilterChange` merge only the *single* field they report
  (`{ ...prev, [field]: value }`) — never a whole snapshot from either side's own local state. If
  the same field exists in both `SearchToolbar`'s `dataSchema` and `Table`'s columns (which it will,
  whenever the schema came from `buildSearchDataSchema`), whichever side the user touched most
  recently is what ends up in `filters`, regardless of what the other side's UI still shows.
- **Every filter/sort/page-size change resets to page 1** (`setPage(1)`), except a plain page-number
  click, which only calls `setPage(value)`.
- **Pass `filters` back down to both components.** Without it, each side's popup only ever shows
  what *it* was last used to set — so if a field gets changed from the other side, that popup can
  keep showing a stale value until you interact with it again. Passing `filters` back lets each
  side notice when a shared field changed elsewhere and resync its own display to match. Search text
  doesn't need this — only `SearchToolbar` has a search box, so there's nothing else that could make
  it stale.
- **No debounce is added at this level.** `search` is already debounced inside `SearchToolbar`
  before it ever reaches this state; filter/sort/page-size changes come from discrete clicks
  (checking a box, clicking Apply, clicking Ascending), not typing, so they don't need one either.

## All the props

| Prop | Required? | What it does |
| --- | --- | --- |
| `dataSchema` | Yes | The list of filter fields shown in the popup. |
| `onSearchChange` | No | Called with the search text — debounced while typing, immediate on Enter or Clear. |
| `onFilterFieldChange` | No | Called with one field's key and new value whenever that field changes (never debounced). Empty string means cleared. |
| `filters` | No | The authoritative filter values, if shared with something else (like `Table`) via a parent page. When a value here differs from what the popup last showed for that field, the popup resyncs to match. Omit for standalone use. |
| `debounceMs` | No | How long to wait after typing before calling `onSearchChange`. Defaults to `400`. |
