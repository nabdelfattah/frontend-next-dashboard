export type RecordDetailFieldType =
  | "enum"
  | "image"
  | "imageGroup"
  | "rating"
  | "date"
  | "string"
  | "number";

export interface RecordDetailField {
  label: string;
  /** `| string` so an unrecognized server type degrades to plain text instead of breaking the build or the render. */
  type: RecordDetailFieldType | string;
  /** Badge color. Only meaningful for `type: "enum"`; unknown values fall back to `"light"`. */
  color?: string | null;
  /** Narrowed per `type` at render time — a string for `string`/`date`/`image`, a number for `number`/`rating`, an `ImageGroup[]` for `imageGroup`. */
  value: unknown;
}

export interface RecordDetailsResponse {
  success: boolean;
  messages: string[] | string | null;
  result: RecordDetailField[] | null;
}

export interface RecordDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  /** Base route — the record is fetched from `${route}/${recordId}`. */
  route: string;
  /** Row id from the table action. `null` when nothing is selected; the request stays idle until both this and `isOpen` are set. */
  recordId: string | null;
  /** Heading override. Defaults to the `shared.recordDetails.title` translation. */
  title?: string;
}
