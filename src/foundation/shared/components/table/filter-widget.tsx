"use client";

import { Star } from "@/assets/icons";
import Input from "../form/input/input-field";
import Checkbox from "../form/input/checkbox";
import Select from "../form/select";
import DatePicker from "../form/date-picker";
import { TableMetaDataColumn } from "./types";

const OPERATORS = ["=", ">", "<", ">=", "<="] as const;
type Operator = (typeof OPERATORS)[number];

function parseOperatorValue(raw: string): { operator: Operator; amount: string } {
  const match = raw.match(/^(>=|<=|>|<|=)?(.*)$/);
  const operator = (match?.[1] as Operator) || "=";
  const amount = match?.[2] ?? "";
  return { operator, amount };
}

/** Local-time yyyy-mm-dd, avoiding the UTC shift `toISOString()` would introduce. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface FilterWidgetProps {
  column: TableMetaDataColumn;
  /** Draft (uncommitted) wire-format value for this column's filter. */
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders the right filter input for a column, using the shared form
 * components: checkboxes for an `enum`, a date input for `DATE`, a number
 * input for `RATING`, an operator select + number input for `IMAGE_GROUP`,
 * and a plain text input for everything else.
 *
 * `value`/`onChange` carry the draft filter string; the caller (the header
 * cell menu) owns committing it on Apply. The shared `Input`/`Select` are
 * `defaultValue`-based (uncontrolled), which works here because this widget
 * is only ever mounted while its popover is open — it remounts fresh (with
 * the current draft) each time the popover reopens.
 */
export default function FilterWidget({ column, value, onChange }: FilterWidgetProps) {
  if (column.enum) {
    const selected = value ? value.split(",").filter(Boolean) : [];
    const toggle = (optionValue: string, checked: boolean) => {
      const next = checked
        ? [...selected, optionValue]
        : selected.filter((v) => v !== optionValue);
      onChange(next.join(","));
    };

    return (
      <div className="flex flex-col gap-2">
        {column.enum.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            onChange={(checked) => toggle(option.value, checked)}
          />
        ))}
      </div>
    );
  }

  switch (column.type) {
    case "DATE": {
      // Displayed as dd/mm/yyyy; the committed/wire value stays ISO (yyyy-mm-dd).
      const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined;
      return (
        <DatePicker
          id={`date-filter-${column.secondaryCode}`}
          dateFormat="d/m/Y"
          isStatic={false}
          defaultDate={selectedDate}
          onChange={(selectedDates) => {
            const picked = selectedDates[0];
            onChange(picked ? toIsoDate(picked) : "");
          }}
        />
      );
    }
    case "RATING":
      return (
        <div className="flex items-center gap-2 w-full">
          <Star className="h-4 w-4 shrink-0 text-gray-400" />
          <Input
          className="w-full flex-1"
            type="number"
            min="0"
            max="5"
            step={0.1}
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "IMAGE_GROUP": {
      const { operator, amount } = parseOperatorValue(value);
      return (
        <div className="flex gap-2">
          <div className="w-24 shrink-0">
            <Select
              options={OPERATORS.map((op) => ({ value: op, label: op }))}
              defaultValue={operator}
              onChange={(nextOperator) => onChange(`${nextOperator}${amount}`)}
            />
          </div>
          <Input
            type="number"
            min="0"
            defaultValue={amount}
            onChange={(e) => onChange(`${operator}${e.target.value}`)}
          />
        </div>
      );
    }
    default:
      return (
        <Input
          type="text"
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
