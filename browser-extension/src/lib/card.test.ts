import { expect, test } from "bun:test";
import { basicFields } from "./card";

test("escapes markup and keeps line breaks", () => {
  const { front } = basicFields({ front: "1 < 2\n<b>x</b>", back: "" });
  expect(front).toBe("1 &#60; 2<br>&#60;b&#62;x&#60;/b&#62;");
});

test("links web pages and leaves other schemes as text", () => {
  const web = basicFields({
    front: "a",
    back: "",
    source: { title: "A page", url: "https://example.com/?a=1&b=2" },
  });
  expect(web.back).toBe(
    '<a href="https://example.com/?a=1&#38;b=2">A page</a>',
  );

  const script = basicFields({
    front: "a",
    back: "",
    source: { title: "x", url: "javascript:alert(1)" },
  });
  expect(script.back).toBe("x");
});

test("puts the answer above the link", () => {
  const { back } = basicFields({
    front: "a",
    back: "b",
    source: { title: "T", url: "https://example.com" },
  });
  expect(back).toBe('b<br><br><a href="https://example.com">T</a>');
});
