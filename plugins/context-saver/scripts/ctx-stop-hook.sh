#!/bin/bash
# Stop hook: after every reply, show context used vs target. systemMessage is shown to the user only (no token cost).
# Env: CTX_TARGET_K (default 200) · CTX_LANG=th|en (default en)
here=$(cd "$(dirname "$0")" && pwd)
tp=$(jq -r '.transcript_path // ""')
k=$(( $("$here/ctx-tokens.sh" "$tp") / 1000 ))
[ $k -eq 0 ] && exit 0
target=${CTX_TARGET_K:-200}
pct=$(( k * 100 / target ))
warn=$(( target * 3 / 4 ))
if [ "$CTX_LANG" = th ]; then L1='เป้า'; L2='เกินเป้า — /clear หรือ /compact'; L3='ใกล้เป้า'
else L1='target'; L2='over target — /clear or /compact'; L3='near target'; fi
if   [ $k -ge $target ]; then tag="🔴 $L2"
elif [ $k -ge $warn ];   then tag="🟡 $L3"
else tag='🟢'; fi
jq -n --arg m "context ${k}k / $L1 ${target}k (${pct}%) ${tag}" '{systemMessage:$m}'
