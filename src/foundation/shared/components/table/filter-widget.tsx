"use client";

import { useState } from "react";
import { Star, ChevronUp, ChevronDown } from "@/assets/icons";
import Input from "../form/input/input-field";
import Checkbox from "../form/input/checkbox";
import Select from "../form/select";
import DatePicker from "../form/date-picker";
import { TableMetaDataColumn } from "./types";

const OPERATORS = ["=", ">", "<", ">=", "<="] as const;
type Operator = (typeof OPERATORS)[number];

/**
 * Number input with its own up/down stepper instead of the browser's native
 * spinner — the native one renders with a plain white background with no
 * way to theme it, which looked broken in dark mode. The buttons below are
 * just Tailwind, so they follow the app theme. Shared by the RATING and
 * IMAGE_GROUP filter widgets.
 */
function NumberStepperInput({
  defaultValue,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  decimals = 0,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
}) {
  const [amount, setAmount] = useState(defaultValue);
  const numeric = Number(amount) || 0;

  const stepBy = (delta: number) => {
    const clamped = Math.min(max, Math.max(min, numeric + delta));
    const factor = 10 ** decimals;
    const next = String(Math.round(clamped * factor) / factor);
    setAmount(next);
    onChange(next);
  };

  return (
    <div className="relative w-full flex-1">
      <input
        type="number"
        min={min}
        max={Number.isFinite(max) ? max : undefined}
        step={step}
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          onChange(e.target.value);
        }}
        className="h-11 w-full rounded-lg border border-input bg-input-background py-2.5 pl-4 pr-8 text-sm text-foreground shadow-theme-xs [appearance:textfield] focus:border-focus-brand focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="absolute inset-y-0 right-0 flex w-7 flex-col divide-y divide-input border-l border-input">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Increase"
          onClick={() => stepBy(step)}
          disabled={numeric >= max}
          className="flex flex-1 items-center justify-center rounded-tr-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Decrease"
          onClick={() => stepBy(-step)}
          disabled={numeric <= min}
          className="flex flex-1 items-center justify-center rounded-br-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

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
          <NumberStepperInput
            defaultValue={value}
            onChange={onChange}
            min={0}
            max={5}
            step={0.1}
            decimals={1}
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
          <NumberStepperInput
            defaultValue={amount}
            onChange={(nextAmount) => onChange(`${operator}${nextAmount}`)}
            min={0}
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
