import { spawn } from "node:child_process";
import process from "node:process";
import * as pty from "node-pty";
import { looksLikeMarkdown, stripAnsi } from "./markdown.ts";
export interface RunTerminalCommandOptions {
  command: string;
  flushDelayMs?: number;
}
export async function runTerminalCommand({
  command,
  flushDelayMs = 40,
}: RunTerminalCommandOptions): Promise<number> {
  const env = {
    ...process.env,
    ZSH_GLOW_CHILD: "1",
    TERM: process.env.TERM || "xterm-256color",
  };
  const child = pty.spawn(process.env.SHELL || "/bin/zsh", ["-c", command], {
    name: env.TERM,
    cols: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
    cwd: process.cwd(),
    env,
  });
  let buffer = "";
  let timer: NodeJS.Timeout | undefined;
  const renderMarkdown = (markdown: string) => {
    const glow = spawn("glow", ["-"], {
      stdio: ["pipe", "inherit", "inherit"],
      env: process.env,
    });
    glow.on("error", (error) => console.error("glow:", error.message));
    glow.stdin.end(markdown);
  };
  const flush = () => {
    if (!buffer) return;
    const content = buffer;
    buffer = "";
    if (looksLikeMarkdown(content)) renderMarkdown(stripAnsi(content));
    else process.stdout.write(content);
  };
  child.onData((data) => {
    buffer += data;
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, flushDelayMs);
  });
  const rawMode = Boolean(process.stdin.isTTY && process.stdin.setRawMode);
  if (rawMode) process.stdin.setRawMode(true);
  if (process.stdin.isTTY) {
    process.stdin.resume();
    process.stdin.on("data", (data) => child.write(data.toString()));
  }
  process.stdout.on("resize", () =>
    child.resize(process.stdout.columns || 80, process.stdout.rows || 24),
  );
  return new Promise<number>((resolve) => {
    child.onExit(({ exitCode }) => {
      if (timer) clearTimeout(timer);
      flush();
      if (rawMode) process.stdin.setRawMode(false);
      resolve(exitCode);
    });
  });
}
