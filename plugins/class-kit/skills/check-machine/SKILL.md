---
name: check-machine
description: เช็กเครื่องว่าพร้อมทำเว็บไหม (Git · Node · npm) แล้วบอกว่าขาดอะไร พร้อมลิงก์ติดตั้ง. Use when the user types /check-machine, or says "เช็กเครื่อง", "เครื่องพร้อมไหม", "ลงอะไรไม่ครบ", "check my machine".
---

# check-machine

Reply in Thai, as a short table. Only read versions — never install anything yourself.

1. Run each and note the version or "ไม่พบ":
   - `git --version` · `node -v` · `npm -v`
   - Git configured: `git config --global user.name` and `user.email` (empty = not set)
2. Table: | โปรแกรม | สถานะ | ต้องทำ | with ✅ / ❌.
   - Node older than v20 → ❌ "เก่าเกินไป".
3. For each ❌ give the direct link and one line:
   - Git (Windows): https://git-scm.com/download/win — กด Next จนจบได้เลย · Mac: พิมพ์ `xcode-select --install` ใน Terminal
   - Node.js (LTS): https://nodejs.org/en/download
   - Git name/email not set → offer to set it: ask for name + email, then run `git config --global user.name "…"` / `user.email "…"`.
4. After installing: "ปิด VS Code แล้วเปิดใหม่ 1 ครั้ง แล้วพิมพ์ /check-machine อีกรอบ" (new PATH needs a restart).
5. All ✅ → "เครื่องพร้อมแล้ว ✅".
