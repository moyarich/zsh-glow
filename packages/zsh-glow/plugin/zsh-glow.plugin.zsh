# zsh-glow — automatically render Markdown terminal output with Glow.
[[ -n "$ZSH_GLOW_CHILD" ]] && return
typeset -ga ZSH_GLOW_BYPASS_COMMANDS=(
  cd builtin command source . export unset alias unalias
  typeset declare local set setopt unsetopt autoload functions
  hash rehash pushd popd dirs jobs fg bg wait disown exec exit return
)
_zsh_glow_should_bypass() {
  local command_line="$1"
  local first_word="${${(z)command_line}[1]}"
  [[ -z "$first_word" ]] && return 0
  local bypass
  for bypass in "${ZSH_GLOW_BYPASS_COMMANDS[@]}"; do
    [[ "$first_word" == "$bypass" ]] && return 0
  done
  return 1
}
_zsh_glow_accept_line() {
  local command_line="$BUFFER"
  if [[ -z "$command_line" ]] || _zsh_glow_should_bypass "$command_line"; then
    zle .accept-line
    return
  fi
  BUFFER="zsh-glow -- ${(q)command_line}"
  zle .accept-line
}
zle -N _zsh_glow_accept_line
bindkey '^M' _zsh_glow_accept_line
bindkey '^J' _zsh_glow_accept_line
