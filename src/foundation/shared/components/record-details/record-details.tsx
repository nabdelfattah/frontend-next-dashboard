"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Modal } from "../modal";
import Button from "../button";
import { showToast } from "../../stores/toast-store";
import { RecordDetailsProps } from "./types";
import { fetchRecordDetails } from "./utils";
import RecordDetailsField from "./record-details-field";

const SKELETON_FIELD_COUNT = 6;

/** Placeholder blocks shaped like the real grid, so the modal doesn't jump when data lands. */
function FieldsSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_FIELD_COUNT }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </>
  );
}

/**
 * Popup showing one record's details. Fetches `${route}/${recordId}` when it
 * opens and renders each field returned in the response's `result` array in a
 * way suited to that field's own `type` — a badge for `enum`, stars for
 * `rating`, a localized date for `date`, avatars for `image`/`imageGroup`.
 *
 * The response is self-describing (every field carries its own `label`, `type`
 * and `value`), so nothing about the record's shape needs to be passed in.
 *
 * The caller owns the open state and the selected id — typically a `Table` row
 * action sets both. The request stays idle until the popup is open *and* a
 * `recordId` is set, and results are cached briefly, so reopening the same
 * record is instant.
 *
 * @param isOpen - Whether the popup is shown.
 * @param onClose - Called when the popup should close (backdrop click, Escape, or the close button).
 * @param route - Base route; the record is fetched from `${route}/${recordId}`.
 * @param recordId - Id of the record to show, or `null` when nothing is selected.
 * @param title - Heading override. Defaults to the `shared.recordDetails.title` translation.
 *
 * @example
 * const { isOpen, openModal, closeModal } = useModal();
 * const [selectedId, setSelectedId] = useState<string | null>(null);
 *
 * const actions = [
 *   { label: "View Details", action: (id: string) => { setSelectedId(id); openModal(); } },
 * ];
 *
 * <RecordDetails
 *   isOpen={isOpen}
 *   onClose={closeModal}
 *   route="/api/employees"
 *   recordId={selectedId}
 * />
 */
export default function RecordDetails({
  isOpen,
  onClose,
  route,
  recordId,
  title,
}: RecordDetailsProps) {
  const t = useTranslations("shared.recordDetails");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["record-details", route, recordId],
    queryFn: ({ signal }) => fetchRecordDetails(route, recordId!, signal),
    enabled: isOpen && Boolean(recordId),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!isError) return;
    showToast({
      variant: "error",
      title: t("loadFailedTitle"),
      message: t("loadFailedMessage"),
    });
    // `error` keeps a stable identity per failed query, so this fires once per
    // failure rather than once per render. `t` is deliberately not a dependency:
    // next-intl returns a new function every render, which would loop forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground">
          {title ?? t("title")}
        </h3>

        {isError ? (
          <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("loadFailedMessage")}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              {t("retry")}
            </Button>
          </div>
        ) : !isLoading && data?.length === 0 ? (
          <p className="mt-6 py-6 text-center text-sm text-muted-foreground">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {isLoading ? (
              <FieldsSkeleton />
            ) : (
              data?.map((field, index) => (
                <div
                  key={`${field.label}-${index}`}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-theme-xs uppercase text-muted-foreground">
                    {field.label}
                  </span>
                  <RecordDetailsField field={field} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
