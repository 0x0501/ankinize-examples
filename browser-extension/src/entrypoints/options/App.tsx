import { Button } from "@base-ui/react/button";
import { Form } from "@base-ui/react/form";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { DEFAULT_BASE_URL, getSettings, saveSettings } from "@/lib/settings";
import { TextField } from "@/ui/Field";

export function App() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [apiKey, setApiKey] = useState("");
  const [deck, setDeck] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSettings().then((saved) => {
      setBaseUrl(saved.baseUrl);
      setApiKey(saved.apiKey);
      setDeck(saved.deck);
    });
  }, []);

  async function save() {
    const origin = new URL(baseUrl).origin;
    // A server of your own needs its origin granted once; ankinize.com already
    // is. This must run straight from the click, so it comes first.
    if (origin !== DEFAULT_BASE_URL) {
      const granted = await browser.permissions.request({
        origins: [`${origin}/*`],
      });
      if (!granted) return setMessage("Access to that server was not granted.");
    }
    await saveSettings({ baseUrl: origin, apiKey: apiKey.trim(), deck });
    setMessage("Saved.");
  }

  return (
    <main className="panel panel--page">
      <h1>Ankinize settings</h1>
      <Form
        className="panel"
        style={{ padding: 0, width: "auto", minHeight: 0 }}
        onFormSubmit={() => void save()}
      >
        <TextField
          required
          type="url"
          name="baseUrl"
          label="Server"
          value={baseUrl}
          onValueChange={setBaseUrl}
          hint="https://ankinize.com, or your own server."
        />
        <TextField
          required
          type="password"
          name="apiKey"
          label="API key"
          value={apiKey}
          onValueChange={setApiKey}
          hint="Make a key with the write scope under API Keys & Devices. Use one just for this extension, so you can revoke it alone."
        />
        <TextField
          name="deck"
          label="Starting deck"
          value={deck}
          onValueChange={setDeck}
          hint="The popup starts here. You can change it for each card."
        />
        <Button type="submit" className="button">
          Save
        </Button>
        <p className="status" role="status">
          {message}
        </p>
      </Form>
    </main>
  );
}
