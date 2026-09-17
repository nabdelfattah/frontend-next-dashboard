import { RecordDetailField, RecordDetailsResponse } from "./types";

/**
 * Fetches one record's detail fields from `${route}/${id}` and unwraps the
 * `{ success, messages, result }` envelope.
 *
 * Both failure modes — a non-ok HTTP status and a `success: false` body —
 * throw, so callers (and React Query) only have one error channel to handle.
 *
 * @param route - Base route, e.g. `"/api/employees"`.
 * @param id - The record's id.
 * @param signal - Abort signal, passed through from React Query so an in-flight request is cancelled when the query is.
 */
export async function fetchRecordDetails(
  route: string,
  id: string,
  signal?: AbortSignal
): Promise<RecordDetailField[]> {
  const response = await fetch(`${route}/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json()) as RecordDetailsResponse;
  if (!json.success) {
    throw new Error(
      Array.isArray(json.messages)
        ? json.messages.join(", ")
        : json.messages ?? "Request failed"
    );
  }

  return Array.isArray(json.result) ? json.result : [];
}
