---
name: tbc-memo
description: Checkpoint the current session into a small "to be continued" note (one file per topic in memo/tbc/) so a fresh chat can resume with /tbc-continue instead of re-reading a long conversation. Use when the user types /tbc-memo, or says "save progress", "checkpoint", "memo the session", "จดไว้ทำต่อ", "เดี๋ยวมาทำต่อ", or is about to /clear a long chat.
---

# tbc-memo — checkpoint this session so the next chat can resume

Why: every reply re-reads the whole chat, so a long chat gets expensive. The cheap pattern is
`/tbc-memo` → `/clear` → `/tbc-continue`: carry over ~1k tokens of notes instead of 150k of history.

## Rules
- **One file per topic**: `memo/tbc/<slug>.md`. Several chats can work in the same repo at once; each owns its own file. **Never edit or delete another topic's file.**
- **Write the note in English**, whatever language the chat is in — non-Latin scripts cost 2–3× more tokens to re-read. Reply to the user in their language.
- **Budget ≤ 3,000 characters.** Link to files/plans/commits instead of copying their content.
- Throwaway working state only. Durable knowledge (a trap you keep hitting, a convention, a decision) belongs in project docs or `.claude/rules/` — tell the user which items to move there; don't bury them here.
- Never commit the note.

## Step 1 — Place the file
1. Folder: `memo/tbc/` (create it). Make sure it's not tracked: if `git check-ignore -q memo/tbc/x.md` fails, add `memo/` to `.git/info/exclude` (local-only, no tracked change) and tell the user.
2. Slug: short kebab-case name of this session's topic (`checkout-refactor`, `backup-staging`).
   - `ls memo/tbc/` first. If a file is this same topic (e.g. this chat started from it via /tbc-continue), update it in place. If the slug is taken by a different topic, choose another.

## Step 2 — Gather (cheap)
- `git status --short` and `git log --oneline -5`; run the project's typecheck/lint if it has one, tail only.
- Re-read your own tool results for what actually happened. Don't record intentions as done.

## Step 3 — Write
```markdown
# <Topic title> — YYYY-MM-DD
Status: <one line: where it stands>

## TL;DR
<2–3 lines: goal, who it's for, where it lives in the code>

## Done
- <grouped by theme, links like [file.ts](path/file.ts), commit hashes, migrations applied>

## State
- <typecheck/test result · uncommitted work · temp scaffolding to remove>

## Next up
- [ ] <first item, ready to start immediately>
- [ ] <…in priority order>

## Open questions
- <user's own words where possible>

## Gotchas
- <non-obvious traps for this checkpoint only>
```
Omit empty sections. No code blocks unless a snippet is the only clear way to state a convention.

## Step 4 — Tell the user (2–3 lines, their language)
Saved path · the first "Next up" item · "now `/clear`, then `/tbc-continue`". If you spotted durable knowledge, list it in one line and suggest where it belongs.
