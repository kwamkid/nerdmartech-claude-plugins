---
name: todo
description: ทำงานค้างต่อในแชตใหม่ — อ่าน memo/TODO.md เช็กว่าของจริงตรงกับที่จด แล้วเสนองานข้อแรก. Use when the user types /todo, or says "ทำต่อ", "งานค้างมีอะไร", "ค้างอะไรอยู่", "continue", "resume".
---

# todo — pick up where the last chat stopped

Reply in Thai, short. Read as little as possible (every file read costs quota).

## Steps
1. Read `memo/TODO.md` only. Missing or no `- [ ]` items → say "ไม่มีงานค้าง สั่งงานใหม่ได้เลย" and stop.
2. Read only the files the first open item names. Don't scan the whole project.
3. Check reality quickly:
   - Git project → `git status --short` and `git log --oneline -5`.
   - An item already done in the files/git → tick it in TODO.md and say so.
   - A file the item mentions is gone → say so.
4. Show (≤ 8 lines): where it stands · open items numbered · anything that doesn't match.
5. Ask one question: "เริ่มจากข้อ 1 (<item>) เลยไหมครับ" and wait.
6. While working, tick items as they finish so progress survives if the chat ends.
