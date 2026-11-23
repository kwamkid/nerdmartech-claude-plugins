---
name: mobile-check
description: เช็กหน้าที่เพิ่งแก้บนจอมือถือ 375px ว่าอะไรล้นจอหรือปุ่มกดยาก แล้วแก้ให้. Use when the user types /mobile-check, or says "เช็กมือถือ", "ดูในมือถือ", "ล้นจอ", "หลุดจอ", "responsive".
---

# mobile-check — 375px phone check

Reply in Thai. Report problems as a short list, then fix them.

1. Which page: the one changed most recently (`git diff --name-only` → page/route files), or ask.
2. Make sure the site runs locally (`npm run dev`), note the localhost URL.
3. If browser tools are available (e.g. Claude in Chrome): open the page at 375px width, take a screenshot, and check:
   - page wider than the screen (horizontal scroll) · text or images cut off
   - buttons/links smaller than ~44px or too close together
   - text smaller than 14px · tables that don't fit
   Also check 768px (tablet) once.
4. No browser tools → read the page's code and look for the usual causes: fixed widths (`w-[600px]`, `width: 600px`), wide tables without horizontal scroll, `flex` rows that don't wrap, large paddings, `whitespace-nowrap` on long text. Then tell the user how to look themselves: open the localhost link in Chrome → `F12` (Mac `Cmd+Option+I`) → click the phone icon → pick iPhone 12 Pro.
5. Fix what you found, then list: what was wrong → what you changed.
6. For a real phone, use the Vercel link after /ship (the 192.168… link usually doesn't work on class Wi-Fi).
