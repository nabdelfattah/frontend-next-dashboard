import React from "react";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

/**
 * Styled `<textarea>` with a disabled/error state and an optional hint.
 *
 * @param placeholder - Placeholder text. Defaults to `"Enter your message"`.
 * @param rows - Number of visible rows. Defaults to `3`.
 * @param value - Current value (controlled). Defaults to `""`.
 * @param onChange - Called with the new value on change.
 * @param className - Additional classes merged onto the `<textarea>`.
 * @param disabled - Disabled state. Defaults to `false`.
 * @param error - Renders the error (red) style. Defaults to `false`.
 * @param hint - Helper text shown below the textarea, colored to match `error`.
 *
 * @example
 * <TextArea value={message} onChange={setMessage} hint="Max 500 characters" />
 */
const TextArea: React.FC<TextareaProps> = ({
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  value = "", // Default value
  onChange, // Callback for changes
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className}`;

  if (disabled) {
    textareaClasses += ` bg-muted opacity-50 text-muted-foreground border-input cursor-not-allowed`;
  } else if (error) {
    textareaClasses += ` bg-input-background text-foreground border-input focus:border-focus-error focus:ring-3 focus:ring-error-500/10`;
  } else {
    textareaClasses += ` bg-input-background text-foreground border-input focus:border-focus-brand focus:ring-3 focus:ring-brand-500/10`;
  }

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={textareaClasses}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-muted-foreground"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
