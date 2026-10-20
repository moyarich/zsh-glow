import { defineConfig } from "vite";
export default defineConfig({
  build: {
    target: "node24",
    ssr: true,
    outDir: "bin",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/cli/zsh-glow.ts",
      external: ["node-pty"],
      output: { entryFileNames: "zsh-glow.mjs", banner: "#!/usr/bin/env node" },
    },
  },
});
