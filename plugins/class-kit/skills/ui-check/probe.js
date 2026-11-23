// Overflow probe — paste into the page via javascript_tool. Returns JSON.
// Finds: page-level horizontal scroll, elements sticking past the viewport,
// interactive elements clipped by an overflow:hidden/auto ancestor, text cut
// without ellipsis, and flex children that refuse to shrink.
(() => {
  const vw = document.documentElement.clientWidth;
  const out = { viewport: window.innerWidth, clientWidth: vw,
    pageScrollX: document.documentElement.scrollWidth > vw + 1
      ? document.documentElement.scrollWidth - vw : 0,
    offscreen: [], clipped: [], textCut: [], noShrink: [] };

  const label = (el) => {
    const t = (el.innerText || el.getAttribute('aria-label') || el.title || '').trim().replace(/\s+/g, ' ');
    const cls = typeof el.className === 'string' ? el.className.split(' ').slice(0, 4).join('.') : '';
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} "${t.slice(0, 40)}"`;
  };
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // skip things meant to scroll sideways (tables in overflow-x-auto, tab rows, carousels)
  const inScroller = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if ((s.overflowX === 'auto' || s.overflowX === 'scroll') && p.scrollWidth > p.clientWidth) return true;
    }
    return false;
  };
  const fixedHidden = (el) => {
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.position === 'fixed' && p.getBoundingClientRect().right <= 0) return true; // closed drawer
    }
    return false;
  };

  const all = [...document.body.querySelectorAll('*')].filter(visible);
  const interactive = 'button,a,input,select,textarea,[role="button"],[role="tab"],[role="menuitem"]';

  for (const el of all) {
    if (fixedHidden(el)) continue;
    const r = el.getBoundingClientRect();
    const isInt = el.matches(interactive);

    if ((r.right > vw + 1 || r.left < -1) && !inScroller(el)) {
      // report only the outermost offender
      const parentOff = el.parentElement && el.parentElement.getBoundingClientRect().right > vw + 1;
      if (!parentOff || isInt) out.offscreen.push({ el: label(el), right: Math.round(r.right), over: Math.round(r.right - vw), interactive: isInt });
    }

    if (isInt) {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const s = getComputedStyle(p);
        if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
        if ((s.overflowX === 'auto' || s.overflowX === 'scroll')) break; // user can scroll to it
        const pr = p.getBoundingClientRect();
        if (r.right > pr.right + 1 || r.left < pr.left - 1 || r.bottom > pr.bottom + 1) {
          out.clipped.push({ el: label(el), by: label(p).slice(0, 60) });
        }
        break;
      }
    }

    // text overflowing its own box without ellipsis (overflow hidden, no text-overflow)
    if (el.childElementCount === 0 && el.scrollWidth > el.clientWidth + 1) {
      const s = getComputedStyle(el);
      if (s.overflow === 'hidden' && s.textOverflow !== 'ellipsis' && s.whiteSpace === 'nowrap')
        out.textCut.push(label(el));
    }

    // flex item wider than its flex parent (classic missing min-w-0)
    const ps = el.parentElement && getComputedStyle(el.parentElement);
    if (ps && ps.display.includes('flex') && ps.flexDirection.startsWith('row')) {
      const pr = el.parentElement.getBoundingClientRect();
      if (r.width > pr.width + 1 && getComputedStyle(el).minWidth === 'auto')
        out.noShrink.push({ el: label(el), w: Math.round(r.width), parentW: Math.round(pr.width) });
    }
  }
  const cap = (a) => a.slice(0, 15);
  out.offscreen = cap(out.offscreen); out.clipped = cap(out.clipped);
  out.textCut = cap(out.textCut); out.noShrink = cap(out.noShrink);
  out.ok = !out.pageScrollX && !out.offscreen.length && !out.clipped.length && !out.noShrink.length;
  return JSON.stringify(out);
})();
