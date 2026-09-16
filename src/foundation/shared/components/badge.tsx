import React from "react";

type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

/**
 * Reusable status/label badge.
 *
 * Size isn't configurable: it's always `md`, and shrinks to `sm` on small screens.
 *
 * @param color - Badge color. Defaults to `"primary"`.
 * @param startIcon - Icon rendered before the text.
 * @param endIcon - Icon rendered after the text.
 * @param children - Badge content.
 *
 * @example
 * <Badge color="success">Active</Badge>
 */
const Badge: React.FC<BadgeProps> = ({
  color = "primary",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs sm:text-sm";

  // Define color styles — each resolves through CSS variables that flip in
  // dark mode (see globals.css), so no dark: variant is needed here.
  const colorStyles = {
    primary: "bg-accent text-accent-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    error: "bg-error-soft text-error-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    info: "bg-info-soft text-blue-light-500",
    light: "bg-muted text-secondary-foreground",
    dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
  };

  return (
    <span className={`${baseStyles} ${colorStyles[color]}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
