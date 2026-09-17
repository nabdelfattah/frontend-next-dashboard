# RecordDetails

**File:** `src/foundation/shared/components/record-details/`

A popup that shows one record's details. You give it a record id and a base route; it fetches that
record when it opens and renders each field it gets back in a way that suits that field's type.

## The big idea

`RecordDetails` doesn't need to be told anything about the record's shape. The endpoint's response
is **self-describing** — every field carries its own label, its own type, and its own value — so the
popup just walks the list and picks the right renderer for each one.

That means adding a new field to a record is a backend-only change. Nothing here needs updating.

## Basic usage

The typical case is a "View details" row action on a [`Table`](./table.md). The page owns the open
state and the selected id — same pattern as `ConfirmDialog`:

```tsx
const { isOpen, openModal, closeModal } = useModal();
const [selectedId, setSelectedId] = useState<string | null>(null);

const tableActions = [
  { label: "View Details", action: (id: string) => { setSelectedId(id); openModal(); } },
];

<Table tableData={tableData} actions={tableActions} />

<RecordDetails
  isOpen={isOpen}
  onClose={closeModal}
  route="/api/employees"
  recordId={selectedId}
/>
```

The row action receives the row's id automatically — see [table.md](./table.md) — so you never have
to dig it out of the row yourself.

## The request

When the popup is open **and** `recordId` isn't `null`, it fetches:

```
GET ${route}/${recordId}
```

So `route="/api/employees"` and a row id of `42` hits `/api/employees/42`. Nothing is requested
before the popup opens, and the same record isn't re-requested if you reopen it within a minute.

The response is expected in the app's standard envelope:

```json
{
  "success": true,
  "messages": null,
  "result": [
    { "label": "Name",      "type": "string",     "value": "hy" },
    { "label": "Status",    "type": "enum",       "color": "success", "value": "Online" },
    { "label": "Rating",    "type": "rating",     "value": 5 },
    { "label": "Join date", "type": "date",       "value": "2026-08-19T00:00:00" },
    { "label": "Avatar",    "type": "image",      "value": "https://…/photo.jpg" },
    { "label": "Team",      "type": "imageGroup",
      "value": [{ "id": "t1", "name": "Omar Adel", "image": null }] }
  ]
}
```

`result` is an **array**, so the order you send the fields in is the order they're shown in.

## The field contract

Each entry in `result` describes one field:

- **`label`** — the caption shown above the value.
- **`value`** — the value itself; its shape depends on `type`.
- **`type`** — which renderer to use:

  | `type` | How it renders | Expected `value` |
  | --- | --- | --- |
  | `string` | Plain text. | A string |
  | `number` | Plain text. | A number |
  | `enum` | A colored [`Badge`](../../src/foundation/shared/components/badge.tsx). | The text to show, e.g. `"Online"` |
  | `rating` | Filled/empty stars out of 5. | A number |
  | `date` | Formatted for the user's locale. | An ISO date string |
  | `image` | A round avatar, falling back to the label's first letter when there's no image. | An image URL |
  | `imageGroup` | An overlapping avatar stack with a hover panel listing everyone. | `[{ id, name, image }]` |

- **`color`** — optional, and only used by `enum`. One of `primary`, `success`, `error`, `warning`,
  `info`, `light`, `dark`. Anything unrecognized falls back to `light`.

An unknown `type` is shown as plain text rather than breaking, so a new backend type won't take the
page down before the frontend catches up.

### Empty values

A field whose value is `null`, `undefined`, or `""` shows an em dash (`—`) instead of an empty badge
or a broken avatar. An `imageGroup` with an empty array does the same.

## Loading, errors and empty

- **Loading** — placeholder blocks in the same two-column grid as the real content, so the popup
  doesn't resize when the data lands.
- **Failed** — a short message and a **Try again** button inside the popup, plus an error
  [toast](./toast.md). Both a network/HTTP failure and a `success: false` body count as failed.
- **Nothing to show** — if `result` comes back as an empty array, the popup says so rather than
  rendering an empty grid.

## All the props

| Prop | Required? | What it does |
| --- | --- | --- |
| `isOpen` | Yes | Whether the popup is shown. You own this state. |
| `onClose` | Yes | Called when it should close — backdrop click, Escape, or the close button. |
| `route` | Yes | Base route. The record is fetched from `` `${route}/${recordId}` ``. |
| `recordId` | Yes | Id of the record to show, or `null` when nothing is selected. Nothing is fetched while this is `null`. |
| `title` | No | Heading override. Defaults to the `shared.recordDetails.title` translation. |

## One thing to know about images

An `image` (or `imageGroup`) whose value is an **external** URL needs that host allow-listed in
`next.config.ts`, because avatars render through `next/image`:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "your-api-host.com" }],
  },
};
```

Without it, Next throws at runtime when it tries to load the image. This is a one-time change when
you point the popup at a real backend — there's currently no `images` config in the app at all,
because every image in the mock data is `null`.
