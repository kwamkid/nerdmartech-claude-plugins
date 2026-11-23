---
name: memo
description: สรุปงานก่อนปิดแชต — จดสิ่งที่ทำและตัดสินใจลง memo/NOTES.md งานค้างลง memo/TODO.md แล้วบอกว่าปิดแชตได้ไหม. Use when the user types /memo, or says "สรุปงาน", "จดไว้", "จบเรื่องนี้", "จะปิดแชต", "save progress", or the stop hook says the chat is long.
---

# memo — summarize this chat so a fresh chat can continue

Reply in Thai, short. Write the memo files in plain Thai a beginner can read.

## Steps
1. Work out the topic of this chat (one short name, e.g. "ตั้งโปรเจกต์ SalesDesk").
2. Append to `memo/NOTES.md` (create `memo/` if missing), newest on top:
   ```
   ## <YYYY-MM-DD> · <topic>
   - ทำแล้ว: … (what changed, which files)
   - ตัดสินใจ: … (choices made and why, in one line each)
   - ข้อควรระวัง: … (anything that broke or surprised us; skip if none)
   ```
3. Update `memo/TODO.md`:
   - Every unfinished item as `- [ ] <item> — ขั้นถัดไป: <exact next action>`.
   - Tick items finished in this chat (`- [x]`). Remove nothing else.
   - Top line: `เริ่มต่อที่: <the first item>` (replace the old one).
4. If this chat created new folders or important files, add one line each to the "อะไรอยู่ไหน" table in the nearest `CLAUDE.md`. Keep CLAUDE.md short; never paste notes into it.
5. If this is a git project, commit the memo files together with the work (`git add memo/ <changed files>` then `git commit -m "<topic>"`). Do not push.
6. End with ONE status line:
   - `✅ ปิดแชตได้` — topic finished, nothing open.
   - `⏳ ค้าง N ข้อ (อยู่ใน memo/TODO.md) — ปิดแชตได้ แชตใหม่พิมพ์ /todo`
   Then remind: `พิมพ์ /clear เพื่อเริ่มแชตใหม่`.

## Don't
- Don't copy the whole conversation. A new person should read NOTES + TODO in one minute.
- Don't write secrets (keys, passwords) into memo files.
