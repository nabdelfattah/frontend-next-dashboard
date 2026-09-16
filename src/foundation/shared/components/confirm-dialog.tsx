"use client";

import { Modal } from "@shared/components";
import Button from "./button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as a destructive action. Defaults to `false`. */
  isDanger?: boolean;
}

/**
 * Generic confirm/cancel dialog, built on the shared `Modal`. Reusable
 * anywhere a destructive or otherwise consequential action needs a
 * confirmation step (bulk delete, discarding changes, etc.).
 *
 * @param isOpen - Whether the dialog is shown.
 * @param onClose - Called when the dialog should close (backdrop click, Escape, or Cancel).
 * @param onConfirm - Called when the confirm button is clicked. The caller is responsible for closing the dialog afterward.
 * @param title - Dialog title.
 * @param message - Dialog body text.
 * @param confirmLabel - Confirm button label. Defaults to `"Confirm"`.
 * @param cancelLabel - Cancel button label. Defaults to `"Cancel"`.
 * @param isDanger - Styles the confirm button in the error/danger color. Defaults to `false`.
 *
 * @example
 * <ConfirmDialog
 *   isOpen={isConfirmOpen}
 *   onClose={() => setIsConfirmOpen(false)}
 *   onConfirm={handleBulkDelete}
 *   title="Delete selected items"
 *   message="Are you sure you want to delete 3 selected item(s)? This action cannot be undone."
 *   isDanger
 * />
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            className={isDanger ? "!bg-error-500 hover:!bg-error-600" : ""}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
