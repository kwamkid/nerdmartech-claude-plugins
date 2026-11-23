---
name: setup-folders
description: สร้างโครงโฟลเดอร์บริษัท + CLAUDE.md สารบัญ + กฎตั้งต้น 7 ข้อ. Use when the user types /setup-folders, or says "ตั้งโฟลเดอร์", "สร้างโครงโฟลเดอร์บริษัท", "setup folders".
---

# setup-folders — company folder + index + starter rules

Reply in Thai. Ask before writing anything outside the new folder.

## 1. Ask (one message, AskUserQuestion if available)
- ชื่อบริษัท (ภาษาอังกฤษสำหรับชื่อโฟลเดอร์ + ชื่อไทยสำหรับเนื้อหา)
- บริษัททำอะไร 1 บรรทัด · ชื่อโครงการ
- วางโฟลเดอร์ที่ไหน — default `~/AI-Class` (Windows `C:\Users\<name>\AI-Class`).
  ⚠️ If the path is inside Dropbox / OneDrive / iCloud / Google Drive: warn that code folders must not be synced (node_modules = tens of thousands of files) and suggest the default.

## 2. Create
```
<root>/
├── CLAUDE.md            ← from templates/company-CLAUDE.md (fill {{…}})
├── 00-Context/01-Company.md · 02-Brand.md · 03-Sample-Posts.md · 04-Image-Style.md   ← from templates/context-files.md
├── 01-Assets/logo/ · 01-Assets/photos/
├── 02-Knowledge/
└── 10-Project/01-marketing/ (CLAUDE.md 5 lines + memo/ + output/posts/ + output/images/)
```
Templates live in the plugin folder `templates/` (two levels up from this SKILL.md: `../../templates/`). Fill company/project names; leave other fields blank for the user.
Never overwrite an existing file — skip it and list it.

## 3. Starter rules (ask first)
- Show the 7 rules from `templates/starter-rules.md` and ask: "ใส่กฎ 7 ข้อนี้ใน ~/.claude/CLAUDE.md ไหมครับ (ใช้กับทุกโปรเจกต์)".
- Yes → append the block to `~/.claude/CLAUDE.md` (create if missing). If the marker `nerd-class-kit:starter-rules` is already there, don't add again.

## 4. Finish
- Show the tree that was created, as clickable links.
- Next steps: กรอก `00-Context/01-Company.md` และ `02-Brand.md` · วางโลโก้/รูปจริงใน `01-Assets/` · เปิด VS Code ที่ `10-Project/<งาน>` ทีละงาน.
