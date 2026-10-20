# zsh-glow

Oh My Zsh plugin and PTY-backed CLI that detects Markdown terminal output and renders it through [Glow](https://github.com/charmbracelet/glow). Migrated from the supplied `@moyarich/auto-glow-md` implementation.

## Workspace

- `packages/zsh-glow` — publishable `@moyarich/zsh-glow` package; CLI `zsh-glow`, Zsh plugin, PTY runner and Vitest tests.
- `apps/playground` — Markdown detection playground.
- `.github/workflows` — shared reusable-workflow callers.

## Development

```sh
npm ci
npm run checks
npm run pack:check
npm run build --workspace @moyarich/zsh-glow
npm link --workspace @moyarich/zsh-glow
zsh-glow -- 'printf "# Hello\\n"'
```

Requires Node.js 24+, Zsh, Glow on PATH, and a system toolchain for the native `node-pty` dependency. The Zsh hook lives in `packages/zsh-glow/plugin/zsh-glow.plugin.zsh` and can be sourced from `~/.zshrc` after installation.

See [package documentation](packages/zsh-glow/README.md) for details.
