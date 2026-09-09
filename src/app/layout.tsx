import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@core/context/SidebarContext';
import { ThemeProvider } from '@core/context/ThemeContext';
import { ThemeConfigProvider } from '@core/context/ThemeConfigContext';
import { THEME_CONFIG_STORAGE_KEY } from '@/lib/theme-config';
import { LucideProvider } from 'lucide-react';

const outfit = Outfit({
  subsets: ["latin"],
});

// Applies the persisted primary/surface colors to <html> before first paint, so there's no
// flash of the default theme while React hydrates (same trick used for dark-mode class toggles).
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeConfigInitScript }} />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <ThemeConfigProvider>
            <LucideProvider strokeWidth={1.5}>
            <SidebarProvider>{children}</SidebarProvider>
            </LucideProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
