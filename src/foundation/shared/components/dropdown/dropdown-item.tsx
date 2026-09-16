import type React from "react";
import { Link } from "@/i18n/navigation";

interface DropdownItemProps {
  tag?: "a" | "button";
  href?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A single selectable entry inside a `Dropdown` panel. Renders as a `Link` when `tag="a"`
 * and `href` is provided, otherwise as a `button`.
 *
 * @param tag - `"a"` to render a link, `"button"` to render a button. Defaults to `"button"`.
 * @param href - Target path. Required (together with `tag="a"`) to render as a link.
 * @param onClick - Handler for the item's own action.
 * @param onItemClick - Called after `onClick`, regardless of `tag` — typically used to close the parent `Dropdown`.
 * @param baseClassName - Base classes for the item. Defaults to the standard dropdown item look.
 * @param className - Additional classes merged onto `baseClassName`.
 * @param children - Item content (label, optionally preceded by an icon).
 *
 * @example
 * <DropdownItem tag="a" href="/profile" onItemClick={closeDropdown}>
 *   Edit profile
 * </DropdownItem>
 */
export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  href,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-start px-4 py-2 text-sm text-[var(--muted-foreground)] hover:bg-muted2 transition hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a" && href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
