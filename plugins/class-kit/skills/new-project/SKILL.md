---
name: new-project
description: เริ่มโปรเจกต์ใหม่เองตั้งแต่โฟลเดอร์ว่าง — สร้างโฟลเดอร์ใน 10-Project + CLAUDE.md + memo/ → (ถ้าเป็นเว็บ) ตั้งต้นจาก template หรือ Next.js เปล่า → git → GitHub repo → Vercel → Supabase ถ้าต้องเก็บข้อมูล แล้วถามว่าอยากได้อะไร. Use when the user types /new-project, or says "เริ่มโปรเจกต์ใหม่", "ทำโปรเจกต์ใหม่", "สร้างงานใหม่", "เริ่มเว็บใหม่", "new project".
---

# new-project — empty folder → online project, step by step

Reply in Thai, short, one step at a time. The user is a beginner: every time they must click something, give the full clickable URL and say exactly which button. Wait for "เสร็จแล้ว" before the next step that depends on it.

## 1. Ask (one message, AskUserQuestion if available)
- ชื่อโปรเจกต์ (อังกฤษ ตัวเล็ก ขีดกลาง เช่น `baan-suan-site`) + ทำอะไร 1 บรรทัด
- เป็นเว็บ/ระบบที่ต้องขึ้นออนไลน์ไหม (ใช่ = ทำขั้น 3–6 · ไม่ใช่ เช่น งานเขียนโพสต์ = จบที่ขั้น 2)
- เริ่มจากอะไร: template ที่อาจารย์แจก (ขอลิงก์ GitHub) · หรือเว็บเปล่า (Next.js)
- ต้องเก็บข้อมูล/ล็อกอินไหม (ใช่ = ทำขั้น 6 Supabase)

## 2. Folder + CLAUDE.md + memo/
- Find the company folder: walk up from the current folder looking for `10-Project/`. Not found → ask where the company folder is (made by `/setup-folders`, default `~/AI-Class`). Never create code projects inside Dropbox / OneDrive / iCloud / Google Drive (warn and suggest `~/AI-Class`).
- Create `10-Project/<name>/` with:
  - `CLAUDE.md` (≤ 15 lines):
    ```
    # <name> — <one line>
    บริษัท: ดูข้อมูลบริษัท แบรนด์ ราคา ที่ `../../00-Context/` (อ่านเฉพาะไฟล์ที่ต้องใช้)
    เว็บจริง: (ยังไม่มี)
    ## อะไรอยู่ไหน
    | เรื่อง | ไฟล์ |
    |---|---|
    | งานที่ทำแล้ว · งานค้าง | `memo/NOTES.md` · `memo/TODO.md` |
    ```
  - `memo/NOTES.md` (empty heading) and `memo/TODO.md` (`เริ่มต่อที่: -`).
- Never overwrite an existing folder or file: if `10-Project/<name>/` exists → ask for another name.
- Not a web project → tell them: "เปิดโฟลเดอร์นี้ใน VS Code (File → Open Folder) แล้วเปิดแชตใหม่" and stop.

## 3. Starting code
- Template → `git clone <url> .` inside the new folder (folder must be empty except the 3 files above: clone into a temp subfolder, then move its contents up, keep our CLAUDE.md content by merging the template's CLAUDE.md under it). Then `rm -rf .git` so the project starts its own history. If the template has `.env.example` → copy to `.env.local` and list which values are still empty.
- Empty web → `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-npm --yes` (folder must contain only our 3 files; if create-next-app refuses, create in a temp subfolder and move up).
- `npm install` if not done.
- **Theme first, before any page:** if the project has `docs/DESIGN.md` / a theme file (`globals.css` tokens, `/theme` page) → fill it from `../../00-Context/02-Brand.md` (logo, font, colours, sizes) and put the logo into `public/`. Empty web → create the tokens in `globals.css` (colours, font, font sizes, radius, button) + a `/theme` preview page. Tell the user: "ทุกหน้าที่สร้างต่อจากนี้ใช้ค่าจาก theme นี้ · เปลี่ยนแบรนด์ทีหลังแก้ที่เดียว".
- Run it: start `npm run dev` and send the link `http://localhost:3000` to click. "เห็นหน้าเว็บแล้วบอกผมครับ".

## 4. Git + GitHub
- `.gitignore` must contain `.env*` (except `.env.example`), `node_modules`, `.next`. Check before the first commit.
- Before the first commit check `git config user.email` is set and `~/.claude/settings.json` has `"attribution": {"commit": "", "pr": ""}` — missing → run the fix from `/check-machine` first (Vercel Hobby refuses to deploy a private repo when a commit carries a co-author or an email that isn't the owner's GitHub email).
- `git init -b main` · `git add -A` · `git commit -m "start <name>"`.
- Tell the user: open https://github.com/new → Repository name = `<name>` → **Private** → do NOT tick README → กด **Create repository** → copy the link that ends with `.git` and paste it here.
- `git remote add origin <link>` · `git push -u origin main`. Login popup → tell them to sign in with GitHub in the browser window.

## 5. Vercel
- Tell the user: open https://vercel.com/new → หา repo `<name>` → กด **Import**. If the project has `.env.local` values → open **Environment Variables** on that page and add each one (list names; tell them to copy values from `.env.local`, never paste keys into chat) → กด **Deploy**.
- When done, ask for the link (`https://<name>.vercel.app`) → write it to `เว็บจริง:` in CLAUDE.md. From now on `/push` = push → Vercel updates by itself.

## 6. Supabase (only if data/login is needed)
- Tell the user: open https://supabase.com/dashboard/new → choose org → Project name `<name>` → set a database password (save it in their password manager) → Region **Singapore** → **Create new project**.
- Then Project Settings → API Keys: copy Project URL + publishable key into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) and the same two into Vercel → Settings → Environment Variables. Give the link https://vercel.com/dashboard.
- Google login is set up later, in its own chat (as in course step 1.10b).

## 7. Finish
- Write `memo/NOTES.md`: date · "ตั้งโปรเจกต์" · links (GitHub, Vercel, Supabase). `memo/TODO.md`: `เริ่มต่อที่: บอก Claude ว่าอยากได้หน้าอะไรเป็นหน้าแรก`.
- Commit (`git add -A` · `git commit -m "project setup notes"`) and push.
- End with:
  ```
  ✅ โปรเจกต์ <name> พร้อมแล้ว
  เครื่องเรา: http://localhost:3000 · เว็บจริง: <url>
  ต่อไป: /memo → /clear → แชตใหม่ แล้วบอก Claude ว่าอยากได้อะไร (1 เรื่อง = 1 แชต)
  ```
