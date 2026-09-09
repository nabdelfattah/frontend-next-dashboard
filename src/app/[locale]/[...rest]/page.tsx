import { notFound } from "next/navigation";

// Catches any path that doesn't match a real route under a valid locale, so it
// resolves through `[locale]/layout.tsx` and renders the localized, dir-aware
// `[locale]/not-found.tsx` instead of Next's bare root fallback.
export default function CatchAll() {
  notFound();
}
