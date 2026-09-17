# Table

**File:** `src/foundation/shared/components/table/table.tsx`

A ready-made table for admin pages — users, orders, vehicles, employees, anything that's a list.
You give it your data, and it draws the whole table: columns, sorting, filtering, row selection,
bulk delete, and pagination. You don't write any `<table>` HTML yourself.

## The big idea

Most tables in this app come from an API that already describes its own columns — what fields
exist, what each one is called, what type it is (text, date, rating...), and what order they
should appear in. The `Table` component reads that description (called `metaData`) and builds the
table from it automatically.

So instead of hard-coding "show a Name column, then an Email column, then a Status column...",
you just hand the table your API response, and it figures out the columns itself. This means the
same `Table` component works for a list of users, a list of orders, or a list of anything else —
you never have to write a new table for a new page.

`Table` never fetches anything itself. It renders whatever page of data you give it, and
**reports back** what the user did (sorted a column, applied a filter, clicked a page, picked a
page size) so a parent page can turn that into a real request — see
[Reporting changes upward](#reporting-changes-upward).

## The data shape it expects

The `tableData` prop needs three things:

```ts
{
  paging: { ... },      // info for the "Page 1 of 3" controls at the bottom
  metaData: [ ... ],     // describes each column
  items: [ ... ],        // the actual rows for the current page
}
```

### `metaData` — one entry per column

```json
{
  "secondaryCode": "employee_name",
  "name": "Name",
  "order": 3,
  "type": "STRING",
  "isPublic": 1,
  "enum": null
}
```

- **`secondaryCode`** — the field's key. This is how the table finds the value in each row
  (`item.employee_name`), and it's also what `onFilterChange`/`onSortChange` report a column as.
- **`name`** — the label shown in the column header.
- **`order`** — controls left-to-right column position. Lower numbers come first.
- **`type`** — controls how the cell is drawn (see the table below).
- **`isPublic`** — `1` or `0` means "show this column". `-1` is special: it means "this is the
  row's unique ID, don't show it as a column at all". Every table needs exactly one `-1` column so
  the table knows how to tell rows apart (for selection, and for building action links).
- **`enum`** — optional. If a column has a fixed list of possible values (like a status), list
  them here and the table will show them as colored badges instead of plain text, and its filter
  becomes a set of checkboxes instead of a text box.

### `items` — the rows

Just an array of plain objects, one per row, with keys matching each column's `secondaryCode`:

```json
{ "employee_name": "Jane Doe", "employee_status": "active", "employee_id": "abc-123" }
```

## Column types

| `type`        | What it looks like                                                          |
| ------------- | ---------------------------------------------------------------------------- |
| `STRING`      | Plain text. Becomes a colored badge automatically if the column has `enum`.   |
| `NUMBER`      | Plain text.                                                                   |
| `DATE`        | Formatted date.                                                               |
| `RATING`      | Star rating (★★★☆☆).                                                         |
| `IMAGE`       | A small round avatar. It merges into the *next* column instead of getting its own — e.g. an avatar picture sits right next to the person's name. |
| `IMAGE_GROUP` | A stack of overlapping avatars (like "3 team members"), with a "+N" badge if there are more than 3, and a little popup listing everyone if you hover over it. |

## Sorting and filtering

Every column that isn't an avatar (`IMAGE`) gets a small **⋮** menu in its header. Clicking it
opens a little panel with:

- **Ascending / Descending** buttons to sort by that column.
- A filter box — a text box, a date picker, a number box, or a set of checkboxes, depending on the
  column's type.
- **Apply** and **Clear** buttons.

Typing in the filter box doesn't do anything until you click **Apply** — that's on purpose, so you
can change your mind without triggering a request on every keystroke.

Sorting or applying/clearing a filter also resets to page 1 automatically (both in the table's own
pagination display, and via `onPageChange(1)`), since a re-sorted or re-filtered result set starts
over from the top. A plain page-number click never does this.

## Reporting changes upward

`Table` doesn't fetch, sort, or filter `items` itself — it only draws whatever page of data it's
given, and tells you what the user asked for:

```tsx
<Table
  tableData={tableData}
  onSortChange={(sort) => setSort(sort)}          // { field, order } | null
  onFilterChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
  onPageSizeChange={(size) => setLimit(size)}       // 6 | 12 | 24
  onPageChange={(page) => setPage(page)}
/>
```

- **`onSortChange`** — called with the new sort (`{ field, order }`, using the column's
  `secondaryCode` as `field`) or `null` when sorting is cleared.
- **`onFilterChange`** — called with **one column's `secondaryCode` and its new value**, mirroring
  [`SearchToolbar`](./search-toolbar.md)'s `onFilterFieldChange` exactly, so a parent page can
  merge both into one `filters` object by field. Empty string means cleared.
- **`onPageSizeChange`** — called with the newly chosen rows-per-page value.
- **`onPageChange`** — called with the requested page number. This is the *only* one of these that
  fires for a plain page-number click, and it never resets anything itself.

None of this is wired to a real backend by `Table` — see
[Combining with `SearchToolbar`](#combining-with-searchtoolbar) for the pattern a parent page uses
to turn these callbacks into one request.

### Keeping filters in sync with another UI

If the same field can be filtered from more than one place — typically `Table`'s own column menu
*and* [`SearchToolbar`](./search-toolbar.md)'s filter popup, whenever `SearchToolbar`'s
`dataSchema` was built with `buildSearchDataSchema` (same `secondaryCode`/`key`) — pass the
parent's authoritative filter values back in as the `filters` prop:

```tsx
<Table tableData={tableData} filters={filters} onFilterChange={...} />
```

Without it, a column's filter menu only ever shows what *it* was last used to set. If the same
field then gets changed from `SearchToolbar` instead, the *data* is still correct (whichever side
changed it last wins), but that column's menu would keep showing its own stale value until
reopened after a resync. Passing `filters` back down is what makes that column's trigger
highlight and its menu's draft value immediately reflect a change made anywhere else. This is only
needed for filters — there's no second UI for the search box.

## Rows per page

A "Rows per page" picker sits next to the pagination controls, fixed to exactly three options: 6,
12, or 24. Picking a new size resets to page 1 and calls `onPageSizeChange`.

The **page count shown** is computed from `tableData.paging.totalItems` (the real total row count
from your API) divided by the chosen size — so the pagination controls are always arithmetically
correct for whatever size is picked, even though the actual `items` you provide come from your own
fetch (see [Reporting changes upward](#reporting-changes-upward) — pass the size to your fetch via
`onPageSizeChange` to get a real page of that size back).

## Row actions

Want an "Edit" or "Delete" button on every row? Pass the `actions` prop:

```tsx
<Table
  tableData={tableData}
  actions={[
    { label: "View Details", path: "/users" },
    { label: "Delete", variant: "danger", action: (id) => deleteUser(id) },
  ]}
/>
```

This adds an "Actions" column with a **⋮** menu on every row.

- Use `path` for a link. The row's ID is automatically added to the end — `path: "/users"`
  becomes a link to `/users/<the-row's-id>`.
- Use `action` for a button that runs your own function. It's called with that row's ID.
- Add `variant: "danger"` to make an item show up in red at the bottom of the menu, below a
  divider — handy for "Delete".

## Selecting rows and bulk delete

Want checkboxes so people can select several rows and delete them all at once? Pass
`onBulkDelete`:

```tsx
<Table
  tableData={tableData}
  onBulkDelete={(ids) => deleteManyUsers(ids)}
/>
```

That's the only thing you need to do — passing `onBulkDelete` is what turns the checkboxes on.
There's no separate "enable selection" switch.

Once at least one row is checked, a small floating bar slides up from the bottom of the screen
showing how many rows are selected, with a **Delete** button and a **Clear selection** button.
Clicking **Delete** asks "are you sure?" before doing anything. Once confirmed, your
`onBulkDelete` function is called with the list of selected IDs, and the table clears the
selection — actually removing the rows (or refetching the list) is your job.

Selections stay checked even if the user moves to a different page and comes back.

## Pagination

Page number buttons show up automatically at the bottom whenever there's more than one page. Pass
`onPageChange` to know when someone clicks to a different page:

```tsx
<Table
  tableData={tableData}
  onPageChange={(page) => fetchPage(page)}
/>
```

## Full example

A standalone table (no sorting/filtering wired to a server, just data + row actions + pagination):

```tsx
"use client";

import Table, { TableData } from "@/foundation/shared/components/table/table";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    fetch("/api/users").then((res) => res.json()).then((json) => setTableData(json.result));
  }, []);

  if (!tableData) return null;

  return (
    <Table
      tableData={tableData}
      actions={[
        { label: "View Details", path: "/users" },
        { label: "Delete", variant: "danger", action: (id) => console.log("delete", id) },
      ]}
      onBulkDelete={(ids) => console.log("bulk delete", ids)}
      onPageChange={(page) =>
        setTableData((prev) => prev && { ...prev, paging: { ...prev.paging, currentPage: page } })
      }
    />
  );
}
```

## Combining with `SearchToolbar`

For real server-side search, sort, filter, and pagination, pair `Table` with
[`SearchToolbar`](./search-toolbar.md) and let a parent page merge both into one query and one
fetch. See [SearchToolbar → Combining with Table](./search-toolbar.md#combining-with-table) for
the full pattern (one `useEffect`, no extra library).

## All the props

| Prop | Required? | What it does |
| --- | --- | --- |
| `tableData` | Yes | The `{ paging, metaData, items }` data described above. |
| `actions` | No | Adds a trailing "Actions" column with a menu on every row. |
| `onBulkDelete` | No | Turns on row-selection checkboxes and a bulk-delete bar. Called with the selected IDs after the user confirms. |
| `onSortChange` | No | Called with the new sort (`{ field, order }` or `null`) whenever the user sorts a column. |
| `onFilterChange` | No | Called with one column's `secondaryCode` and its new value whenever a column filter is applied or cleared. |
| `filters` | No | The authoritative filter values, if shared with something else (like `SearchToolbar`) via a parent page. Keeps a column's filter menu from going stale when the field is changed elsewhere. |
| `onPageSizeChange` | No | Called with the newly picked rows-per-page value (6, 12, or 24). |
| `onPageChange` | No | Called with the new page number when the user paginates. |
