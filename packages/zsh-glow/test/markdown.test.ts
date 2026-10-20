import { describe, expect, it } from "vitest";
import { looksLikeMarkdown, stripAnsi } from "../src/markdown.ts";
describe("Markdown detection", () => {
  it("detects headings, fenced code, and tables", () => {
    expect(looksLikeMarkdown("# Hello")).toBe(true);
    expect(looksLikeMarkdown("## Build results")).toBe(true);
    expect(looksLikeMarkdown("before\n```ts\nconst x = 1;\n```")).toBe(true);
    expect(
      looksLikeMarkdown("| Name | Status |\n| --- | --- |\n| api | active |"),
    ).toBe(true);
  });
  it("preserves ordinary terminal output", () => {
    for (const value of [
      "foo | bar | baz",
      "build #123 completed",
      "npm notice run test",
      "On branch main\nnothing to commit",
    ]) {
      expect(looksLikeMarkdown(value)).toBe(false);
    }
  });
  it("strips ANSI colors", () => {
    expect(stripAnsi("\u001b[32m# Hello\u001b[0m")).toBe("# Hello");
  });
});
