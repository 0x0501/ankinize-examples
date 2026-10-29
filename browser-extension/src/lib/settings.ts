import { storage } from "wxt/utils/storage";

export interface Settings {
  /** Where Ankinize runs: https://ankinize.com, or your own server. */
  baseUrl: string;
  /** An API key with the `write` scope. */
  apiKey: string;
  /** The deck the popup starts on. */
  deck: string;
}

export const DEFAULT_BASE_URL = "https://ankinize.com";

const settings = storage.defineItem<Settings>("local:settings", {
  fallback: { baseUrl: DEFAULT_BASE_URL, apiKey: "", deck: "Default" },
});

export const getSettings = () => settings.getValue();
export const saveSettings = (value: Settings) => settings.setValue(value);
