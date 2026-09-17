import Badge from "../badge";
import Avatar from "../avatar/avatar";
import AvatarText from "../avatar/avatar-text";
import ImageGroupCell from "../table/image-group-cell";
import { ImageGroup } from "../table/types";
import { formatDate, formatRating, toBadgeColor } from "../table/utils";
import { RecordDetailField } from "./types";

/** Placeholder for a field the record has no value for. */
function Empty() {
  return <span className="text-muted-foreground text-theme-sm">—</span>;
}

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

/**
 * Renders one record detail field's value, picked by `field.type` — a badge for
 * `enum`, stars for `rating`, a localized date for `date`, an avatar for
 * `image`, an avatar stack for `imageGroup`, and plain text for everything
 * else (including unrecognized types).
 *
 * A field with no value renders an em dash rather than an empty badge/avatar.
 *
 * @param field - The field descriptor from the record's `result` array.
 */
export default function RecordDetailsField({
  field,
}: {
  field: RecordDetailField;
}) {
  const { type, value, color, label } = field;

  if (type === "imageGroup") {
    const members = Array.isArray(value) ? (value as ImageGroup[]) : [];
    if (members.length === 0) return <Empty />;
    return <ImageGroupCell members={members} />;
  }

  if (isEmpty(value)) return <Empty />;

  switch (type) {
    case "enum":
      return <Badge color={toBadgeColor(color)}>{String(value)}</Badge>;

    case "rating":
      return (
        <span className="text-muted-foreground text-theme-sm">
          {formatRating(value)}
        </span>
      );

    case "date":
      return (
        <span className="text-sm text-foreground">{formatDate(value)}</span>
      );

    case "image":
      return typeof value === "string" ? (
        <Avatar src={value} alt={label} />
      ) : (
        <AvatarText name={label.charAt(0).toUpperCase()} />
      );

    case "number":
    case "string":
    default:
      return <span className="text-sm text-foreground">{String(value)}</span>;
  }
}
