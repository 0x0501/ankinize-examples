export interface CardInput {
  front: string;
  back: string;
  /** Add a link to the page the text came from, under the back. */
  source?: { title: string; url: string };
}

/** Card fields hold HTML, and a selection or a page title can contain markup. */
export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Plain text to field HTML: escaped, with line breaks kept. */
export const toHtml = (text: string) =>
  escapeHtml(text.trim()).replace(/\r?\n/g, "<br>");

/** Only web links become links; javascript: and the like stay plain text. */
function sourceLink({ title, url }: { title: string; url: string }) {
  const label = escapeHtml(title || url);
  return /^https?:/i.test(url)
    ? `<a href="${escapeHtml(url)}">${label}</a>`
    : label;
}

/** The `fields` of a Basic note: its keys are the field names in camelCase. */
export function basicFields({ front, back, source }: CardInput) {
  const parts = [toHtml(back)];
  if (source) parts.push(sourceLink(source));
  return {
    front: toHtml(front),
    back: parts.filter(Boolean).join("<br><br>"),
  };
}
