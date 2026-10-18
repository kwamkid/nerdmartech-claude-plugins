---
name: ctx-trim
description: Trim per-project context overhead — inventory every skill, plugin and MCP server loaded into this project, judge which are irrelevant to it, then (after the user confirms) hide or disable them for this project only via .claude/settings.local.json and ~/.claude.json. Use when the user types /ctx-trim, or says "context เปลือง", "ปิด skill ที่ไม่ใช้", "ปิด mcp โปรเจกต์นี้", "trim context", "too many skills loaded", or a fresh chat starts unusually high in /context. `/ctx-trim reset` undoes it.
---

# ctx-trim — per-project skill / plugin / MCP trimming

Goal: a fresh chat in this project should load only what this project uses. Everything is per-project and reversible. Reply to the user in their language (Thai for this owner); this file is English to save tokens.

## What actually costs context (explain briefly if the user is confused)
- **Skills**: name + description in every chat (~20–500 tokens each). Full body only when invoked.
- **MCP tools**: Claude Code defers them — only tool *names* sit in context (~10–20 tokens each). `/context` "MCP tools (deferred)" is NOT counted in the used total. Still worth cutting big unused servers (50+ tools).
- **CLAUDE.md / memory**: loaded every chat — usually the biggest fixed cost. Out of scope here; suggest moving domain detail into `.claude/rules/*.md` with `paths:` if CLAUDE.md is large.
- Invoked skills cannot be unloaded mid-chat — only `/clear` frees them.

## Step 1 — Inventory (read-only)
Run from the project root:
```bash
P="$PWD"
echo "== user skills";    ls ~/.claude/skills 2>/dev/null | grep -v '^synced$'
echo "== project skills"; ls .claude/skills .claude/commands 2>/dev/null
echo "== installed plugins"; jq -r '.plugins|keys[]' ~/.claude/plugins/installed_plugins.json 2>/dev/null
echo "== enabledPlugins (user/project/local)"; for f in ~/.claude/settings.json .claude/settings.json .claude/settings.local.json; do [ -f $f ] && jq -c --arg f $f '{f:$f,p:.enabledPlugins}' $f; done
echo "== MCP user";    jq -r '.mcpServers//{}|keys[]' ~/.claude.json
echo "== MCP project"; jq -r --arg p "$P" '.projects[$p].mcpServers//{}|keys[]' ~/.claude.json; [ -f .mcp.json ] && jq -r '.mcpServers|keys[]' .mcp.json
echo "== already disabled"; jq -c --arg p "$P" '.projects[$p].disabledMcpServers' ~/.claude.json
echo "== current overrides"; jq -c '{skillOverrides,syncClaudeAiPlugins,syncClaudeAiSkills}' .claude/settings.local.json 2>/dev/null
git check-ignore -q .claude/settings.local.json && echo "local settings: git-ignored OK" || echo "WARN: settings.local.json not ignored"
```
Also use what is already in your context: the skill listing (incl. `plugin:skill` and claude.ai-synced skills) and the deferred-tool name list (MCP servers, incl. `claude.ai <Name>` connectors and `plugin:<plugin>:<server>`).

Then learn what the project is: `package.json` / `pyproject.toml` / top of `README.md` / `CLAUDE.md` headings (Grep, not full reads).

## Step 2 — Classify & propose
For each skill / plugin / MCP server pick one:
| Level | Effect | Use for |
|---|---|---|
| keep | unchanged | used in this project |
| `name-only` | listed without description | maybe needed here occasionally |
| `user-invocable-only` | hidden from Claude, user can still type `/name` | belongs to other projects |
| `off` | hidden from both | never wanted here |
| plugin `false` | whole plugin disabled | plugin unrelated to project |
| MCP disabled | server not connected in this project | unrelated, or a duplicate of another server |

Never disable: the skill currently running, core workflow skills the user relies on everywhere (commit/push/memo-style), MCP servers for this project's own DB/infra. Prefer `user-invocable-only` over `off` when unsure.

Show one compact table (in the user's language) grouped by level with a one-line reason each, then confirm with AskUserQuestion (apply all / let me edit / cancel).

## Step 3 — Apply (only after confirmation)
Back up first: `cp .claude/settings.local.json <scratchpad>/` and `cp ~/.claude.json <scratchpad>/`.

Skills + plugins → `.claude/settings.local.json` (create `{}` if missing). Must be the **local** file: `syncClaudeAi*` are ignored in `.claude/settings.json`, and a plugin enabled in project settings can only be overridden in local.
```bash
jq --argjson so '{"skill-a":"user-invocable-only","skill-b":"name-only"}' \
   --argjson pl '{"plugin@marketplace":false}' \
   '.skillOverrides = ((.skillOverrides//{}) + $so) | .enabledPlugins = ((.enabledPlugins//{}) + $pl)' \
   .claude/settings.local.json > /tmp/sl.json && mv /tmp/sl.json .claude/settings.local.json
```
- All claude.ai-synced **plugins** irrelevant → `.syncClaudeAiPlugins = false`. All synced **skills** irrelevant → `.syncClaudeAiSkills = false` (otherwise use `skillOverrides` per skill).

MCP → per-project list in `~/.claude.json` (same list `/mcp` toggles). Names exactly as the server is named: `dfs-mcp`, `claude.ai Supabase`, `plugin:<plugin>:<server>`.
```bash
P="$PWD"; jq --arg p "$P" --argjson add '["server-a","claude.ai X"]' \
  '.projects[$p].disabledMcpServers = (((.projects[$p].disabledMcpServers//[]) + $add) | unique)' \
  ~/.claude.json > /tmp/cj.json && cat /tmp/cj.json > ~/.claude.json
```
(`cat >` keeps the file's inode/permissions.) Re-read both files with jq to verify.

## Step 4 — Report
Tell the user: what was hidden/disabled (counts), that it takes effect in the **next new chat**, and to compare `/context` there. Mention the backup location.

## `/ctx-trim reset`
Remove `skillOverrides`, the `false` entries added to `enabledPlugins`, and `syncClaudeAi*` from `.claude/settings.local.json`; remove the servers this skill added from `disabledMcpServers` (ask which, since the user may have toggled some via `/mcp`). Confirm before writing.
