import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createTestTerminal } from "@termless/test";
import { looksLikeMarkdown, stripAnsi } from "../src/markdown.ts";

const ESC = "\u001b";
const BEL = "\u0007";
const ST = `${ESC}\\`;

const screenshotDir = resolve(process.cwd(), "test-results/terminal-screenshots");
function saveScreenshot(
  term: ReturnType<typeof createTestTerminal>,
  name: string,
) {
  mkdirSync(screenshotDir, { recursive: true });
  writeFileSync(
    resolve(screenshotDir, `${name}.svg`),
    term.screenshotSvg({
      windowBar: "colorful",
      padding: 16,
      borderRadius: 8,
    }),
    "utf8",
  );
}

describe("terminal UI", () => {
  it("renders CSI-colored Markdown as visible text", () => {
    const term = createTestTerminal({ cols: 80, rows: 24 });
    const input = `${ESC}[1;32m# Hello${ESC}[0m\r\n- First\r\n- Second`;
    term.feed(stripAnsi(input));
    saveScreenshot(term, "markdown-csi");
    expect(term.screen).toContainText("# Hello");
    expect(term.screen).toContainText("- First");
    expect(term.screen).toContainText("- Second");
    expect(looksLikeMarkdown(input)).toBe(true);
  });

  it.each([
    ["BEL", BEL],
    ["ST", ST],
  ])("shows OSC 8 hyperlink label, not URL (%s)", (_kind, terminator) => {
    const term = createTestTerminal({ cols: 80, rows: 24 });
    const data = `${ESC}]8;;https://example.com${terminator}Documentation${ESC}]8;;${terminator}`;
    term.feed(stripAnsi(data));
    saveScreenshot(term, `osc-hyperlink-${_kind.toLowerCase()}`);
    expect(term.screen).toContainText("Documentation");
    expect(term.screen).not.toContainText("example.com");
  });

  it("preserves ordinary shell output without Markdown formatting", () => {
    const term = createTestTerminal({ cols: 80, rows: 24 });
    const data = "Hello world\r\nOperation complete";
    term.feed(stripAnsi(data));
    saveScreenshot(term, "plain-output");
    expect(term.screen).toContainText("Hello world");
    expect(term.screen).toContainText("Operation complete");
    expect(looksLikeMarkdown(data)).toBe(false);
  });

  it("runs a real Zsh command under a PTY", async () => {
    const term = createTestTerminal({ cols: 80, rows: 24 });
    await term.spawn(["zsh", "-c", "cd /tmp && printf 'PWD_OK\\n'"]);
    await term.waitFor("PWD_OK");
    saveScreenshot(term, "zsh-pty");
    expect(term.buffer).toContainText("PWD_OK");
    await term.close();
  });
});
