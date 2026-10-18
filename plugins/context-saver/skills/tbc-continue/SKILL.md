---
name: tbc-continue
description: Resume work in a fresh chat from a note written by /tbc-memo (memo/tbc/<topic>.md) — list open topics, load only the chosen one, verify it against git, propose the first action, then delete that note once the user confirms. Use when the user types /tbc-continue, or says "continue where we left off", "resume", "ทำต่อจากเมื่อวาน", "what's next".
---

# tbc-continue — resume from a tbc note

The codebase and git are the truth; the note is a hint. Reply in the user's language.

## Step 1 — Pick the note (read as little as possible)
```bash
ls -t memo/tbc/*.md 2>/dev/null | while read f; do echo "== $f ($(date -r "$f" +%F))"; head -2 "$f"; done
ls memo/tbc.md tbc.md 2>/dev/null   # legacy single-file notes
```
- None → say so and ask what to work on. Don't invent context.
- One → use it. Several → ask which (show title · date · Status line). The user may name one in their message.
- Legacy `memo/tbc.md` / `tbc.md` with several sections → treat each `##` session as a topic; only use the chosen one.

Read only the chosen file.

## Step 2 — Verify (in parallel, cheap)
- `git status --short` · `git log --oneline -10`
- The project's typecheck/test command (see CLAUDE.md), tail only. Errors that aren't from this topic → mention, don't fix.
- Spot-check "Done" claims with `git log --oneline -- <path>` or Grep — don't open files for that.
- Open only the code needed for the **first** "Next up" item, and only the relevant range.

Drift to flag before doing anything: Done but missing from code/git · Next up already shipped · referenced file/branch/column gone. Note older than ~7 days → warn that it may be stale.

## Step 3 — Propose (≤ 10 lines)
State of the project · the first Next-up item (quoted) · any blocking open question or drift · one concrete question: "Start with X?"
Wait for confirmation. The user may pick a different item.

## Step 4 — Hand off
- Re-read the note's Gotchas before editing code. Durable ones → suggest moving them to `.claude/rules/` or project docs before the note is deleted.
- After the user confirms a next step and there is no unresolved drift: `rm memo/tbc/<slug>.md` (only that file; for a legacy file, remove only the chosen section). Say so in one line.
- When this chat is done, `/tbc-memo` writes a fresh note.

## Don't
- Read every note "just in case", or paste the note back to the user.
- Fix things the note didn't flag — they may be intentional.
- Delete the note before the user confirms, or touch other topics' notes.
