import { ReactNode } from 'react'

/**
 * Reusable secondary/body text component.
 *
 * @param children - Text content.
 * @param className - Additional classes merged onto the paragraph.
 *
 * @example
 * <Text>Supporting description text.</Text>
 */
export default function Text({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`mt-1 text-theme-sm font-normal text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}
