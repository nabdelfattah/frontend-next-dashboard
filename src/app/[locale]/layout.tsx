import { Outfit, Cairo } from "next/font/google";
import "../globals.css";
import "flatpickr/dist/flatpickr.css";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { THEME_CONFIG_STORAGE_KEY } from "@/lib/theme-config";
import { Providers } from "@core/providers/providers";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-outfit",
});

// Applies the persisted primary/surface colors to <html> before first paint, so there's no
// flash of the default theme while React hydrates (same trick used for dark-mode class toggles).
// Uses next/script with beforeInteractive (not a plain <script> tag) so React doesn't warn about
// encountering a raw script element on client re-renders; it must live alongside the actual
// <head> below for its hoisting to resolve, which is why it can't sit in the disconnected
// true root layout (src/app/layout.tsx has no <html>/<head> of its own).
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontVariable = locale === "ar" ? cairo.variable : outfit.variable;

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={fontVariable}
    >
      <head>
        <Script
          id="theme-config-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeConfigInitScript }}
        />
      </head>
      <body className="dark:bg-gray-900">
        <Providers direction={dir} locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
