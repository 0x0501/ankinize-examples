import { AnkinizeError, createNote } from "@ankinize/sdk";
import { useServer } from "./api";
import { basicFields, type CardInput } from "./card";
import type { Settings } from "./settings";

/** Adds one Basic card to `deck`. Throws an `AnkinizeError` the API refuses. */
export async function addCard(
  settings: Settings,
  { deck, ...card }: CardInput & { deck: string },
) {
  useServer(settings);
  await createNote({
    notetypeName: "Basic",
    deckName: deck,
    fields: basicFields(card),
    tags: ["from-browser"],
    // A retry of this same click must not add the card twice.
    idempotencyKey: crypto.randomUUID(),
  });
}

/** A message a person can read, for whatever went wrong. */
export function describeError(error: unknown) {
  if (error instanceof AnkinizeError) return error.message;
  return error instanceof Error ? error.message : "The card was not added.";
}
