import { Button } from "@base-ui/react/button";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import type { ExportRequest, ExportResponse } from "@/lib/messages";

interface Anchor {
  text: string;
  left: number;
  top: number;
}

type Result = {
  text: string;
  state: "busy" | "done" | "error";
  message: string;
};

const SIZE = 32;

/** Where the button goes: under the end of the selection, or above it at the page's foot. */
function readAnchor(): Anchor | null {
  const selection = window.getSelection();
  const text = selection?.toString().trim();
  if (!selection || !text || selection.rangeCount === 0) return null;
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const below = rect.bottom + 8;
  return {
    text,
    left: Math.max(8, Math.min(rect.right, window.innerWidth - SIZE - 8)),
    top: below + SIZE > window.innerHeight ? rect.top - SIZE - 8 : below,
  };
}

export function SelectionWidget() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    // After the click that ends a selection, the browser may still be
    // collapsing the old one; read it on the next turn.
    const read = () => setTimeout(() => setAnchor(readAnchor()), 0);
    const reposition = () => setAnchor((current) => current && readAnchor());
    const hideWhenCleared = () => {
      if (!window.getSelection()?.toString().trim()) setAnchor(null);
    };

    document.addEventListener("mouseup", read);
    document.addEventListener("keyup", read);
    document.addEventListener("selectionchange", hideWhenCleared);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mouseup", read);
      document.removeEventListener("keyup", read);
      document.removeEventListener("selectionchange", hideWhenCleared);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, []);

  if (!anchor) return null;

  // A result belongs to the text it was made for.
  const current = result?.text === anchor.text ? result : undefined;
  const state = current?.state;

  async function exportSelection() {
    if (!anchor) return;
    const { text } = anchor;
    setResult({ text, state: "busy", message: "Adding…" });
    const request: ExportRequest = {
      type: "ankinize:export",
      text,
      title: document.title,
      url: location.href,
    };
    try {
      const response: ExportResponse =
        await browser.runtime.sendMessage(request);
      setResult(
        response.ok
          ? { text, state: "done", message: `Added to ${response.deck}` }
          : { text, state: "error", message: response.message },
      );
    } catch {
      setResult({
        text,
        state: "error",
        message: "The extension was reloaded. Refresh the page.",
      });
    }
  }

  const label = current?.message ?? "Add to Anki";

  return (
    <div
      className="widget"
      style={{ left: anchor.left, top: anchor.top }}
      // Keep the selection: pressing a button would otherwise clear it.
      onMouseDown={(event) => event.preventDefault()}
    >
      <Button
        className="widget__button"
        aria-label={label}
        title={label}
        data-state={state}
        disabled={state === "busy" || state === "done"}
        onClick={exportSelection}
      >
        <Icon state={state} />
      </Button>
      <span className="widget__status" role="status">
        {current && current.state !== "busy" ? current.message : ""}
      </span>
    </div>
  );
}

function Icon({ state }: { state: Result["state"] | undefined }) {
  const path =
    state === "done"
      ? "M5 12.5l4.5 4.5L19 7.5" // check
      : state === "error"
        ? "M6 6l12 12M18 6L6 18" // cross
        : "M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"; // arrow into a tray
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
