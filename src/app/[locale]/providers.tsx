"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from "next-intl";
import type { getMessages } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DirectionProvider } from "@shared/components/ui/direction";
import { SidebarProvider } from "@core/context/sidebar-context";
import { ThemeProvider } from "@core/context/theme-context";
import { ThemeConfigProvider } from "@core/context/theme-config-context";

export function Providers({
  children,
  direction,
  locale,
  messages,
}: {
  children: React.ReactNode;
  direction: "ltr" | "rtl";
  locale: Locale;
  messages: Awaited<ReturnType<typeof getMessages>>;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DirectionProvider dir={direction}>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <ThemeProvider>
              <ThemeConfigProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeConfigProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
