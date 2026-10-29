import { createRoot } from "react-dom/client";
import { defineContentScript } from "wxt/utils/define-content-script";
import { createShadowRootUi } from "wxt/utils/content-script-ui/shadow-root";
import "./style.css";
import { SelectionWidget } from "./SelectionWidget";

export default defineContentScript({
  matches: ["<all_urls>"],
  // Put the stylesheet inside the shadow root, so the page cannot restyle the
  // widget and the widget cannot leak styles into the page.
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "ankinize-selection-widget",
      position: "inline",
      anchor: "body",
      onMount(container) {
        const root = createRoot(container);
        root.render(<SelectionWidget />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });
    ui.mount();
  },
});
