import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { addCard, describeError } from "@/lib/export";
import {
  type ExportRequest,
  type ExportResponse,
  isExportRequest,
} from "@/lib/messages";
import { getSettings } from "@/lib/settings";

/**
 * The page widget cannot call the API itself: a content script's requests are
 * subject to the page's CORS rules, and the key must stay out of pages. So it
 * asks this service worker, which holds the key and has the host permission.
 */
async function exportSelection(
  request: ExportRequest,
): Promise<ExportResponse> {
  const settings = await getSettings();
  if (!settings.apiKey) {
    await browser.runtime.openOptionsPage();
    return { ok: false, message: "Add your API key in the settings first." };
  }
  try {
    await addCard(settings, {
      front: request.text,
      back: "",
      deck: settings.deck,
      source: { title: request.title, url: request.url },
    });
    return { ok: true, deck: settings.deck };
  } catch (error) {
    return { ok: false, message: describeError(error) };
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isExportRequest(message)) return;
    exportSelection(message).then(sendResponse);
    return true; // the answer comes later
  });
});
