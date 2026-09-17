import Input from "../form/input/input-field";
import Select from "../form/select";
import DatePicker from "../form/date-picker";
import Checkbox from "../form/input/checkbox";
import { SearchFilterField } from "./types";

interface SearchFilterFieldInputProps {
  field: SearchFilterField;
  /** Current raw value for this field (a comma-joined list for `"checkbox"`). */
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders one `SearchToolbar` filter field's input, picked by `field.type`:
 * `Input` for `"text"`/`"number"`, `Select` for `"select"`, `DatePicker` for
 * `"date"`, and a `Checkbox` per option for `"checkbox"` (selected options are
 * joined into a single comma-separated `value`).
 *
 * @param field - The schema entry describing this field.
 * @param value - Current value, from the parent's `filters` state.
 * @param onChange - Called with the field's new value whenever it changes.
 */
export default function SearchFilterFieldInput({
  field,
  value,
  onChange,
}: SearchFilterFieldInputProps) {
  switch (field.type) {
    case "checkbox": {
      const selected = value ? value.split(",").filter(Boolean) : [];
      return (
        <div className="flex flex-col gap-2">
          {(field.enum ?? []).map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              onChange={(checked) => {
                const next = checked
                  ? [...selected, option]
                  : selected.filter((v) => v !== option);
                onChange(next.join(","));
              }}
            />
          ))}
        </div>
      );
    }
    case "select":
      return (
        <Select
          options={(field.enum ?? []).map((option) => ({
            value: option,
            label: option,
          }))}
          defaultValue={value}
          onChange={onChange}
        />
      );
    case "date":
      return (
        <DatePicker
          id={`search-filter-${field.key}`}
          defaultDate={value || undefined}
          onChange={(_, dateStr) => onChange(dateStr)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          defaultValue={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "text":
    default:
      return (
        <Input
          type="text"
          defaultValue={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}
