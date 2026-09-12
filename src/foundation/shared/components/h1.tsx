import { ReactNode } from "react";

/**
 * Reusable primary heading component.
 *
 * @param children - Content rendered inside the heading.
 *
 * @example
 * <H1>Dashboard</H1>
 */
export default function H1({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
      {children}
    </h1>
  );
}


