import Script from "next/script";
import React from "react";
import { THEME_CONFIG_STORAGE_KEY } from "@/lib/theme-config";

// Applies the persisted primary/surface colors to <html> before first paint, so there's no
// flash of the default theme while React hydrates (same trick used for dark-mode class toggles).
// Uses next/script (not a plain <script> tag) and lives in the true root layout, since
// beforeInteractive scripts are only supported there and next/script avoids React's
// "encountered a script tag while rendering" warning that a literal <script> element triggers.
const themeConfigInitScript = `
(function () {
  try {
    var stored = JSON.parse(localStorage.getItem('${THEME_CONFIG_STORAGE_KEY}') || 'null');
    var config = Object.assign({ primary: 'violet', surface: 'zinc' }, stored || {});
    var root = document.documentElement;
    root.setAttribute('data-primary', config.primary);
    root.setAttribute('data-surface', config.surface);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="theme-config-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: themeConfigInitScript }}
      />
      {children}
    </>
  );
}
