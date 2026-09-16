import React from "react";

interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Radio group name
  value: string; // Value of the radio button
  checked: boolean; // Whether the radio button is checked
  label: string; // Label for the radio button
  onChange: (value: string) => void; // Handler for value change
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state for the radio button
}

/**
 * Radio button with a custom circular indicator.
 *
 * @param id - Unique id for the radio input, and the `htmlFor` target of its label.
 * @param name - Radio group name — radios sharing a `name` are mutually exclusive.
 * @param value - Value of this radio button.
 * @param checked - Whether this radio button is checked.
 * @param label - Label text.
 * @param onChange - Called with `value` when this radio is selected.
 * @param className - Additional classes merged onto the label.
 * @param disabled - Disabled state. Defaults to `false`.
 *
 * @example
 * <Radio id="plan-free" name="plan" value="free" checked={plan === "free"} label="Free" onChange={setPlan} />
 */
const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer  select-none items-center gap-3 text-sm font-medium ${
        disabled
          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          : "text-muted-foreground"
      } ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)} // Prevent onChange when disabled
        className="sr-only"
        disabled={disabled} // Disable input
      />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${
          checked
            ? "border-brand-500 bg-brand-500"
            : "bg-transparent border-input"
        } ${
          disabled
            ? "bg-muted border-border"
            : ""
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full bg-white ${
            checked ? "block" : "hidden"
          }`}
        ></span>
      </span>
      {label}
    </label>
  );
};

export default Radio;
