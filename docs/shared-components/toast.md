# Toast

**File:** `src/foundation/shared/stores/toast-store.ts` (the `showToast` function) and
`src/foundation/core/providers/toast-provider.tsx` (renders the toasts it pushes)

A way to pop up a short-lived notification — "Saved", "Something went wrong", etc. — from
anywhere in the code, without needing to be inside a React component.

## The big idea

Most things you'd reach for to show a toast are React hooks, which only work inside a component.
`showToast` is a **plain function** instead, so it works just as well inside an event handler, an
API response callback, or a `.then()`/`.catch()` — anywhere a "this action just happened, tell the
user" moment can occur:

```ts
import { showToast } from "@shared/stores/toast-store";

showToast({
  variant: "success",
  title: "Saved",
  message: "Changes saved successfully.",
});
```

That's it — no setup needed at the call site. A `ToastProvider` is already mounted once near the
root of the app (in `providers.tsx`), and renders whatever `showToast` pushes.

## Variants

`variant` picks the color/icon, reusing the same four variants as the shared `Alert` component
(`src/foundation/shared/components/alert.tsx`) — `Alert` is in fact what a toast renders *as*:

| `variant` | Use it for |
| --- | --- |
| `success` | An action completed. |
| `error` | An action failed. |
| `warning` | Something the user should be aware of, but isn't necessarily an error. |
| `info` | Anything else worth surfacing. |

## Behavior

- **Auto-dismisses after 3 seconds.** Hovering or focusing a toast pauses the timer; it resumes
  once you stop.
- **Swipe-to-dismiss** on touch devices.
- **Multiple toasts stack** — each `showToast` call adds one, independent of any still showing.
- **Positioned at the top end of the screen** — top-right for `ltr`, top-left for `rtl` —
  automatically, following the app's current direction.
- Announced to screen readers (the visible content doubles as an accessible name/description),
  even though the visible `Alert` itself doesn't carry that markup on its own.

## Example: reporting a failed request

```ts
try {
  await fetch(route);
} catch {
  showToast({
    variant: "error",
    title: t("searchFailedTitle"),
    message: t("searchFailedMessage"),
  });
}
```

(This is exactly how `SearchToolbar` reports a failed search.)

## All the API

`showToast(toast)` — `toast` is:

| Field | Required? | What it does |
| --- | --- | --- |
| `variant` | Yes | `"success" \| "error" \| "warning" \| "info"` — picks the color/icon. |
| `title` | Yes | Bold heading text. |
| `message` | Yes | Body text below the title. |

There's no `duration`/`id`/dismiss-handle to pass or manage — every toast is fixed at 3 seconds and
dismisses (and gets removed from state) on its own.

### If you need the raw store

`useToastStore` (from the same file) is the underlying Zustand store `showToast` is bound to — a
real hook, if a component needs to reactively read the current toast queue (`state.toasts`) or
dismiss one early (`state.dismissToast(id)`). Everyday usage never needs this — `showToast` alone
covers it.
