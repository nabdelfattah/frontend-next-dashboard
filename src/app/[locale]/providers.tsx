"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DirectionProvider } from "@shared/components/ui/direction";

export function Providers({
  children,
  direction,
}: {
  children: React.ReactNode;
  direction: "ltr" | "rtl";
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <DirectionProvider dir={direction}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </DirectionProvider>
  );
}
