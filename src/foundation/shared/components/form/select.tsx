"use client";
import React, { useRef, useState } from "react";
import { Dropdown } from "../dropdown/dropdown";
import { DropdownItem } from "../dropdown/dropdown-item";
import useDropdownToggle from "../../hooks/use-dropdown-toggle";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

/**
 * Reusable select dropdown. Its trigger looks like a native `<select>`, but the
 * options panel is the shared `Dropdown`, so it's styled consistently with the
 * rest of the app's dropdowns instead of the browser's unstyleable native one.
 *
 * @param options - Selectable options (`value`, `label`).
 * @param placeholder - Text shown on the trigger when nothing is selected. Defaults to `"Select an option"`.
 * @param onChange - Called with the newly selected value.
 * @param className - Additional classes merged onto the trigger.
 * @param defaultValue - Initially selected value. Defaults to `""` (the placeholder).
 *
 * @example
 * <Select
 *   options={[{ value: "admin", label: "Admin" }]}
 *   onChange={setRole}
 * />
 */
const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const { isOpen, toggle, close } = useDropdownToggle();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find(
    (option) => option.value === selectedValue
  )?.label;

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="relative">
      <button
        ref={anchorRef}
        type="button"
        onClick={toggle}
        className={`dropdown-toggle flex h-11 w-full items-center justify-between rounded-lg border border-input bg-input-background px-4 py-2.5 text-start text-sm shadow-theme-xs outline-hidden transition focus:border-focus-brand focus:ring-3 focus:ring-brand-500/10 ${
          selectedLabel
            ? "text-foreground"
            : "text-muted-foreground"
        } ${className}`}
      >
        <span className="truncate">{selectedLabel ?? placeholder}</span>
        <svg
          className={`ms-2 shrink-0 stroke-current transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={close}
        anchorRef={anchorRef}
        placement="bottom-start"
        className="flex min-w-[12rem] flex-col gap-1 p-2"
      >
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            onItemClick={close}
            className={`rounded-lg ${
              option.value === selectedValue
                ? "bg-muted"
                : ""
            }`}
          >
            {option.label}
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default Select;
