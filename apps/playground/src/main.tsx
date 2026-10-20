import React from "react";
import { createRoot } from "react-dom/client";
import { looksLikeMarkdown } from "../../../packages/zsh-glow/src/markdown";

const examples = ["# Heading\n\nMarkdown output", "| Name | Status |\n| --- | --- |\n| CLI | ready |", "npm notice run test"];
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main>
      <h1>zsh-glow playground</h1>
      <p>Conservative Markdown detection for terminal output.</p>
      {examples.map((example, index) => (
        <section key={index}>
          <pre>{example}</pre>
          <p>{looksLikeMarkdown(example) ? "Render through Glow" : "Preserve terminal output"}</p>
        </section>
      ))}
    </main>
  </React.StrictMode>,
);
