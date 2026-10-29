import Anthropic from "@anthropic-ai/sdk";
import { client, createDeck, createNotes, listDecks } from "@ankinize/sdk";

client.setConfig({ auth: process.env.ANKINIZE_API_KEY });

const [url, deckName = "Reading"] = process.argv.slice(2);
if (!url) throw new Error("usage: bun article.ts <url> [deck]");

// 1. Fetch the page and keep the readable text.
const html = await (await fetch(url)).text();
const text = html
  .replace(/<(script|style|nav|footer)[\s\S]*?<\/\1>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .slice(0, 40_000);

// 2. Ask a model for cards, as JSON and nothing else.
const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
const message = await anthropic.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: `Write 10 to 20 Anki flashcards from the article below. One fact per card,
the question answerable without seeing the article. Reply with only a JSON array of
{"front": string, "back": string}.\n\n${text}`,
    },
  ],
});
const block = message.content.find((part) => part.type === "text");
const cards: { front: string; back: string }[] = JSON.parse(
  (block?.type === "text" ? block.text : "[]").replace(/^```(?:json)?|```$/gm, ""),
);

// 3. Make sure the deck exists, then add every card in one batch.
const { decks } = await listDecks();
if (!decks.some((deck) => deck.name === deckName)) await createDeck({ name: deckName });

const result = await createNotes(
  cards.map(({ front, back }) => ({
    notetypeName: "Basic",
    deckName,
    fields: { front, back },
    tags: ["ankinized", new URL(url).hostname],
  })),
);
console.log(`${result.created} cards added to ${deckName}, ${result.failed} refused`);
