# NerdMarTech Claude Plugins

Plugins for [Claude Code](https://claude.com/claude-code) (terminal, VS Code, JetBrains) that make it cheaper and faster to work with.

ปลั๊กอินสำหรับ Claude Code (ใช้ได้ทั้ง terminal · VS Code · JetBrains) ช่วยประหยัด token และทำงานเร็วขึ้น

## Install · ติดตั้ง

In Claude Code, type:

```
/plugin marketplace add kwamkid/nerdmartech-claude-plugins
/plugin install context-saver@nerdmartech
```

Then start a new chat. Requires `jq` (`brew install jq` · `apt install jq`).

พิมพ์สองบรรทัดข้างบนใน Claude Code แล้วเปิดแชทใหม่ · ต้องมี `jq` ในเครื่อง

## Plugins

### context-saver

Every message re-reads the whole conversation, so a 200k-token chat costs roughly 2× a 100k one per call. This plugin keeps that visible and helps you cut the fixed overhead.

ทุกครั้งที่ Claude ทำงาน จะอ่านทั้งแชทใหม่หมด แชทยิ่งยาวยิ่งเปลือง ปลั๊กอินนี้ทำให้เห็นตัวเลขตลอด และช่วยตัดของที่ไม่ใช้ออก

| Part | What it does |
|---|---|
| **Context meter** (Stop hook) | After every reply: `context 82k / target 200k (41%) 🟢` — shown to you only, costs no tokens. Works in VS Code, where the status line doesn't show. |
| **Step warning** (UserPromptSubmit hook) | Warns once each time context crosses 100k, 150k, 200k… |
| **`/ctx-trim`** (skill) | Lists every skill, plugin and MCP server loaded in this project, proposes which to hide, and applies it **for this project only** after you confirm. `/ctx-trim reset` undoes it. |
| `scripts/statusline.sh` | Optional colored status line for the terminal (see below). |

**Settings** — add to `env` in `~/.claude/settings.json`:

```json
{
  "env": {
    "CTX_LANG": "th",
    "CTX_TARGET_K": "200",
    "CTX_STEP_K": "50"
  }
}
```

`CTX_LANG` = `en` (default) or `th` · `CTX_TARGET_K` = target in thousands of tokens · `CTX_STEP_K` = warning step.

**Optional terminal status line** — plugins can't register one, so add it yourself:

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/plugins/marketplaces/nerdmartech/plugins/context-saver/scripts/statusline.sh"
  }
}
```

(Check the path with `ls ~/.claude/plugins/marketplaces/`.)

## Claude app / Cowork

Hooks and `/ctx-trim` change Claude Code settings, so they only work in Claude Code. In the Claude app, `/context`-style meters are not available.

hook กับ `/ctx-trim` ทำงานเฉพาะใน Claude Code · ใน Claude app ใช้ไม่ได้

## License

MIT
