# Article to flashcards

Fetches a web page, asks a language model for flashcards, and adds them to your Anki through the [Ankinize](https://ankinize.com) REST API in one batch.

```bash
bun install
ANKINIZE_API_KEY=... ANTHROPIC_API_KEY=... bun article.ts https://example.com/some-article Reading
```

The key needs the `write` scope. For a server of your own, set `baseUrl` in `client.setConfig`. Cards are tagged `ankinized` and with the site's hostname so you can review them in Anki before studying.

Guide: https://ankinize.com/docs/examples/article-to-flashcards
