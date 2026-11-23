---
name: project-post
description: เขียนโพสต์การตลาดของโครงการบ้านตามน้ำเสียงและข้อมูลจริงของบริษัท สำหรับ Facebook หรือ LINE OA. Use when the user types /project-post, or asks for a post, caption or promo text ("เขียนโพสต์", "แคปชัน", "ข้อความโปรโมต").
---

# project-post

Reply in Thai. Company files are in the company root (the folder whose CLAUDE.md has the "อะไรอยู่ไหน" table — usually two levels up from `10-Project/<งาน>`).

## Read first, every time
1. `00-Context/02-Brand.md` — voice, words to use/avoid, contact line
2. `00-Context/01-Company.md` — project facts, prices, promotions, conditions
3. `00-Context/03-Sample-Posts.md` — posts the company likes
Missing file → say which one and offer `/setup-folders`.

## Steps
1. No topic given → ask once. No channel → Facebook.
2. Pull the relevant facts from `01-Company.md`.
3. Write 2 versions with different opening angles (not just reworded).
4. Suggest a photo for each from `01-Assets/photos/` (file name + why).
5. Under the posts, list every number used and the line it came from in `01-Company.md`.
6. Save to `output/posts/YYYY-MM-DD_<topic>.md`.

## Rules
- Prices, promotions, sizes, location, distances and dates come ONLY from `01-Company.md`. Not there → stop and ask. Never invent.
- Promotions always carry their end date or condition.
- No promises about returns, future prices or loan approval. No other companies' projects.
- Match sample posts: length, line breaks, emoji use. Facebook = short paragraphs with a clear first line · LINE OA = shorter, ends with one action.
- End with the contact line from `02-Brand.md`.
