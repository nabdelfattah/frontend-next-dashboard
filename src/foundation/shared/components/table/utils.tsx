import { ImageGroup, TableItem, TableMetaDataColumn, TableMetaDataEnumOption } from "./types";
import {Badge, Avatar, AvatarText} from "@shared/components";
import { ActionButtonItem } from "../../types/props";
import ImageGroupCell from "./image-group-cell";

export const BADGE_COLORS = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
  "light",
  "dark",
] as const;

export function toBadgeColor(color?: string | null): (typeof BADGE_COLORS)[number] {
  if (color && (BADGE_COLORS as readonly string[]).includes(color)) {
    return color as (typeof BADGE_COLORS)[number];
  }
  return "light";
}

export function findEnumOption(
  column: TableMetaDataColumn,
  value: unknown
): TableMetaDataEnumOption | undefined {
  if (!column.enum || value == null) return undefined;
  const raw = String(value).toLowerCase();
  return column.enum.find(
    (option) =>
      option.value.toLowerCase() === raw || option.label.toLowerCase() === raw
  );
}

export function formatDate(value: unknown): string {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value ?? "");
  return date.toLocaleDateString();
}

function renderAvatar(column: TableMetaDataColumn, item: TableItem) {
  const value = item[column.secondaryCode];
  const src = typeof value === "string" ? value : null;
  const name =
    (item.name as string) || (item.employee_name as string) || column.name;
  return (
    <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full bg-muted flex items-center justify-center">
      {src ? (
        <Avatar src={src} alt={name} />
      ) : (
        <AvatarText name={(name || "?").charAt(0).toUpperCase()} />
      )}
    </div>
  );
}

/**
 * Renders one column's cell. When `imageColumn` is given (an `IMAGE` column
 * merged into this one — see `buildDisplayColumns`), its avatar is rendered
 * alongside this column's own value instead of in a separate column.
 */
export function renderCell(
  column: TableMetaDataColumn,
  item: TableItem,
  imageColumn?: TableMetaDataColumn
) {
  const content = renderCellValue(column, item);

  if (imageColumn) {
    return (
      <div className="flex items-center gap-3">
        {renderAvatar(imageColumn, item)}
        {content}
      </div>
    );
  }

  return content;
}

function renderCellValue(column: TableMetaDataColumn, item: TableItem) {
  const value = item[column.secondaryCode];

  switch (column.type) {
    case "IMAGE":
      return renderAvatar(column, item);
    case "IMAGE_GROUP": {
      const members = Array.isArray(value) ? (value as ImageGroup[]) : [];
      return <ImageGroupCell members={members} />;
    }
    case "DATE":
      return (
        <span className="text-muted-foreground text-theme-sm">
          {formatDate(value)}
        </span>
      );
    case "RATING":
      return (
        <span className="text-muted-foreground text-theme-sm">
          {"★".repeat(Number(value) || 0)}
          {"☆".repeat(Math.max(5 - (Number(value) || 0), 0))}
        </span>
      );
    case "STRING": {
      const enumOption = findEnumOption(column, value);
      if (enumOption) {
        return (
          <Badge color={toBadgeColor(enumOption.color)}>
            {enumOption.label}
          </Badge>
        );
      }
      return (
        <span className="text-muted-foreground text-theme-sm">
          {String(value ?? "")}
        </span>
      );
    }
    case "NUMBER":
    default:
      return (
        <span className="text-muted-foreground text-theme-sm">
          {String(value ?? "")}
        </span>
      );
  }
}

export interface DisplayColumn {
  column: TableMetaDataColumn;
  /** An `IMAGE` column merged into this one's cell instead of getting its own column. */
  imageColumn?: TableMetaDataColumn;
}

/**
 * Drops `IMAGE` columns from the rendered column list and attaches each one to
 * the column immediately after it (in `order`), so avatars render inline with
 * that column's value (e.g. next to the name) instead of in their own column.
 * An `IMAGE` column with nothing after it to merge into is rendered as-is.
 */
export function buildDisplayColumns(
  columns: TableMetaDataColumn[]
): DisplayColumn[] {
  const display: DisplayColumn[] = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.type === "IMAGE") {
      const hasNextColumn = i + 1 < columns.length;
      if (hasNextColumn) continue;
      display.push({ column });
      continue;
    }

    const previous = columns[i - 1];
    const imageColumn = previous?.type === "IMAGE" ? previous : undefined;
    display.push({ column, imageColumn });
  }

  return display;
}

const UNSORTABLE_TYPES = ["icon", "IMAGE", "IMAGE_GROUP"];
const UNFILTERABLE_TYPES = ["icon", "IMAGE", "IMAGE_GROUP"];

/** Every column is sortable/filterable server-side except image-ish columns (avatars, avatar groups). */
export function isSortable(column: TableMetaDataColumn): boolean {
  return !UNSORTABLE_TYPES.includes(column.type);
}

export function isFilterable(column: TableMetaDataColumn): boolean {
  return !UNFILTERABLE_TYPES.includes(column.type);
}

/** Resolves the shared `actions` config for one row: route actions get `/{id}` appended, callback actions receive the row's id. */
export function resolveRowActions(
  actions: ActionButtonItem[] | undefined,
  id: string
): ActionButtonItem[] {
  if (!actions) return [];
  return actions.map((item): ActionButtonItem => {
    const { label, icon, variant } = item;
    if (item.path) {
      return { label, icon, variant, path: `${item.path}/${id}` };
    }
    const action = item.action!;
    return { label, icon, variant, action: () => action(id) };
  });
}