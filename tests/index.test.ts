import { describe, expect, it } from "vitest";
import { looksLikeMarkdown } from "../packages/zsh-glow/src/markdown";
describe("zsh-glow integration", () => {
  it("detects Markdown and preserves ordinary output", () => {
    expect(looksLikeMarkdown("# Hello")).toBe(true);
    expect(looksLikeMarkdown("npm notice run test")).toBe(false);
  });
});
