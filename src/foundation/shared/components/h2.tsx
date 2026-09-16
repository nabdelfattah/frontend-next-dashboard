import { ReactNode } from 'react'

/**
 * Reusable secondary heading component.
 *
 * @param children - Content rendered inside the heading.
 * @param className - Additional classes merged onto the heading.
 *
 * @example
 * <H2>Section title</H2>
 */
export default function H2({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`text-base font-medium text-foreground ${className}`}>
      {children}
    </h2>
  )
}
