/**
 * Scroll-in animations + light parallax.
 *
 * Usage in markup:
 *   data-anim="up | from-left | from-right | zoom | blur | mask"
 *   class="d1" … class="d8"                 (optional stagger, see motion.css)
 *   data-parallax="0.3"                     (moves at 30% of scroll speed)
 *
 * Entrances replay in both scroll directions. An element animates in once about 12% of it is visible: from below
 * when it comes in at the bottom of the viewport (scrolling down), mirrored from above when it comes in at the top
 * (scrolling up). `from-left`/`from-right` and `zoom` look the same either way. Once it is fully out of the viewport it
 * is reset, without a transition, to its hidden state on the side it left by, so it plays again the next time it
 * enters. Between 12% visible and fully out nothing changes, so nothing flickers at the edge. First-screen content
 * enters from below on load. Everything is skipped for visitors who ask for reduced motion, and content stays visible
 * if JS fails.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  if (reduce || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  // The head script in Base.astro already set data-anim-ready before first paint; "off" means its
  // fallback gave up on us and showed everything, so don't hide it again.
  if (root.getAttribute('data-motion') === 'off') return;
  root.setAttribute('data-anim-ready', '');
  try {
    startEntrances(root);
  } catch (err) {
    // Never leave content hidden: show everything and tell the head script's fallback we're off.
    root.removeAttribute('data-anim-ready');
    root.setAttribute('data-motion', 'off');
    console.error(err);
    return;
  }
  startParallax();
}

function startEntrances(root: HTMLElement) {
  // When each entered element's entrance started (document timeline ms), so a copy that replaces it can carry
  // on from the same point (below). null: starting with the next frame; -Infinity: it entered without a
  // transition, already at rest.
  const startedAt = new WeakMap<Element, number | null>();
  const track = (el: Element) => {
    try {
      const t = el.getAnimations({ subtree: true }).find((a) => a instanceof CSSTransition);
      startedAt.set(el, t ? null : -Infinity);
      t?.ready.then(
        () => { if (startedAt.get(el) === null && typeof t.startTime === 'number') startedAt.set(el, t.startTime); },
        () => {}, // cancelled: it was removed (or reset) before it started
      );
    } catch {
      el.setAttribute('data-in', ''); // no timing known: a copy of it will simply start entered
      startedAt.set(el, -Infinity);
    }
  };

  // Which way the page is scrolling: content that enters while scrolling up comes in from above. Only a recent
  // scroll counts; otherwise (a filter change, a layout shift) an element uses the side it last left by.
  let lastY = window.scrollY;
  let up = false;
  let scrolledAt = -Infinity;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y !== lastY) { up = y < lastY; scrolledAt = performance.now(); }
    lastY = y;
  }, { passive: true });
  // Where a non-intersecting element is: wholly above or below the viewport, not rendered (e.g. in a closed
  // <details>), or inside the viewport but clipped by an ancestor (its own hidden offset can push it past a
  // clipping parent, which would otherwise keep it from ever intersecting).
  const where = (e: IntersectionObserverEntry) => {
    const r = e.boundingClientRect;
    if (!r.width && !r.height) return 'none';
    if (r.bottom <= (e.rootBounds?.top ?? 0)) return 'above';
    if (r.top >= (e.rootBounds?.bottom ?? window.innerHeight)) return 'below';
    return 'clipped';
  };

  // Hysteresis: enter at 12% visible, reset only once fully out. data-from-top mirrors the vertical offset of the
  // hidden state (motion.css). Side changes and resets happen with transitions off (data-anim-reset), all in one
  // style flush per batch, so a reset element never animates out and a flipped one starts from the new side.
  const seen = new WeakSet<Element>();
  const enter = new IntersectionObserver(
    (entries) => {
      const recent = performance.now() - scrolledAt < 400;
      const jumps: [Element, boolean][] = []; // [element, enters/rests on the top side]
      const resets: Element[] = [];
      const entering: Element[] = [];
      for (const e of entries) {
        const el = e.target;
        const first = !seen.has(el);
        seen.add(el);
        const fromTop = el.hasAttribute('data-from-top');
        if (!e.isIntersecting) {
          // Fully out: hidden again, on the side it left by (not rendered, e.g. in a closed <details>: keep it).
          const at = where(e);
          if (at === 'clipped') { // on screen, hidden only by a clipping ancestor: enter it from where it is
            if (!el.hasAttribute('data-in')) entering.push(el);
            continue;
          }
          const top = at === 'none' ? fromTop : at === 'above';
          if (el.hasAttribute('data-in')) resets.push(el);
          if (top !== fromTop || el.hasAttribute('data-in')) jumps.push([el, top]);
        } else if (e.intersectionRatio >= 0.12 && !el.hasAttribute('data-in')) {
          // First screen on load: from below, as before. Later: the scroll direction, else the side it left by.
          const top = first ? fromTop : recent ? up : fromTop;
          if (top !== fromTop) jumps.push([el, top]);
          entering.push(el);
        } else if (first && e.intersectionRatio < 0.12 && e.boundingClientRect.top < (e.rootBounds?.top ?? 0) && !fromTop) {
          jumps.push([el, true]); // cut by the top edge on load (restored scroll): it will come in from above
        }
      }
      if (jumps.length) {
        for (const [el, top] of jumps) { el.setAttribute('data-anim-reset', ''); el.toggleAttribute('data-from-top', top); }
        resets.forEach((el) => el.removeAttribute('data-in'));
        void document.body.getBoundingClientRect(); // apply the jumps now, without transitions
        for (const [el] of jumps) el.removeAttribute('data-anim-reset');
      }
      entering.forEach((el) => el.setAttribute('data-in', ''));
      entering.forEach(track); // after all are set, so style is recomputed once
    },
    { threshold: [0, 0.12] },
  );
  const animated = (n: HTMLElement) => [...(n.matches('[data-anim]') ? [n] : []), ...n.querySelectorAll<HTMLElement>('[data-anim]')];
  animated(document.body).forEach((el) => enter.observe(el));

  // A copy of an element that had already entered starts where that element was, so its entrance never plays
  // twice. This runs in the mutation callback, before the copy is first painted.
  const carryOn = (el: HTMLElement, start: number | null) => {
    try {
      if (start === -Infinity) { // set before its first style: shown at rest, no transition
        el.setAttribute('data-in', '');
        startedAt.set(el, start);
        return;
      }
      void getComputedStyle(el).opacity; // compute the hidden state first, so setting data-in starts the transitions
      el.setAttribute('data-in', '');
      if (start === null) return track(el); // the original had not started either
      // Share the original's start time: same progress from the first frame (finished transitions end at once).
      for (const a of el.getAnimations({ subtree: true })) if (a instanceof CSSTransition) a.startTime = start;
      startedAt.set(el, start);
    } catch {
      el.setAttribute('data-in', ''); // never leave a copy hidden: show it entered, without the carried-over timing
    }
  };

  // React islands render later or re-render on filter changes: watch for new nodes. Hydrating islands may also
  // swap server-rendered elements for client-rendered copies (Reading's library going from its no-JS view to
  // tabs). A copy is matched to the entered element it replaces, removed in the same batch, by its animation
  // and text; genuinely new content (a filter change) has no such twin and animates in as usual.
  const twinKey = (el: HTMLElement) => `${el.dataset.anim}|${el.textContent}`;
  new MutationObserver((records) => {
    const replaced = new Map<string, number | null>();
    for (const r of records) {
      r.removedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        for (const el of animated(n)) {
          enter.unobserve(el);
          const start = startedAt.get(el);
          if (start !== undefined && el.hasAttribute('data-in')) replaced.set(twinKey(el), start);
        }
      });
    }
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement) || !n.isConnected) return;
        for (const el of animated(n)) {
          enter.observe(el);
          const start = replaced.get(twinKey(el));
          if (start !== undefined && !el.hasAttribute('data-in')) carryOn(el, start);
        }
      });
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Only now is motion really running; until then the head script's fallback may still show everything.
  root.setAttribute('data-motion', 'on');
}

function startParallax() {
  const layers = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!layers.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    layers.forEach((el) => el.style.setProperty('--py', `${(y * Number(el.dataset.parallax || 0)).toFixed(1)}px`));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

init();
