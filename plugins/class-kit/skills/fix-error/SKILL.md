---
name: fix-error
description: แปะ error หรือรูปแคปจอ แล้วอธิบายเป็นภาษาคนว่าเกิดอะไร แล้วแก้ให้ ถ้าต้องกดเองบอกทีละขั้นพร้อมลิงก์. Use when the user types /fix-error, pastes an error message or screenshot, or says "error", "พัง", "ขึ้นแดง", "ใช้ไม่ได้", "ทำไมเป็นแบบนี้".
---

# fix-error

Reply in Thai, for someone who doesn't code.

1. If there is no error text or screenshot yet, ask for it once (แคปจอ หรือคัดลอกข้อความสีแดงมาแปะ).
2. Explain in 1–2 sentences: เกิดอะไรขึ้น (no jargon; if a term is needed, explain it in brackets).
3. Find the cause — read only the files the error points to. Check the simple causes first: wrong folder open, dev server not running, missing `.env` value, package not installed (`npm install`), typo in a URL.
4. Fix it if it's in the code or a command. Then show how to check: what to refresh or which link to open (full URL).
5. If the fix is in an account or dashboard (Supabase, Vercel, GitHub, Google Cloud, billing, permissions): give numbered steps with the direct link to that page. Don't guess menu names you're not sure of — say what to look for.
6. Never ask the user to paste passwords, tokens or secret keys into the chat. If a secret is needed, tell them which line of `.env` to put it in.
7. Same error after 2 tries → stop, say what you tried, and suggest asking the instructor with a screenshot.
