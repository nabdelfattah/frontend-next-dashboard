export type PrimaryColor =
  | "noir" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald"
  | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia"
  | "pink" | "rose";

export type SurfaceColor = "slate" | "gray" | "zinc" | "neutral" | "stone";

export interface ThemeConfig {
  primary: PrimaryColor;
  surface: SurfaceColor;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  primary: "blue",
  surface: "zinc",
};

export const PRIMARY_COLORS: PrimaryColor[] = [
  "noir", "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];

export const SURFACE_COLORS: SurfaceColor[] = ["slate", "gray", "zinc", "neutral", "stone"];

export const THEME_CONFIG_STORAGE_KEY = "app-theme-config";

// Swatch dot background — each color's own 500 shade; noir reuses the app's foreground gray.
export function getSwatchColor(color: PrimaryColor): string {
  if (color === "noir") return "var(--color-gray-900)";
  return `var(--color-${color}-500)`;
}

export function getSurfaceSwatchColor(surface: SurfaceColor): string {
  return `var(--color-${surface}-500)`;
}
