import { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './label';
import { Calendar } from '@/assets/icons';
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  /** flatpickr display/input format. Defaults to `"Y-m-d"` (ISO). */
  dateFormat?: string;
  /**
   * Whether the calendar is positioned inline (`static: true`, flatpickr's
   * default here) or appended to `document.body` (`false`). Use `false`
   * inside a scrollable/clipping container (e.g. a popover) so the calendar
   * isn't cut off by that container's own overflow/height constraints.
   */
  isStatic?: boolean;
};

/**
 * Date input backed by flatpickr, with an optional label and calendar icon.
 *
 * @param id - Unique id for the input; also the selector flatpickr attaches to.
 * @param mode - flatpickr selection mode. Defaults to `"single"`.
 * @param onChange - flatpickr `onChange` hook(s), called with the selected date(s).
 * @param defaultDate - Initially selected date.
 * @param label - Optional label rendered above the input via `Label`.
 * @param placeholder - Placeholder text for the input.
 * @param dateFormat - flatpickr display/input format string. Defaults to `"Y-m-d"`.
 *
 * @example
 * <DatePicker id="start-date" label="Start date" onChange={(dates) => setStartDate(dates[0])} />
 */
export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  dateFormat = "Y-m-d",
  isStatic = true,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: isStatic,
      monthSelectorType: "static",
      dateFormat,
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, dateFormat, isStatic]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-placeholder focus:outline-hidden focus:ring-3 bg-input-background text-foreground border-input focus:border-focus-brand focus:ring-brand-500/20"
        />

        <span className="absolute text-muted-foreground -translate-y-1/2 pointer-events-none end-4 top-1/2">
          <Calendar className="size-6" />
        </span>
      </div>
    </div>
  );
}
