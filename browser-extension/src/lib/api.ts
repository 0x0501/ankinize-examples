import { client } from "@ankinize/sdk";
import type { Settings } from "./settings";

/** Points the SDK at the configured server with the saved key. */
export function useServer({ baseUrl, apiKey }: Settings) {
  client.setConfig({ baseUrl, auth: apiKey });
}
