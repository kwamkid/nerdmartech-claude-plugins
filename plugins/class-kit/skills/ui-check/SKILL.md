---
name: ui-check
description: เช็กหน้าเว็บทุกขนาดจอ (มือถือ · แท็บเล็ต · โน้ตบุ๊ก · จอใหญ่) ว่าอะไรล้นจอ ปุ่มหลุด ตัวหนังสือโดนตัด สีจาง hover แล้วมองไม่เห็น ฟอนต์เพี้ยน แล้วแก้ให้ — วัดหน้าจริงใน Chrome ด้วยสคริปต์ ไม่ใช่เดา. Use when the user types /ui-check, /UI-check or /mobile-check, or says "เช็ค responsive", "เช็กมือถือ", "เช็คมือถือ", "ดูในมือถือ", "ล้นจอ", "หลุดจอ", "เกินจอ", "ปุ่มหลุด", "ดูทุกขนาดจอ", "responsive", "check mobile", "check overflow", "สีปุ่ม", "hover แล้วมองไม่เห็น", "ไอคอนหาย", "ฟอนต์เพี้ยน", "contrast". Args: a URL/route, a file path, or nothing (= pages changed in git diff).
---

# ui-check — every screen size, measured on the real page

The student is not a coder. Reply in plain Thai, no jargon without a short explanation. Goal: nothing on any page sticks past the screen or gets cut off, at any width — and colours, hover and fonts look right.

## Widths to test (always all 7)

| name | width | why |
|---|---|---|
| phone S | 360 | small Android |
| phone | 390 | iPhone |
| tablet | 768 | iPad portrait, `md` breakpoint |
| small laptop | 1024 | `lg` breakpoint — an open sidebar eats ~250px, content gets ~770px. **Most bugs live here** |
| laptop | 1280 | 13" laptop, sidebar open |
| desktop | 1440 | |
| wide | 1920 | nothing stretches absurdly (lines of text > ~120ch, one card filling the full width) |

If the app has a sidebar, test 1024 and 1280 with the sidebar **open** (the default state).

## Step 1 — find the target pages

- Arg is a URL/route → that page. Arg is a file → the route(s) that render it.
- No arg → `git diff --name-only HEAD` + untracked files under `app/`, `src/app/`, `components/`; map changed components to the pages that use them (grep imports). Cap at ~5 pages; ask if more.

## Step 2 — static scan of the code (cheap, do first)

Grep the target files for these and judge each hit in context:

| pattern | problem | fix |
|---|---|---|
| `flex-1` / `grow` on an item holding text, without `min-w-0` | flex item won't shrink below its content → pushes siblings (buttons) off screen | add `min-w-0` |
| `truncate` / `line-clamp` whose flex/grid parent chain lacks `min-w-0` | truncate silently does nothing | `min-w-0` on every flex ancestor up to the card |
| `min-w-fit`, `min-w-max`, `whitespace-nowrap` on long/user text | can't wrap | remove, or `shrink-0` only on short fixed things (dates, buttons) |
| `w-[NNNpx]` / `min-w-[NNNpx]` > 320 without a breakpoint | wider than phones | `w-full sm:w-[..]` / `max-w-[..] w-full` |
| `flex` row with title + action buttons, no `flex-wrap` / no `flex-col sm:flex-row` | buttons fall off on phone | stack on phone, `shrink-0` on the action group |
| `grid-cols-N` (N≥3) without `sm:`/`md:` prefix | squashed on phone | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N` |
| `<table>` not wrapped in `overflow-x-auto` | page scrolls sideways | wrap it |
| `absolute` popovers/menus anchored right/left at edges | open off screen | the project's menu component, or flip side on small screens |
| long unbroken text (URLs, IDs, emails) | no break point | `break-words` / `break-all` |

Fix in the shared component when the bug is there (e.g. `components/`), not page by page. Follow the project's own rules in `CLAUDE.md` / `.claude/rules/` if it has them.

## Step 3 — measure in Chrome

1. Load the chrome tools in one ToolSearch call (see `anthropic-skills:chrome-browser`): `tabs_context_mcp, tabs_create_mcp, navigate, resize_window, javascript_tool, computer`. No Chrome tools → do Step 2 only, say in the report that the real page was not measured, and tell the student how to look: open the localhost link in Chrome → `F12` (Mac `Cmd+Option+I`) → click the phone icon → try iPhone and iPad.
2. Find the dev server port — don't assume 3000: read the `"dev"` script in `package.json` (`-p 3001` …), and check what is listening with `lsof -iTCP -sTCP:LISTEN -P | grep node` (Windows: `netstat -ano | findstr LISTENING`). **Not running → ask the student to open a terminal in the project folder and run `npm run dev`, then wait** — do not start it yourself. Production site: read only, never press save/approve/delete.
   Open the page in a **new tab** as a full `http://localhost:<port>/…` link. **Make sure it shows real data** — a long row is what breaks things. An empty list / "no data yet" state passes trivially and proves nothing: switch filters, pick a date that has data, or say plainly in the report that the page with data was not measured.
3. **Measure every width in a same-origin iframe**, not `resize_window` (it often does nothing — the window stays the same width). An iframe can be wider than the window, and media queries inside follow the iframe's width, so 360 and 1920 are both true layouts:
   ```js
   const f = document.createElement('iframe'); f.src = location.href;
   f.style.cssText = 'width:1024px;height:900px;border:0;display:block';
   document.body.appendChild(f);  // await load + ~6s for data, then prep (set filters by clicking inside f.contentDocument)
   JSON.parse(f.contentWindow.eval(PROBE_SOURCE))   // PROBE_SOURCE = probe.js text, stored once in window.__probeSrc
   ```
   - The iframe reloads the page, so filters/tabs reset — re-apply them inside each iframe before probing.
   - javascript_tool times out at **45s**. Loop the widths in a promise that writes to `window.__res`, return immediately, then poll with `await sleep(40000)` calls. Navigating the tab wipes `window.__*`, so re-inject after any navigation.
   - If there is a sidebar, record its width at 1024/1280 to prove it was open.
4. Run [probe.js](probe.js) (read the file, pass its content to javascript_tool). It returns JSON:
   - `pageScrollX` > 0 → the page scrolls sideways
   - `offscreen` → elements past the right edge (`interactive: true` = a button/link the user can't reach — top priority)
   - `clipped` → buttons cut by an `overflow:hidden` parent
   - `noShrink` → flex children wider than their parent (missing `min-w-0`)
   - `textCut` → text cut without "…"
5. **Style probe — colour, font, hover** ([probe-style.js](probe-style.js)), run once at 1280 and once at 390 (hover only matters on desktop; colours/fonts can differ on phone). It simulates hover by copying every `:hover` CSS rule into a temp class and applying it to one button/link at a time (ancestors too, like a real pointer), transitions off. Returns:
   - `lowContrast[]` — `{el, state: normal|hover, kind: text|icon, fg, bg, ratio, need}` (WCAG: text 4.5, large text/icons 3). Group by `state+fg/bg` before reading — one bad colour shows up dozens of times.
     Severity: **ratio < 2 = broken** (can't see it — e.g. white icon on a cream hover circle; always fix) · 2–3 = weak (fix, unless it is clearly the brand's chosen colour pair — then mention it once and ask) · 3–4.5 on body text = note.
     Hover bugs are usually one of: hover background flips light/dark but text colour stays → add the matching `hover:text-*`; icon has a hard-coded colour instead of `currentColor` → use `currentColor`; hover style on the wrapper only.
   - `hoverNoFeedback[]` — clickable (`cursor:pointer`) things that look identical on hover. Fine for plain text links inside menus; fix for buttons/cards.
   - `fonts` (first family → count) + `fallbackFonts[]` (declared webfont not loaded → page shows a system font; check the font import / `next/font` / file path). More than 2 families in body UI = inconsistent.
   - `sizes` (px → count) — compare with the project's font scale. **Read the project's theme file** (e.g. `src/app/globals.css`, `app/globals.css`, `tailwind.config.*`) for the font sizes and brand colours it defines; a size not in that scale = hard-coded, move it to the scale. `tinyText[]` = under 12px.
   - `buttonColours` (solid button background → count) — compare with the colours in the theme file; a colour that is not there = off-brand.
   - `blockedSheets` > 0 = cross-origin CSS whose :hover rules couldn't be read; hover-check those buttons by hand with `computer` → `hover` + `zoom`.
   Backgrounds that are images/gradients are skipped (contrast unknown) — eyeball those in the screenshot.
6. Take one screenshot only at widths where the probe found something (or one at 1024 as proof when all pass). Also open things that only appear on click (popups, dropdown menus, side drawers) on the target page at phone + 1024 and probe again.

## Step 4 — fix, re-measure, report

- Fix every finding (Step 2 table for the usual cure). Then re-run the probe at the widths that failed — say "ผ่าน" only after the re-measure.
- Report in Thai, plain words, as tables:
  1. `ขนาดจอ | ผล | ปัญหาที่เจอ` — all 7 widths (✅ ผ่าน / ❌ + what, e.g. "ปุ่มบันทึกหลุดขอบขวา")
  2. `เรื่อง | ผล | ที่เจอ` — สี/ตัวหนังสืออ่านยาก · hover · ฟอนต์ · ขนาดตัวอักษร · สีปุ่ม
  3. สิ่งที่แก้ — file:line as clickable links, one short line each in plain Thai
  4. สิ่งที่ยังเช็กไม่ได้ (e.g. a page with no data yet)
- To see it on a real phone: use the Vercel link after `/push` (the 192.168… link usually doesn't work on class Wi-Fi).
- Do not commit; the student decides with `/push`.
