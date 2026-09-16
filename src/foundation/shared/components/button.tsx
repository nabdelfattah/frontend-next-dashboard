import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "ghost";
  type?: "button" | "submit";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * Reusable button component.
 *
 * @param children - Button text or content.
 * @param size - Button size, "sm" or "md". Defaults to `"md"`.
 * @param variant - Button variant, "primary", "outline" or "ghost". Defaults to `"primary"`.
 * @param type - "submit" or "button".
 * @param startIcon - Icon rendered before the text.
 * @param endIcon - Icon rendered after the text.
 * @param onClick - Click handler.
 * @param disabled - Disabled state. Defaults to `false`.
 * @param loading - Loading state. Renders a spinner in place of `startIcon` and applies the disabled style. Defaults to `false`.
 * @param className - Additional classes merged onto the button.
 *
 * @example
 * <Button variant="outline" size="sm" onClick={handleSave}>
 *   Save
 * </Button>
 */
const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  type = "button",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loading = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-card text-muted-foreground ring-1 ring-inset ring-input hover:bg-muted hover:text-foreground",
    ghost:
      "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition m-0 ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled || loading ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="flex items-center" aria-hidden="true">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      ) : (
        startIcon && <span className="flex items-center">{startIcon}</span>
      )}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
