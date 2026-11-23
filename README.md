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

### class-kit — Nerd MarTech Class Kit (Thai)

Starter kit for the Nerd MarTech AI course: chat-length + quota meter after every reply, `/memo` `/todo` `/setup-folders` `/check-machine` `/fix-error` `/push` `/ui-check` `/project-post` `/project-image`. → [plugins/class-kit](plugins/class-kit/README.md)

```
/plugin install class-kit@nerdmartech
```

### context-saver

Every message re-reads the whole conversation, so a 200k-token chat costs roughly 2× a 100k one per call. This plugin keeps that visible and helps you cut the fixed overhead.

ทุกครั้งที่ Claude ทำงาน จะอ่านทั้งแชทใหม่หมด แชทยิ่งยาวยิ่งเปลือง ปลั๊กอินนี้ทำให้เห็นตัวเลขตลอด และช่วยตัดของที่ไม่ใช้ออก

| Part | What it does |
|---|---|
| **Context meter** (Stop hook) | After every reply: `context 82k / target 200k (41%) 🟢` — shown to you only, costs no tokens. Works in VS Code, where the status line doesn't show. |
| **Step warning** (UserPromptSubmit hook) | Warns once each time context crosses 100k, 150k, 200k… |
| **`/ctx-trim`** (skill) | Lists every skill, plugin and MCP server loaded in this project, proposes which to hide, and applies it **for this project only** after you confirm. `/ctx-trim reset` undoes it. |
| **`/tbc-memo`** (skill) | Saves where you are to `memo/tbc/<topic>.md` (≤3k chars, English) — one file per topic, so several chats in one repo don't overwrite each other. |
| **`/tbc-continue`** (skill) | In a fresh chat: lists open topics, loads only the one you pick, checks it against git, proposes the next step, then deletes that note. |
| `templates/token-rules.md` | Short token-saving rules to paste into `CLAUDE.md` (`/ctx-trim` offers to add them). |
| `scripts/statusline.sh` | Optional colored status line for the terminal (see below). |

**The habit it teaches** — one chat = one task:

```
work → meter turns yellow / warning → /tbc-memo → /clear → /tbc-continue → keep working
```

You carry ~1k tokens of notes into the new chat instead of re-reading 150k+ of history on every reply.

วิธีใช้ให้ประหยัด: 1 แชท = 1 งาน · เตือนเมื่อไหร่ให้ `/tbc-memo` → `/clear` → `/tbc-continue` · ยกบันทึกสั้น ๆ ไปแชทใหม่แทนการลากประวัติแชทยาว ๆ ไปทุกข้อความ

> After `/ctx-trim` or any settings/plugin/MCP change, **restart Claude Code** (close the panel or reload the window). `/clear` does not reload settings.
>
> แก้ค่าตั้ง/ปลั๊กอิน/MCP แล้วต้องปิด-เปิด Claude Code ใหม่ · `/clear` ไม่โหลดค่าใหม่

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
