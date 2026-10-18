#!/bin/bash
# Optional terminal status line: folder · model · context (colored). Plugins can't register a status line —
# add it yourself in ~/.claude/settings.json (see README).
here=$(cd "$(dirname "$0")" && pwd)
in=$(cat)
model=$(echo "$in" | jq -r '.model.display_name // "?"')
tp=$(echo "$in" | jq -r '.transcript_path // ""')
dir=$(basename "$(echo "$in" | jq -r '.workspace.current_dir // .cwd // ""')")
ctx=$(echo "$in" | jq -r '.context_window.current_usage | if . then ((.input_tokens//0)+(.cache_creation_input_tokens//0)+(.cache_read_input_tokens//0)) else empty end' 2>/dev/null)
{ [ -z "$ctx" ] || [ "$ctx" = 0 ]; } && ctx=$("$here/ctx-tokens.sh" "$tp")
k=$((ctx/1000)); target=${CTX_TARGET_K:-200}
if   [ $k -ge $target ]; then c='\033[31m'
elif [ $k -ge $((target*3/4)) ]; then c='\033[33m'
else c='\033[32m'; fi
printf "%s · %s · ${c}ctx %sk/%sk\033[0m" "$dir" "$model" "$k" "$target"
