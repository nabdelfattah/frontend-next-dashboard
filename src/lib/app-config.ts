export const ENVIRONMENTS = ["local", "development", "staging", "production"] as const;

export type AppEnvironment = (typeof ENVIRONMENTS)[number];

export const DEFAULT_ENVIRONMENT: AppEnvironment = "local";

/**
 * API base URL for each environment. Edit the remote URLs here.
 *
 * `local` is served by this app itself (mock data under `public/api`), so its
 * base is a same-origin path. Every other environment points at a real backend.
 */
export const API_BASE_URLS: Record<AppEnvironment, string> = {
  local: "/api",
  development: "https://api.dev.example.com",
  staging: "https://api.staging.example.com",
  production: "https://api.example.com",
};

function resolveEnvironment(): AppEnvironment {
  // Must be read as a literal `process.env.NEXT_PUBLIC_*` so Next.js inlines it
  // into the client bundle at build time.
  const value = process.env.NEXT_PUBLIC_APP_ENV;
  if (!value) return DEFAULT_ENVIRONMENT;

  if (!(ENVIRONMENTS as readonly string[]).includes(value)) {
    // Fail loudly: silently falling back to `local` could ship a production
    // build that serves mock data.
    throw new Error(
      `Invalid NEXT_PUBLIC_APP_ENV "${value}". Expected one of: ${ENVIRONMENTS.join(", ")}.`
    );
  }
  return value as AppEnvironment;
}

export const APP_ENV: AppEnvironment = resolveEnvironment();

export const API_BASE_URL: string = API_BASE_URLS[APP_ENV];

/**
 * Builds the endpoint URL for a feature in the active environment.
 *
 * @example
 * getApiUrl("trips");    // local: "/api/trips" · production: "https://api.example.com/trips"
 * getApiUrl("/trips/7"); // leading slash is fine
 */
export function getApiUrl(feature: string): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = feature.replace(/^\/+/, "");
  return `${base}/${path}`;
}
