import Anthropic from "@anthropic-ai/sdk";
import { client, createNotes, listDecks, listNotes } from "@ankinize/sdk";

client.setConfig({ auth: process.env.ANKINIZE_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "list_decks",
    description: "List the decks in the user's Anki collection.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "search_notes",
    description: "Search notes with Anki search syntax, such as 'deck:German tag:a1'.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "add_cards",
    description: "Add Basic flashcards to a deck.",
    input_schema: {
      type: "object",
      properties: {
        deck: { type: "string" },
        cards: {
          type: "array",
          items: {
            type: "object",
            properties: { front: { type: "string" }, back: { type: "string" } },
            required: ["front", "back"],
          },
        },
      },
      required: ["deck", "cards"],
    },
  },
];

async function run(name: string, input: any): Promise<unknown> {
  if (name === "list_decks") return (await listDecks()).decks;
  if (name === "search_notes") return (await listNotes({ q: input.query, limit: 20 })).notes;
  if (name === "add_cards") {
    const result = await createNotes(
      input.cards.map((card: { front: string; back: string }) => ({
        notetypeName: "Basic",
        deckName: input.deck,
        fields: { front: card.front, back: card.back },
      })),
    );
    return { created: result.created, failed: result.failed };
  }
  throw new Error(`unknown tool ${name}`);
}

const anthropic = new Anthropic();
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: process.argv[2] ?? "Add 5 cards about the French Revolution to a deck called History." },
];

for (;;) {
  const reply = await anthropic.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 2048,
    tools,
    messages,
  });
  messages.push({ role: "assistant", content: reply.content });
  if (reply.stop_reason !== "tool_use") {
    console.log(reply.content.flatMap((part) => (part.type === "text" ? [part.text] : [])).join("\n"));
    break;
  }
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const part of reply.content) {
    if (part.type !== "tool_use") continue;
    try {
      results.push({ type: "tool_result", tool_use_id: part.id, content: JSON.stringify(await run(part.name, part.input)) });
    } catch (error) {
      results.push({ type: "tool_result", tool_use_id: part.id, is_error: true, content: String(error) });
    }
  }
  messages.push({ role: "user", content: results });
}
