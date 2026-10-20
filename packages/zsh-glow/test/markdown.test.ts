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

const ESC = "\u001b";
const BEL = "\u0007";
const ST = `${ESC}\\`;

describe("terminal control sequence stripping", () => {
  it.each([
    ["CSI foreground color", `${ESC}[31m# Hello${ESC}[0m`, "# Hello"],
    ["CSI bold", `${ESC}[1mBold${ESC}[0m`, "Bold"],
    ["CSI 256-color", `${ESC}[38;5;196mRed${ESC}[0m`, "Red"],
    ["CSI truecolor", `${ESC}[38;2;255;0;0mRed${ESC}[0m`, "Red"],
    ["CSI cursor movement", `${ESC}[2A# Title`, "# Title"],
    ["CSI erase line", `${ESC}[K# Title`, "# Title"],
    ["OSC title BEL", `${ESC}]0;Terminal title${BEL}# Hello`, "# Hello"],
    ["OSC title ST", `${ESC}]0;Terminal title${ST}# Hello`, "# Hello"],
    ["OSC 8 hyperlink BEL", `${ESC}]8;;https://example.com${BEL}Link${ESC}]8;;${BEL}`, "Link"],
    ["OSC 8 hyperlink ST", `${ESC}]8;;https://example.com${ST}Link${ESC}]8;;${ST}`, "Link"],
  ])("strips %s", (_case, input, expected) => {
    expect(stripAnsi(input)).toBe(expected);
  });

  it("recognizes Markdown through mixed OSC and CSI formatting", () => {
    const input = `${ESC}]0;Title${BEL}${ESC}[1m${ESC}[32m# Heading${ESC}[0m`;
    expect(stripAnsi(input)).toBe("# Heading");
    expect(looksLikeMarkdown(input)).toBe(true);
  });

  it("leaves ordinary Markdown untouched", () => {
    const input = "# Heading\nSome **bold** Markdown.";
    expect(stripAnsi(input)).toBe(input);
  });
});
