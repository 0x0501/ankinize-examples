// Right-click a selection, get a card. Runs as the extension's service worker,
// so its fetch is not subject to the page's CORS rules.
const DEFAULTS = { baseUrl: "https://ankinize.com", apiKey: "", deck: "Reading" };

// Card fields hold HTML, and a page title or a selection can contain markup.
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ankinize-add",
    title: "Add “%s” to Anki",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "ankinize-add" || !info.selectionText) return;
  const { baseUrl, apiKey, deck } = await chrome.storage.local.get(DEFAULTS);
  if (!apiKey) return chrome.runtime.openOptionsPage();

  const pageUrl = tab?.url ?? info.pageUrl ?? "";
  const pageTitle = tab?.title || pageUrl;
  // Only web links become links; javascript: and the like stay plain text.
  const back = /^https?:/i.test(pageUrl)
    ? `<a href="${escapeHtml(pageUrl)}">${escapeHtml(pageTitle)}</a>`
    : escapeHtml(pageTitle);

  const response = await fetch(`${baseUrl}/api/v1/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // A retry of the same click must not add the card twice.
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      notetypeName: "Basic",
      deckName: deck,
      fields: {
        front: escapeHtml(info.selectionText.trim()),
        back,
      },
      tags: ["from-browser"],
    }),
  });

  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png",
    title: response.ok ? "Card added" : `Ankinize said ${response.status}`,
    message: response.ok
      ? `Added to ${deck}. It syncs to your devices.`
      : (await response.json().catch(() => ({}))).message ?? "The card was not added.",
  });
});
