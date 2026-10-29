# Selection to flashcard (browser extension example)

A Manifest V3 extension with no build step. Select text on any page, right-click, **Add to Anki**: the selection becomes the front of a Basic card, the page link the back, in the deck you chose. It calls the Ankinize REST API, so it works with Anki closed and syncs to every device.

Written for the guide at https://ankinize.com/docs/examples/browser-extension.

1. Create an API key with the `write` scope under *API Keys & Devices*.
2. Chrome or Edge: `chrome://extensions`, turn on Developer mode, **Load unpacked**, pick this folder.
3. Open the extension's options and enter your server (`https://ankinize.com` or your own), the key and a deck.

The key sits in `chrome.storage.local`, readable only by the extension. Use a key made for it, so you can revoke it alone.
