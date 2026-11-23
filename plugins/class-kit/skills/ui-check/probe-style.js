// Style probe — colour contrast (normal + hover), fonts, button colours. Returns JSON.
// Hover is simulated by copying every CSS rule that contains :hover into a temp
// <style> with ':hover' rewritten to '.__uih', then adding that class to one
// interactive element at a time. Transitions are disabled while measuring.
(() => {
  // ---------- colour helpers (canvas resolves oklch/color()/named → sRGB) ----------
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = (c) => {
    if (!c || c === 'transparent' || c === 'none') return [0, 0, 0, 0];
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = (c) => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

  // effective background: composite ancestors' bg colours; null if an image/gradient sits behind
  const effBg = (el) => {
    const layers = [];
    for (let p = el; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.backgroundImage !== 'none' && !layers.some(l => l[3] === 1)) return { unknown: true, at: p };
      const c = rgba(s.backgroundColor); if (c[3] > 0) layers.push(c);
      if (c[3] === 1) break;
    }
    let base = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { c: base };
  };
  const label = (el) => { const t = (el.innerText || el.getAttribute('aria-label') || el.title || '').trim().replace(/\s+/g, ' ');
    const cls = typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join('.') : (el.getAttribute('class') || '').split(' ').slice(0, 3).join('.');
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + ' "' + t.slice(0, 30) + '"'; };
  const visible = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const hasText = (el) => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  const iconColour = (svg) => { const s = getComputedStyle(svg);
    const kids = svg.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse');
    const k = kids[0] ? getComputedStyle(kids[0]) : s;
    const stroke = k.stroke !== 'none' ? k.stroke : s.stroke; const fill = k.fill !== 'none' ? k.fill : s.fill;
    return rgba(stroke && stroke !== 'none' ? stroke : fill); };

  // check one element (text or svg) → issue or null
  const check = (el, state) => {
    if (el.closest('[disabled],[aria-disabled="true"]')) return null;
    const isIcon = el.tagName.toLowerCase() === 'svg';
    let fg = isIcon ? iconColour(el) : rgba(getComputedStyle(el).color);
    if (fg[3] === 0) return null;
    const bg = effBg(isIcon ? el.parentElement : el); if (bg.unknown) return null;
    fg = over(fg, bg.c);
    const s = getComputedStyle(el); const px = parseFloat(s.fontSize); const bold = +s.fontWeight >= 700;
    const need = isIcon ? 3 : (px >= 24 || (px >= 18.66 && bold)) ? 3 : 4.5;
    const r = ratio(fg, bg.c);
    return r < need ? { el: label(el), state, kind: isIcon ? 'icon' : 'text', fg: hex(fg), bg: hex(bg.c), ratio: +r.toFixed(2), need } : null;
  };

  // ---------- setup: kill transitions, build hover sheet ----------
  const noAnim = document.createElement('style'); noAnim.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
  document.head.appendChild(noAnim);
  let hoverCss = ''; let blockedSheets = 0;
  const walk = (rules) => { for (const r of rules) {
    if (r.cssRules && !r.selectorText) { // @media/@layer/@supports
      const inner = []; const save = hoverCss; hoverCss = ''; walk(r.cssRules); if (hoverCss) inner.push(hoverCss); hoverCss = save;
      if (inner.length) { const head = r.cssText.slice(0, r.cssText.indexOf('{')); hoverCss += head + '{' + inner.join('') + '}'; }
    } else if (r.selectorText && r.cssText.includes(':hover')) hoverCss += r.cssText.replace(/:hover/g, '.__uih'); // incl. nested &:hover
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch { blockedSheets++; } }
  const hov = document.createElement('style'); hov.textContent = hoverCss; document.head.appendChild(hov);

  const out = { lowContrast: [], hoverNoFeedback: [], fonts: {}, fallbackFonts: [], tinyText: [], sizes: {}, buttonColours: {}, blockedSheets };
  const interactive = [...document.querySelectorAll('button,a[href],[role="button"],[role="tab"],[role="menuitem"],summary')].filter(visible).slice(0, 400);

  // ---------- normal state: every visible text node + svg ----------
  const all = [...document.body.querySelectorAll('*')].filter(visible);
  const seen = new Set();
  for (const el of all) {
    if (el.tagName.toLowerCase() === 'svg' || hasText(el)) {
      const i = check(el, 'normal'); if (i && !seen.has(i.el + i.fg + i.bg)) { seen.add(i.el + i.fg + i.bg); out.lowContrast.push(i); }
    }
    if (hasText(el)) {
      const s = getComputedStyle(el); const fam = s.fontFamily.split(',')[0].trim().replace(/["']/g, '');
      out.fonts[fam] = (out.fonts[fam] || 0) + 1;
      const px = Math.round(parseFloat(s.fontSize)); out.sizes[px] = (out.sizes[px] || 0) + 1;
      if (px < 12) out.tinyText.push(label(el) + ' ' + px + 'px');
    }
  }
  for (const fam of Object.keys(out.fonts)) {
    const generic = ['serif', 'sans-serif', 'monospace', 'system-ui', 'ui-sans-serif', '-apple-system', 'cursive'];
    if (!generic.includes(fam) && document.fonts && !document.fonts.check('16px "' + fam + '"')) out.fallbackFonts.push(fam);
  }

  // ---------- hover state ----------
  const snap = (el) => { const s = getComputedStyle(el); return [s.color, s.backgroundColor, s.borderColor, s.textDecorationLine, s.boxShadow, s.opacity, s.filter, s.transform].join('|'); };
  for (const el of interactive) {
    const s = getComputedStyle(el);
    const bgc = rgba(s.backgroundColor); if (el.tagName.toLowerCase() === 'button' && bgc[3] > 0) { const h = hex(over(bgc, [255, 255, 255, 1])); out.buttonColours[h] = (out.buttonColours[h] || 0) + 1; }
    if (el.closest('[disabled],[aria-disabled="true"]')) continue;
    const targets = [el, ...el.querySelectorAll('*')].filter(e => e.tagName.toLowerCase() === 'svg' || hasText(e));
    const before = [el, ...el.querySelectorAll('*')].map(snap).join('#');
    const chain = []; for (let p = el; p && p !== document.body; p = p.parentElement) chain.push(p); // ancestors hover too
    chain.forEach(p => p.classList.add('__uih'));
    const after = [el, ...el.querySelectorAll('*')].map(snap).join('#');
    for (const t of targets) { const i = check(t, 'hover'); if (i) { i.el = label(el) + ' → ' + i.el; out.lowContrast.push(i); } }
    chain.forEach(p => p.classList.remove('__uih'));
    if (before === after && s.cursor === 'pointer') out.hoverNoFeedback.push(label(el));
  }

  hov.remove(); noAnim.remove();
  const cap = (a, n = 20) => a.slice(0, n);
  out.lowContrast = cap(out.lowContrast, 30); out.hoverNoFeedback = cap(out.hoverNoFeedback); out.tinyText = cap(out.tinyText);
  out.ok = !out.lowContrast.length && !out.fallbackFonts.length && !out.tinyText.length;
  return JSON.stringify(out);
})();
