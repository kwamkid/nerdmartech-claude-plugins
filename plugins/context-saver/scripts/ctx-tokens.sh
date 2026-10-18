#!/bin/bash
# Print current context size (tokens) of a Claude Code transcript: last main-thread assistant usage.
f="$1"; [ -f "$f" ] || { echo 0; exit 0; }
tail -n 400 "$f" | jq -r 'select(.type=="assistant" and (.isSidechain|not) and .message.usage!=null)
  | .message.usage | ((.input_tokens//0)+(.cache_creation_input_tokens//0)+(.cache_read_input_tokens//0))' 2>/dev/null | tail -n 1 | grep . || echo 0
