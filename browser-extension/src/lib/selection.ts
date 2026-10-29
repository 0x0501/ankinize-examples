import { browser } from "wxt/browser";

export interface PageSelection {
  text: string;
  title: string;
  url: string;
}

/**
 * Reads what is selected in the active tab. Opening the popup grants
 * `activeTab` for that tab, which is what lets `executeScript` run there.
 */
export async function readSelection(): Promise<PageSelection> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const page = { title: tab?.title ?? "", url: tab?.url ?? "" };
  if (tab?.id === undefined) return { text: "", ...page };

  try {
    const [result] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection()?.toString() ?? "",
    });
    return { text: String(result?.result ?? "").trim(), ...page };
  } catch {
    // Pages such as chrome:// and the web store cannot be scripted.
    return { text: "", ...page };
  }
}
