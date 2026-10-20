const ESC = String.fromCharCode(27);
const BEL = String.fromCharCode(7);

// OSC commands may end with BEL or ST (ESC + backslash).
const OSC_PATTERN = new RegExp(
  `${ESC}\\][^${BEL}${ESC}]*(?:${BEL}|${ESC}\\\\)`,
  "g",
);
// CSI commands start with ESC + [ and end with a final byte in @ through ~.
const CSI_PATTERN = new RegExp(`${ESC}\\[[0-?]*[ -/]*[@-~]`, "g");

export function stripAnsi(value: string): string {
  return value.replace(OSC_PATTERN, "").replace(CSI_PATTERN, "");
}

export function looksLikeMarkdown(value: string): boolean {
  const text = stripAnsi(value);
  if (/^#{1,6}\s+\S/m.test(text)) return true;
  if (/^\x60\x60\x60[\w-]*\s*$/m.test(text)) return true;
  return (
    /^\s*\|?.+\|.+\|?\s*$/m.test(text) && /^\s*\|?\s*:?-{3,}:?\s*\|/m.test(text)
  );
}
