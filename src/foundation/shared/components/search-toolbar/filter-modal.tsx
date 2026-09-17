import Label from "../form/label";
import Button from "../button";
import { Modal } from "../modal";
import { SearchFilterField } from "./types";
import SearchFilterFieldInput from "./filter-field";
import { useTranslations } from "next-intl";

interface SearchFilterModalProps {
  isOpen: boolean;
  /** Called to dismiss the modal without applying — backdrop click, Escape, or the close button. Draft edits stay as-is; they just aren't reported. */
  onClose: () => void;
  /** Called when Apply is clicked: reports every changed field, then closes. */
  onApply: () => void;
  /** Called when the popup's own Clear button is clicked: resets every field's draft to empty. Doesn't report anything or close the popup — like any other edit, it only takes effect once Apply is clicked. */
  onClearDraft: () => void;
  dataSchema: SearchFilterField[];
  /** Current (draft) filter values, keyed by each field's `key`. Not reported anywhere until Apply. */
  filters: Record<string, string>;
  /** Called with a field's `key` and its new draft value whenever one changes. Purely local — not reported upward until Apply. */
  onFieldChange: (key: string, value: string) => void;
  /** Bumped by the parent to remount every field (and so visually reset them), since they're uncontrolled. */
  resetKey: number;
}

/**
 * The `SearchToolbar` filter popup: one labeled input per `dataSchema` field,
 * in a `Modal`. Editing a field only updates the local draft (`filters`) —
 * nothing is reported upward until Apply.
 *
 * @param isOpen - Whether the modal is shown.
 * @param onClose - Called to dismiss without applying (backdrop/Escape/close button).
 * @param onApply - Called when Apply is clicked.
 * @param onClearDraft - Called when the popup's own Clear button is clicked, to reset every field's draft to empty.
 * @param dataSchema - Fields to render.
 * @param filters - Current draft filter values, keyed by field `key`.
 * @param onFieldChange - Called with a field's `key` and its new draft value.
 * @param resetKey - Changing this remounts (and resets) every field.
 */
export default function SearchFilterModal({
  isOpen,
  onClose,
  onApply,
  onClearDraft,
  dataSchema,
  filters,
  onFieldChange,
  resetKey,
}: SearchFilterModalProps) {
  const t = useTranslations("shared.table");
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground">{t("filter")}</h3>
        <div className="mt-4 flex flex-col gap-4">
          {dataSchema.map((field) => (
            <div
              key={`${field.key}-${resetKey}`}
              className="flex flex-col gap-1.5"
            >
              <Label>{field.label}</Label>
              <SearchFilterFieldInput
                field={field}
                value={filters[field.key] ?? ""}
                onChange={(value) => onFieldChange(field.key, value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClearDraft}>
            {t("clear")}
          </Button>
          <Button type="button" onClick={onApply}>
            {t("apply")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
