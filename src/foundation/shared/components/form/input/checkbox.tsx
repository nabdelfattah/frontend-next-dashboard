"use client"
import type React from "react";
import { useEffect, useRef } from "react";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  /** Shows a dash instead of a checkmark (e.g. a "select all" header checkbox when only some rows are selected). Takes precedence over `checked`'s checkmark. */
  indeterminate?: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/**
 * Controlled checkbox with a custom checkmark, and an optional indeterminate
 * (dash) state for tri-state "select all" checkboxes.
 *
 * @param label - Optional label text shown next to the checkbox.
 * @param checked - Whether the checkbox is checked.
 * @param indeterminate - Renders a dash and fills the box, regardless of `checked`. Defaults to `false`.
 * @param id - Id applied to the underlying `<input>`.
 * @param onChange - Called with the new checked state.
 * @param className - Additional classes merged onto the `<input>`.
 * @param disabled - Disabled state. Defaults to `false`.
 *
 * @example
 * <Checkbox label="Remember me" checked={remember} onChange={setRemember} />
 */
const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  indeterminate = false,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`flex items-center space-x-3 group cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <div className="relative w-5 h-5">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          className={`w-5 h-5 appearance-none cursor-pointer border-input border checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60
          ${indeterminate ? "!border-transparent !bg-brand-500" : ""}
          ${className}`}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        {indeterminate ? (
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M2.33325 7H11.6666"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          checked && (
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                stroke="white"
                strokeWidth="1.94437"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        )}
        {disabled && (
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="#E4E7EC"
              strokeWidth="2.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
