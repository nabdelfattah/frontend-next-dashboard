import GridShape from "@/components/common/grid-shape";
import {ThemeToggleButton} from "@/components/common/theme-toggle-button";

import { ThemeProvider } from "@core/context/theme-context";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { DropdownGroupProvider } from "@layout/header/dropdown-group-context";
import LanguageSwitcher from "@layout/header/language-switcher";
import ThemeConfigurator from "@layout/header/theme-configurator";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth.layout");

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 end-6 z-50 hidden items-center gap-3 sm:flex">
            <DropdownGroupProvider>
              <ThemeConfigurator />
              <LanguageSwitcher />
            </DropdownGroupProvider>
            <ThemeToggleButton />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
