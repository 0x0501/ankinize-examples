/** What the page widget asks the background script to do. */
export interface ExportRequest {
  type: "ankinize:export";
  text: string;
  title: string;
  url: string;
}

export type ExportResponse =
  | { ok: true; deck: string }
  | { ok: false; message: string };

export const isExportRequest = (message: unknown): message is ExportRequest =>
  (message as ExportRequest | undefined)?.type === "ankinize:export";
