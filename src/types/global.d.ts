import type { routing } from "@/i18n/routing";
import type common from "../../messages/en/common.json";
import type nav from "../../messages/en/nav.json";
import type dashboard from "../../messages/en/dashboard.json";
import type auth from "../../messages/en/auth.json";
import type shared from "../../messages/en/shared.json";

type Messages = {
  common: typeof common;
  nav: typeof nav;
  dashboard: typeof dashboard;
  auth: typeof auth;
  shared: typeof shared;
};

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
