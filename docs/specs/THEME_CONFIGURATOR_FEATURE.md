# Theme Configurator Feature — Next.js + Tailwind Implementation Spec

Ported from an Angular + PrimeNG reference implementation to a **Next.js (App Router) + Tailwind
CSS v4 + shadcn/ui** stack. The original used PrimeNG's `@primeuix/themes` runtime theming
engine; since this project has no PrimeNG, the feature is reimplemented with plain **CSS custom
properties** — the same mechanism shadcn/ui itself uses for theming. No extra theming library is
required.

## 1. Feature overview

A palette-icon button opens a popover with:
1. **Primary color** — a row of color swatch buttons (accent/brand hue).
2. **Surface color** — a row of neutral swatch buttons (controls background/border/muted grays).
3. *(A separate button elsewhere, not in this popover)* — dark/light mode toggle.

Picking a swatch updates CSS custom properties on `<html>` immediately (no reload), and the
choice persists across visits via `localStorage` (+ a tiny blocking script so there's no
flash-of-wrong-theme on load).

There is **no "preset" (Aura/Lara/Nora) concept** in this port — that existed only because
PrimeNG ships multiple parallel component-design-systems. With Tailwind/shadcn there is one
design system, so it's dropped. There's also no "menu mode" control here — that was specific to
the source project's admin sidebar; add it only if this project has an equivalent layout toggle.

## 2. Core mechanism: attribute-driven CSS variables

Instead of a JS theming engine rewriting tokens, define the color variants as CSS rules keyed off
a `data-*` attribute on `<html>`, and let a tiny bit of JS just set that attribute:

```
<html data-primary="blue" data-surface="zinc" class="dark">
```

```css
/* globals.css */
:root {
  --primary: var(--color-blue-500);
  --primary-foreground: oklch(1 0 0); /* white */
  --ring: var(--color-blue-500);
}
.dark {
  --primary: var(--color-blue-400);
  --primary-foreground: var(--color-zinc-900);
  --ring: var(--color-blue-400);
}

[data-primary="rose"] {
  --primary: var(--color-rose-500);
  --primary-foreground: oklch(1 0 0);
  --ring: var(--color-rose-500);
}
[data-primary="rose"].dark {
  --primary: var(--color-rose-400);
  --primary-foreground: var(--color-zinc-900);
  --ring: var(--color-rose-400);
}
/* ...repeat per color, see §4 for the generator instead of hand-writing all of these */
```

**Why this works with zero extra color data to maintain:** Tailwind CSS v4 auto-generates a
`--color-{name}-{shade}` CSS variable for **every shade of every color in its default palette**
the moment you `@import "tailwindcss"` — you never need to hand-copy hex codes. `var(--color-blue-500)`
is always available. This is the direct equivalent of the Angular version reading
`preset.primitive.blue` at runtime — except here the palette is just... Tailwind's palette,
available natively as CSS variables, at build time.

## 3. Data model

```ts
// lib/theme-config.ts
export type PrimaryColor =
  | 'noir' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald'
  | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

export type SurfaceColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';

export interface ThemeConfig {
  primary: PrimaryColor;
  surface: SurfaceColor;
  darkTheme: boolean;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primary: 'violet', // pick your brand default
  surface: 'zinc',
  darkTheme: false
};

export const PRIMARY_COLORS: PrimaryColor[] = [
  'noir', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
];

export const SURFACE_COLORS: SurfaceColor[] = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
```

This is the direct equivalent of the Angular `LayoutConfig` interface, minus `preset` and
`menuMode`. 18 primary options (Tailwind's 17 chromatic colors + `noir`, a neutral/black-white
option, mirroring the source project's special case) and the 5 Tailwind-native neutral scales as
surface options (the source project also had 3 custom brand ramps, `soho`/`viva`/`ocean` — add
those the same way if wanted: just append full custom hex scales in Tailwind's `@theme` block,
see §6).

## 4. Swatch preview color per primary option

For the swatch button's own background (a solid dot), use each color's `500` shade, with `noir`
rendered as the current foreground color (matches the Angular version's `var(--text-color)` trick):

```ts
// lib/theme-config.ts (continued)
export function getSwatchColor(color: PrimaryColor): string {
  if (color === 'noir') return 'var(--foreground)';
  return `var(--color-${color}-500)`;
}
```

For **text-on-primary contrast**, most Tailwind hues read fine with white text at shade 500, but
a few stay light enough that they need dark text instead. Use an explicit exceptions list rather
than computing contrast at runtime:

```ts
const LIGHT_TEXT_EXCEPTIONS = new Set<PrimaryColor>(['yellow', 'lime', 'amber']);

export function getPrimaryForeground(color: PrimaryColor, dark: boolean): string {
  if (color === 'noir') return dark ? 'var(--color-zinc-50)' : 'var(--color-zinc-950)';
  return LIGHT_TEXT_EXCEPTIONS.has(color) ? 'var(--color-zinc-950)' : 'oklch(1 0 0)';
}
```

## 5. Generating the CSS instead of hand-writing 18 blocks

Hand-writing 18 colors × light/dark × 3 tokens (`--primary`, `--primary-foreground`, `--ring`) is
54 CSS rules — mechanical and error-prone to type by hand. Generate them once with a small script
and commit the output, rather than maintaining them by hand:

```js
// scripts/generate-theme-css.mjs
import { PRIMARY_COLORS } from '../lib/theme-config.ts'; // or hardcode the list here

const LIGHT_TEXT_EXCEPTIONS = new Set(['yellow', 'lime', 'amber']);

let css = '';
for (const color of PRIMARY_COLORS) {
  if (color === 'noir') {
    css += `
[data-primary="noir"] {
  --primary: var(--foreground);
  --primary-foreground: var(--background);
  --ring: var(--foreground);
}`;
    continue;
  }
  const fg = LIGHT_TEXT_EXCEPTIONS.has(color) ? 'var(--color-zinc-950)' : 'oklch(1 0 0)';
  const darkFg = 'var(--color-zinc-950)';
  css += `
[data-primary="${color}"] {
  --primary: var(--color-${color}-500);
  --primary-foreground: ${fg};
  --ring: var(--color-${color}-500);
}
[data-primary="${color}"].dark {
  --primary: var(--color-${color}-400);
  --primary-foreground: ${darkFg};
  --ring: var(--color-${color}-400);
}`;
}

console.log(css);
```

Run once (`node scripts/generate-theme-css.mjs >> src/app/theme-colors.css`) and import the
generated file from `globals.css`. This mirrors the Angular version's `getPresetExtension()` —
except there it ran on every click at runtime (because PrimeNG's engine works that way); here it
only needs to run once at build/dev time, because the CSS variables approach lets the browser do
the "runtime" switching for free via the attribute selector — flipping `data-primary` is enough,
no JS re-computation needed per click.

## 6. Surface colors — reuse shadcn's own base-color themes

The 5 Tailwind-native surface names (`slate`, `gray`, `zinc`, `neutral`, `stone`) are **exactly**
shadcn/ui's own "base color" choices. Don't hand-author these — run:

```
npx shadcn@latest init
```

and pick a base color; the CLI writes the full official variable set (`--background`,
`--foreground`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--border`,
`--input`, etc., for both light and dark) into `globals.css`. To support switching between all 5
at runtime instead of picking one at init time, wrap each generated block in an attribute
selector the same way as §5:

```css
[data-surface="zinc"] { /* the exact vars the shadcn CLI generated for the zinc base color */ }
[data-surface="zinc"].dark { /* ...and its dark variant */ }
[data-surface="slate"] { /* re-run `shadcn init` (or the theme generator) picking "slate", copy its output here */ }
/* ...gray, neutral, stone */
```

Practical path: run `shadcn init` five times (once per base color, in a scratch project or
branch), copy each generated `:root`/`.dark` block into one of these attribute-scoped rules, then
discard the scratch output. This guarantees pixel-correct, official values instead of
hand-transcribed ones.

If you also want the source project's 3 custom brand ramps (`soho`, `viva`, `ocean`), add them as
full custom Tailwind colors in the `@theme` block first:

```css
@theme {
  --color-soho-50: #ececec; --color-soho-100: #dedfdf; --color-soho-200: #c4c4c6;
  --color-soho-300: #adaeb0; --color-soho-400: #97979b; --color-soho-500: #7f8084;
  --color-soho-600: #6a6b70; --color-soho-700: #55565b; --color-soho-800: #3f4046;
  --color-soho-900: #2c2c34; --color-soho-950: #16161d;
  /* viva, ocean similarly */
}
```

then write `[data-surface="soho"]` blocks by hand, substituting `--color-soho-*` wherever the
shadcn-generated `zinc` block references `--color-zinc-*`.

## 7. Theme provider (state + apply + persist)

```tsx
// components/theme-config-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeConfig, DEFAULT_THEME_CONFIG, PrimaryColor, SurfaceColor } from '@/lib/theme-config';

const STORAGE_KEY = 'app-theme-config';

interface ThemeConfigContextValue {
  config: ThemeConfig;
  setPrimary: (primary: PrimaryColor) => void;
  setSurface: (surface: SurfaceColor) => void;
  toggleDark: () => void;
}

const ThemeConfigContext = createContext<ThemeConfigContextValue | null>(null);

export function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);

  // Read persisted config on mount (after the anti-FOUC script already applied it to <html>).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setConfig(JSON.parse(stored));
    } catch {
      // localStorage unavailable (SSR/private mode) — fall back to defaults silently.
    }
  }, []);

  // Apply to <html> + persist whenever config changes.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-primary', config.primary);
    root.setAttribute('data-surface', config.surface);
    root.classList.toggle('dark', config.darkTheme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore write failures (e.g. storage quota, private mode)
    }
  }, [config]);

  const setPrimary = (primary: PrimaryColor) => setConfig((c) => ({ ...c, primary }));
  const setSurface = (surface: SurfaceColor) => setConfig((c) => ({ ...c, surface }));
  const toggleDark = () => setConfig((c) => ({ ...c, darkTheme: !c.darkTheme }));

  return (
    <ThemeConfigContext.Provider value={{ config, setPrimary, setSurface, toggleDark }}>
      {children}
    </ThemeConfigContext.Provider>
  );
}

export function useThemeConfig() {
  const ctx = useContext(ThemeConfigContext);
  if (!ctx) throw new Error('useThemeConfig must be used within ThemeConfigProvider');
  return ctx;
}
```

Note this persists **all three** settings (primary/surface/dark), unlike the Angular source which
only persisted dark mode. That's a deliberate improvement — there was no technical reason the
original didn't persist the rest; it's simply cheap to do here since it's one JSON blob.

### Anti-flash-of-wrong-theme script

React can't set the attribute before first paint, so add a tiny blocking inline script in the
root layout `<head>`, before any content renders — this is the same trick `next-themes` uses for
dark mode, extended to cover the primary/surface attributes too:

```tsx
// app/layout.tsx
const themeInitScript = `
(function () {
  try {
    var stored = JSON.parse(localStorage.getItem('app-theme-config') || 'null');
    var config = stored || { primary: 'violet', surface: 'zinc', darkTheme: false };
    var root = document.documentElement;
    root.setAttribute('data-primary', config.primary);
    root.setAttribute('data-surface', config.surface);
    if (config.darkTheme) root.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeConfigProvider>{children}</ThemeConfigProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is required because the script mutates attributes React
didn't render server-side — same reason `next-themes` requires it.

## 8. Configurator popover component

```tsx
// components/theme-configurator.tsx
'use client';

import { useThemeConfig } from './theme-config-provider';
import { PRIMARY_COLORS, SURFACE_COLORS, getSwatchColor } from '@/lib/theme-config';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeConfigurator() {
  const { config, setPrimary, setSurface } = useThemeConfig();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme settings">
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4">
        <div>
          <span className="text-sm font-semibold text-muted-foreground">Primary</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRIMARY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => setPrimary(color)}
                className={cn(
                  'size-5 shrink-0 rounded-full shadow',
                  config.primary === color && 'outline outline-2 outline-offset-1 outline-primary'
                )}
                style={{ backgroundColor: getSwatchColor(color) }}
              />
            ))}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold text-muted-foreground">Surface</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {SURFACE_COLORS.map((surface) => (
              <button
                key={surface}
                type="button"
                title={surface}
                onClick={() => setSurface(surface)}
                className={cn(
                  'size-5 shrink-0 rounded-full',
                  config.surface === surface && 'outline outline-2 outline-offset-1 outline-primary'
                )}
                style={{ backgroundColor: `var(--color-${surface}-500)` }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## 9. Dark mode toggle (separate button, same as source)

Use `next-themes` for this half (it already solves the anti-flash problem for `class="dark"`
specifically) **or** reuse the same `useThemeConfig().toggleDark()` if you'd rather keep one
system for both. If mixing with `next-themes`, make sure only one piece of code owns the `dark`
class to avoid the two fighting each other.

```tsx
// components/theme-switcher.tsx
'use client';

import { useThemeConfig } from './theme-config-provider';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeSwitcher() {
  const { config, toggleDark } = useThemeConfig();
  return (
    <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
      {config.darkTheme ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
}
```

## 10. Wiring into a topbar

```tsx
<div className="flex items-center gap-1">
  <ThemeSwitcher />
  <ThemeConfigurator />
</div>
```

## 11. Summary of every configurable option

| Control | Values | Persisted? |
|---|---|---|
| Primary color | `noir, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose` (18) | Yes — one `localStorage` JSON blob |
| Surface color | `slate, gray, zinc, neutral, stone` (5; add `soho`/`viva`/`ocean` per §6 if wanted) | Yes |
| Dark/light mode | boolean, mirrored to `<html class="dark">` | Yes |

## 12. Key differences from the Angular/PrimeNG source, and why

| Source (PrimeNG) | This port (Tailwind/shadcn) | Reason |
|---|---|---|
| `@primeuix/themes` runtime engine (`updatePreset`, `$t()...use()`) | Plain CSS custom properties + `data-*` attribute selectors | No PrimeNG theming engine exists here; CSS variables are the native Tailwind/shadcn equivalent and need no runtime library |
| Presets: Aura / Lara / Nora | Dropped | Those are parallel PrimeNG component-design-systems; Tailwind/shadcn has one design system |
| Primary palette read from `preset.primitive` at runtime | Read from Tailwind's auto-generated `--color-*` variables at CSS-authoring time via a one-off generator script | Tailwind v4 already exposes the full palette as CSS variables — no need for a JS palette API |
| Only dark mode persisted | All three settings persisted | No technical reason not to; it's one JSON blob either way |
| `getPresetExtension()` re-run on every click | Static generated CSS, attribute flip only | The "engine" work happens once at build time instead of per click, since the browser's CSS cascade does the switching |
