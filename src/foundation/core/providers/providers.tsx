"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { NextIntlClientProvider } from "next-intl";
import type { getMessages } from "next-intl/server";
import { timeZone, type Locale } from "@/i18n/routing";
import { DirectionProvider } from "./direction-provider";
import { ToastProvider } from "./toast-provider";
import { SidebarProvider } from "./sidebar-provider";
import { ThemeProvider } from "./theme-provider";
import { ThemeConfigProvider } from "./theme-config-provider";

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
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <DirectionProvider dir={direction}>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <ThemeProvider>
              <ThemeConfigProvider>
                <SidebarProvider>
                  <ToastProvider>{children}</ToastProvider>
                </SidebarProvider>
              </ThemeConfigProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </QueryClientProvider>
      </DirectionProvider>
    </NextIntlClientProvider>
  );
}
