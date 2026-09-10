// Fallback for the rare case where Next.js can't resolve the `[locale]` segment
// before rendering (so `src/app/[locale]/not-found.tsx` never gets a chance to run).

import GridShape from "@/components/common/grid-shape";
import NotFoundIllustration from "@/components/common/not-found-illustration";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// This must be fully self-contained since the root layout has no <html>/<body>.
export default async function GlobalNotFound() {
  const t = await getTranslations("common.notFound");
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          gap: "1rem",
        }}
      >
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          {t("title")}
        </h1>

        <NotFoundIllustration />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          {t("message")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          {t("backHome")}
        </Link>
      </div>
      {/* <!-- Footer --> */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        {t("footer", { year: new Date().getFullYear() })}
      </p>
    </div>
      </body>
    </html>
  );
}
