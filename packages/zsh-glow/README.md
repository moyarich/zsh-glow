# @moyarich/zsh-glow

Zsh plugin and PTY-backed CLI that detects Markdown terminal output and renders it with [Glow](https://github.com/charmbracelet/glow).

Requires Node.js 24+, Zsh, Glow, and npm. Build with `npm run build --workspace @moyarich/zsh-glow` and link with `npm link --workspace @moyarich/zsh-glow`.

Run `zsh-glow -- 'printf "# Hello\\n"'` to render Markdown. To enable transparent command handling in an interactive Oh My Zsh shell, source `packages/zsh-glow/plugin/zsh-glow.plugin.zsh` from your Zsh startup configuration. Shell state-changing commands are bypassed.
