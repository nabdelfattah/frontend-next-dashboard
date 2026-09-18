import GridShape from "@shared/components/common/grid-shape";
import NotFoundIllustration from "@shared/components/common/not-found-illustration";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import React from "react";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-foreground text-title-md xl:text-title-2xl">
          {t("title")}
        </h1>

        <NotFoundIllustration />

        <p className="mt-10 mb-6 text-base text-muted-foreground sm:text-lg">
          {t("message")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-input bg-card px-5 py-3.5 text-sm font-medium text-muted-foreground shadow-theme-xs hover:bg-muted hover:text-foreground"
        >
          {t("backHome")}
        </Link>
      </div>
      {/* <!-- Footer --> */}
      <p className="absolute text-sm text-center text-muted-foreground -translate-x-1/2 bottom-6 left-1/2">
        {t("footer", { year: new Date().getFullYear() })}
      </p>
    </div>
  );
}
