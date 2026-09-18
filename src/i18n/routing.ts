import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export type Locale = (typeof routing.locales)[number];

// Shared by the server request config and the client NextIntlClientProvider so
// date formatting matches between SSR and hydration.
export const timeZone = "UTC";
