import { listDecks } from "@ankinize/sdk";
import { Button } from "@base-ui/react/button";
import { Checkbox } from "@base-ui/react/checkbox";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { useServer } from "@/lib/api";
import { addCard, describeError } from "@/lib/export";
import { type PageSelection, readSelection } from "@/lib/selection";
import { getSettings, type Settings } from "@/lib/settings";
import { DeckSelect } from "@/ui/DeckSelect";
import { TextField } from "@/ui/Field";

type Status =
  | { tone: "idle" }
  | { tone: "busy" }
  | { tone: "done"; deck: string }
  | { tone: "error"; message: string };

export function App() {
  const [settings, setSettings] = useState<Settings>();
  const [page, setPage] = useState<PageSelection>();
  const [decks, setDecks] = useState<string[]>([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deck, setDeck] = useState("");
  const [withLink, setWithLink] = useState(true);
  const [status, setStatus] = useState<Status>({ tone: "idle" });

  useEffect(() => {
    (async () => {
      const [saved, selection] = await Promise.all([
        getSettings(),
        readSelection(),
      ]);
      setSettings(saved);
      setPage(selection);
      setFront(selection.text);
      setDeck(saved.deck);
      if (!saved.apiKey) return;

      useServer(saved);
      try {
        const { decks } = await listDecks();
        const names = decks.map((d) => d.name).sort();
        setDecks(names);
        // Keep the saved deck if it still exists, else start on the first.
        setDeck((current) =>
          names.includes(current) ? current : (names[0] ?? ""),
        );
      } catch (error) {
        setStatus({ tone: "error", message: describeError(error) });
      }
    })();
  }, []);

  if (!settings || !page) return <main className="panel" />;

  if (!settings.apiKey) {
    return (
      <main className="panel">
        <h1>Connect Ankinize</h1>
        <p className="status">Add your API key to start making cards.</p>
        <Button
          className="button"
          onClick={() => browser.runtime.openOptionsPage()}
        >
          Open settings
        </Button>
      </main>
    );
  }

  async function add() {
    if (!page || !settings) return;
    setStatus({ tone: "busy" });
    try {
      await addCard(settings, {
        front,
        back,
        deck,
        source: withLink ? page : undefined,
      });
      setStatus({ tone: "done", deck });
    } catch (error) {
      setStatus({ tone: "error", message: describeError(error) });
    }
  }

  const done = status.tone === "done";

  return (
    <main className="panel">
      <h1>Add to Anki</h1>
      <form
        className="panel"
        style={{ padding: 0, width: "auto", minHeight: 0 }}
        onSubmit={(event) => {
          event.preventDefault();
          void add();
        }}
      >
        <TextField
          multiline
          required
          name="front"
          label="Front"
          value={front}
          onValueChange={setFront}
          placeholder="Select text on the page, then open this again"
        />
        <TextField
          multiline
          name="back"
          label="Back"
          value={back}
          onValueChange={setBack}
          hint="Optional. The page link goes under it."
        />
        <div className="checkbox-row">
          <Checkbox.Root
            className="checkbox"
            id="with-link"
            checked={withLink}
            onCheckedChange={setWithLink}
          >
            <Checkbox.Indicator>✓</Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor="with-link">Link to this page</label>
        </div>
        <DeckSelect decks={decks} value={deck} onValueChange={setDeck} />
        <Button
          type="submit"
          className="button"
          disabled={!front.trim() || !deck || status.tone === "busy" || done}
        >
          {status.tone === "busy" ? "Adding…" : "Add card"}
        </Button>
      </form>
      <p
        className="status"
        role="status"
        data-tone={status.tone === "error" ? "error" : undefined}
      >
        {status.tone === "done" &&
          `Added to ${status.deck}. It syncs to your devices.`}
        {status.tone === "error" && status.message}
      </p>
    </main>
  );
}
