---
name: ship
description: เอาเว็บขึ้นออนไลน์ — เช็ก build, commit, push ขึ้น GitHub แล้ว Vercel deploy ให้เอง ส่งลิงก์ให้กด. Use when the user types /ship, or says "เอาขึ้นเว็บ", "ขึ้นออนไลน์", "deploy", "อัปเดตเว็บจริง", "ship".
---

# ship — build → commit → push → Vercel

Reply in Thai, short. Typing /ship = permission to push this time only.

1. `git status --short`. Nothing changed and nothing to push → "ไม่มีอะไรใหม่ให้ขึ้น" and stop.
2. Safety: if `.env`, `.env.local` or any file with keys is about to be committed → stop and add it to `.gitignore` first.
3. `npm run build`. Fails → explain in plain Thai, fix, build again. Don't push a broken build.
4. Commit: `git add -A` then `git commit -m "<short summary of what changed>"`.
5. `git push`. If no remote yet → explain the project must be connected to GitHub first (course step 1.10) and stop.
6. Vercel deploys by itself after a push (the project is connected to GitHub). Tell the user:
   - "Vercel กำลังอัปเดต ประมาณ 1–2 นาที"
   - Production link: read it from CLAUDE.md (`เว็บจริง:` line). Not recorded yet → ask the user for the link from https://vercel.com/dashboard once, then add `เว็บจริง: <url>` to CLAUDE.md.
   - Check: `curl -s -o /dev/null -w "%{http_code}" <url>` until 200 (try up to 6 times, ~20 s apart). Then: "ขึ้นแล้ว ✅ กดดูได้ที่ <url>".
7. Build failed on Vercel but passed locally → usually a missing Environment Variable: give the link `https://vercel.com/dashboard` → project → Settings → Environment Variables, and name which variable.
