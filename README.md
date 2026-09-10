# TailAdmin Enhanced Next.js Dashboard

This project is a customized version of the free **TailAdmin** Next.js dashboard. It's the base template for our internal admin panel.

## What's different from the original TailAdmin

* 🌐 **Localization + RTL** — supports English and Arabic (`en`, `ar`) via `next-intl`. Arabic text uses the Cairo font.
* 🎨 **Theme color picker** — users can change the primary and surface colors, not just light/dark mode.
* 🏗️ **Clean architecture folder structure** — code is organized by feature/domain instead of TailAdmin's original layout.
* ✨ **Custom icon set** — local Font Awesome SVGs (`src/assets/icons`) instead of an icon component library.

## Tech Stack

**Core**
* **Next.js 16** (App Router) + **React 19** + **TypeScript**
* **Tailwind CSS 4** — utility-first styling
* **next-intl** — localization and RTL routing

**Data & Forms**
* **TanStack Query** — fetching, caching, and syncing server data
* **Zustand** — lightweight global state for client-only UI state
* **nuqs** — type-safe state synced to the URL query string
* **React Hook Form + Zod** — form state and schema-based validation

**UI Components**
* **shadcn/ui** — owned (copy-in) UI components built on Radix primitives and Tailwind, RTL-aware
* Legacy hand-built components from the original TailAdmin template (`src/components/ui`) — see note below

**Charts & Media**
* **ApexCharts** — charts
* **FullCalendar** — calendar
* **react-dnd** — drag and drop (e.g. Kanban boards)
* **react-dropzone** — file upload drop zones
* **flatpickr** — date picker
* **swiper** — carousels/sliders
* **@react-jvectormap** — interactive maps

**Tooling**
* **ESLint** — linting
* **@floating-ui/react** — positioning for dropdowns/tooltips/popovers

> ℹ️ **Two UI kits, on purpose (for now):** `src/components/ui` holds the original hand-built TailAdmin components (Button, Table, Modal, etc.), while `src/foundation/shared/components/ui` holds new components added via `npx shadcn@latest add <name>`. Prefer shadcn for new work — it's Radix-based, RTL-aware out of the box, and easier to extend. Don't mix the two inside the same component.

### Using TanStack Query, Zustand, and nuqs

These don't need extra setup per feature — just import and use:

* **TanStack Query**: `useQuery` / `useMutation` from `@tanstack/react-query` anywhere — the provider is already wired in `src/app/[locale]/providers.tsx`.
* **Zustand**: create a store where you need one, e.g. `export const useMyStore = create<MyState>((set) => ({ ... }))` — no provider needed since it's just client-only UI state.
* **nuqs**: `useQueryState` from `nuqs` to sync a piece of state to the URL — the adapter is already wired in the same `providers.tsx`.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

   > If you hit a peer-dependency error, use `npm install --legacy-peer-deps`.

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

We follow a **clean architecture** style: shared/reusable pieces live in `foundation`, and feature-specific logic lives in `domains`. Each domain can have up to four layers:

* `domain` — core business types/rules for that feature
* `application` — use cases / logic that orchestrates the domain
* `infrastructure` — API calls, data fetching, external services
* `presentation` — React components, pages, hooks for the UI

```
📦src
 ┣ 📂app                     # Next.js App Router (routes, layouts)
 ┃ ┗ 📂[locale]              # every route is nested under a locale (en/ar)
 ┃   ┣ 📂(admin)             # protected/admin pages
 ┃   ┗ 📂(full-width-pages)
 ┃     ┗ 📂(auth)            # sign in / sign up pages
 ┣ 📂domains                 # feature-specific code (see layers above)
 ┃ ┗ 📂auth
 ┃   ┗ 📂presentation
 ┣ 📂foundation              # shared building blocks used across domains
 ┃ ┣ 📂core/context          # React contexts (theme, etc.)
 ┃ ┣ 📂layout                # header, sidebar, app shell
 ┃ ┗ 📂shared                # shared components, hooks, utils, types, constants
 ┣ 📂i18n                    # next-intl config (routing, navigation, request)
 ┣ 📂assets                  # images and icons
 ┣ 📂lib
 ┃ ┗ 📜theme-config.ts       # available theme colors
 ┗ 📂types
   ┗ 📜global.d.ts
```

> 💡 **Rule of thumb:** if code is reused across multiple features, put it in `foundation/shared`. If it belongs to one feature, put it in its own folder under `domains`.

## Localization

* Locales live in `src/i18n/routing.ts` — currently `en` and `ar`.
* Every page is nested under `/[locale]/...`, so new pages should stay inside that folder.
* Translation strings go through `next-intl`. They live in `messages/<locale>/<feature>.json` (e.g. `messages/en/auth.json`, `messages/ar/auth.json`).
* **Every new feature must add its own translation file** for each locale (e.g. `messages/en/billing.json` + `messages/ar/billing.json`) — don't dump strings into `common.json`.

## Documentation

We keep written docs next to the code they describe, under `docs/`:

* `docs/shared/` — one doc per shared/reusable component (anything living in `foundation`). Explain what it does, its props, and a usage example.
* `docs/features/` — one doc per feature/domain (anything living in `domains`). Explain what the feature does and how its pieces fit together.

Adding a new shared component or feature? Add its doc in the matching folder as part of the same PR.

## Icons

**Font Awesome only** — don't add another icon library (lucide, heroicons, etc.), even as a dependency of a third-party component. If a component you add pulls in its own icon library, swap those icons out for the ones below before merging.

To add a new icon:

1. Download the SVG from [here](https://drive.google.com/file/d/1aKMby-MSYDqTjScApVByYi0SDq2Ag6_4/view?usp=sharing) and drop it into `src/assets/icons` (e.g. `trash.svg`).
2. Export it from `src/assets/icons/index.tsx`:
   ```ts
   import Trash from "./trash.svg";
   export { Trash, /* ...other icons */ };
   ```
3. Import it from the barrel file, not the `.svg` directly:
   ```ts
   import { Trash } from "@/assets/icons";
   ```

## Theming

* Users can pick a primary color and a surface (neutral) color — see `src/lib/theme-config.ts` for the full list of options.
* Dark mode is also supported, on top of the color picker.

## About the Original TailAdmin

This project started from the free TailAdmin dashboard template.

* [Live Demo](https://nextjs-free-demo.tailadmin.com)
* [Website](https://tailadmin.com)
* [Docs](https://tailadmin.com/docs)

If you want to compare against the untouched original template:

```bash
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard.git
```

> Windows users: clone it near the root of your drive (e.g. `C:\dev\`) to avoid path-length issues.
