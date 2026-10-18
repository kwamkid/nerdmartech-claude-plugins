## Token saving
- Every reply re-reads the whole chat: cost grows with chat length, not with the number of prompts. One chat = one task.
- When a sub-task is done and context is past ~150k: `/tbc-memo` → `/clear` → `/tbc-continue`.
- Read big files by range (offset/limit) or Grep first. Never read a whole file "just in case".
- Keep this file short. Topic-specific rules go in `.claude/rules/<topic>.md` with `paths:` frontmatter so they load only when matching files are touched.
- Notes Claude re-reads (memo, rules, tbc notes) are written in English — non-Latin scripts cost 2–3× tokens. Replies to the user stay in their language.
- Use subagents only when the work is really parallel or would flood this chat with file dumps — each one starts a fresh context.
- Changed settings, plugins or MCP servers? Restart Claude Code (close the panel / reload the window). `/clear` does not reload them.
