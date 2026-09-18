import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, timeZone } from "./routing";

export const namespaces = ["common", "nav", "dashboard", "auth", "shared"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const entries = await Promise.all(
    namespaces.map(
      async (ns) =>
        [ns, (await import(`../../messages/${locale}/${ns}.json`)).default] as const
    )
  );

  return {
    locale,
    timeZone,
    messages: Object.fromEntries(entries),
  };
});
