---
name: project-image
description: สร้างภาพประกอบการตลาดของโครงการด้วย Higgsfield ในสไตล์เดียวกันทุกครั้ง (ภาพบรรยากาศ ไลฟ์สไตล์ เทศกาล พื้นหลังโปรโมชัน) ไม่ใช้กับภาพตัวบ้านหรือโครงการจริง. Use when the user types /project-image, or says "เจนรูป", "สร้างภาพ", "ทำภาพประกอบโพสต์".
---

# project-image

Reply in Thai. Company files are in the company root (see CLAUDE.md "อะไรอยู่ไหน").

## Read first, every time
1. `00-Context/04-Image-Style.md` — image style, what must never appear, 2–3 reference photos, prompt pattern. Missing → help the user write it first (4 short sections), save, then continue.
2. `00-Context/02-Brand.md` — colours and personality.

## Steps
1. No subject/purpose given → ask once.
2. House, house plan, show unit, common area, location or site plan → **don't generate**. Suggest real photos from `01-Assets/photos/` instead (customers must not mistake AI images for what they will get).
3. Write the prompt with the pattern in `04-Image-Style.md`: [who/what] + [doing what, where] + [style] + [ratio] + [must not contain].
4. Show prompt, ratio (default 4:5) and count (default 2) → wait for "ok" (each image uses Higgsfield credits).
5. Generate with the Higgsfield tool if it's connected. Not connected → give the prompt to paste at https://higgsfield.ai and stop there.
6. Save images to `output/images/YYYY-MM-DD_<topic>_01.png` …, and the prompt to `output/images/YYYY-MM-DD_<topic>.md`.
7. Remind: when used, label it "ภาพจำลองเพื่อการโฆษณา".

## Rules
- Illustration only — never a stand-in for the real house.
- No real people, no other brands' logos or names.
- No text, prices or logos inside the image — add them later from real files (numbers must match `01-Company.md`).
- Keep the style from `04-Image-Style.md`; only the content changes.
- Bad result → ask before generating again.
