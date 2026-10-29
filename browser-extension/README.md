# Selection to flashcard (browser extension)

Select text on any page and a round export button appears beside it: one click adds the selection to Anki as a **Basic** card in your starting deck, with a link back to the page. The toolbar popup does the same with an editable front and back and a deck list. It calls the Ankinize REST API through [`@ankinize/sdk`](https://www.npmjs.com/package/@ankinize/sdk), so it works with Anki closed and syncs to every device.

Built with [WXT](https://wxt.dev) (the extension framework), [Base UI](https://base-ui.com) (unstyled components), React and TypeScript. This is the finished project of the tutorial at https://ankinize.com/docs/tutorials/browser-extension.

```sh
bun install
bun run dev        # needs web-ext (a dev dependency); opens Chrome with the extension loaded and reloading
bun run build      # .output/chrome-mv3, ready for "Load unpacked"
bun run zip        # a .zip for the Chrome Web Store
bun run dev:firefox
bun test           # the card-building tests
```

Then open the extension's settings page, enter your server (`https://ankinize.com` or your own) and an API key with the `write` scope from **API Keys & Devices**, and a starting deck.

```
src/
  entrypoints/
    background.ts # holds the key; adds the card when the widget asks
    selection-widget.content/  # the export button shown beside a selection
    popup/        # the toolbar popup: read the selection, edit, add the card
    options/      # the settings page
  lib/
    settings.ts   # server, key and deck in extension storage
    selection.ts  # reads the selection of the active tab
    card.ts       # builds the fields of a Basic note (and escapes them)
    export.ts     # adds a Basic card (shared by popup and widget)
    messages.ts   # widget to background messages
    api.ts        # points the SDK at your server
  ui/             # Base UI components and the stylesheet
wxt.config.ts     # the manifest
```

The key sits in extension storage, readable only by the extension. Use a key made for it, so you can revoke it alone, and never publish an extension with a key built in.
