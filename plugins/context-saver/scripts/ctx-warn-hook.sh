#!/bin/bash
# UserPromptSubmit hook: warn once each time context crosses a step (default every 50k, from 100k).
# Env: CTX_STEP_K (default 50) · CTX_TARGET_K (default 200) · CTX_LANG=th|en
here=$(cd "$(dirname "$0")" && pwd)
tp=$(jq -r '.transcript_path // ""')
k=$(( $("$here/ctx-tokens.sh" "$tp") / 1000 ))
s=${CTX_STEP_K:-50}; target=${CTX_TARGET_K:-200}
step=$(( k / s * s ))
[ $step -lt 100 ] && exit 0
state="${TMPDIR:-/tmp}/claude-ctx-warn-$(basename "$tp" .jsonl)"
last=$(cat "$state" 2>/dev/null || echo 0)
[ $step -le $last ] && exit 0
echo $step > "$state"
if [ "$CTX_LANG" = th ]; then
  [ $k -ge $target ] && m="context ${k}k เกินเป้า ${target}k แล้ว — จบงานนี้แล้ว /tbc-memo → /clear → /tbc-continue" \
                     || m="context ${k}k (ข้าม ${step}k) — ถ้างานย่อยนี้จบแล้ว /tbc-memo → /clear จะถูกกว่า"
else
  [ $k -ge $target ] && m="context ${k}k is over the ${target}k target — finish this task, then /tbc-memo → /clear → /tbc-continue" \
                     || m="context ${k}k (passed ${step}k) — if this sub-task is done, /tbc-memo → /clear is cheaper"
fi
jq -n --arg m "$m" '{systemMessage:$m}'
