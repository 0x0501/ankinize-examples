import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Ankinize: selection to flashcard",
    description:
      "Select text on any page and add it to your Anki as a Basic card through Ankinize.",
    // activeTab + scripting read the selection when you open the popup, so the
    // extension needs no access to every page.
    permissions: ["activeTab", "scripting", "storage"],
    host_permissions: ["https://ankinize.com/*"],
    // The options page asks for your own server's origin when you self-host.
    optional_host_permissions: ["https://*/*", "http://*/*"],
  },
});
