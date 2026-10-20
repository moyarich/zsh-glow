import process from "node:process";
import { runTerminalCommand } from "../pty-runner.ts";
const separator = process.argv.indexOf("--");
const command = (separator >= 0 ? process.argv.slice(separator + 1) : process.argv.slice(2)).join(" ");
if (!command) {
  console.error("Usage: zsh-glow -- <command>");
  process.exitCode = 2;
} else {
  process.exitCode = await runTerminalCommand({ command });
}
