/**
 * Scroll-in animations + light parallax.
 *
 * Usage in markup:
 *   data-anim="up | from-left | from-right | zoom | blur | mask"
 *   class="d1" … class="d8"                 (optional stagger, see motion.css)
 *   data-parallax="0.3"                     (moves at 30% of scroll speed)
 *
 * Elements re-animate when they scroll back into view. Everything is skipped
 * for visitors who ask for reduced motion, and content stays visible if JS fails.
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
  // Enter when 12% is visible. Leave (so it replays later) only once the element is more than
  // OUT_MARGIN px outside the viewport: observers see the transformed box, and the hidden state moves
  // elements down by up to 64px, so leaving right at the edge would pull an element parked just above
  // the top back into view, where it re-enters, leaves again, and flickers in a loop.
  const OUT_MARGIN = 80;
  // When each entered element's entrance started (document timeline ms), so a copy that replaces it can carry
  // on from the same point (below). null: starting with the next frame; -Infinity: it entered without a
  // transition, already at rest.
  const startedAt = new WeakMap<Element, number | null>();
  const track = (el: Element) => {
    const t = el.getAnimations({ subtree: true }).find((a) => a instanceof CSSTransition);
    startedAt.set(el, t ? null : -Infinity);
    t?.ready.then(
      () => { if (startedAt.get(el) === null && typeof t.startTime === 'number') startedAt.set(el, t.startTime); },
      () => {}, // cancelled: it left or was removed before it started
    );
  };
  const enter = new IntersectionObserver(
    (entries) => {
      const entered = entries.filter((e) => e.intersectionRatio >= 0.12 && !e.target.hasAttribute('data-in')).map((e) => e.target);
      entered.forEach((el) => el.setAttribute('data-in', ''));
      entered.forEach(track); // after all are set, so style is recomputed once
    },
    { threshold: [0, 0.12] },
  );
  const leave = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (!e.isIntersecting) e.target.removeAttribute('data-in');
    },
    { rootMargin: `${OUT_MARGIN}px 0px` },
  );
  const observe = (el: HTMLElement) => { enter.observe(el); leave.observe(el); };
  const animated = (n: HTMLElement) => [...(n.matches('[data-anim]') ? [n] : []), ...n.querySelectorAll<HTMLElement>('[data-anim]')];
  animated(document.body).forEach(observe);

  // A copy of an element that had already entered starts where that element was, so its entrance never plays
  // twice. This runs in the mutation callback, before the copy is first painted.
  const carryOn = (el: HTMLElement, start: number | null) => {
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
          const start = startedAt.get(el);
          if (start !== undefined && el.hasAttribute('data-in')) replaced.set(twinKey(el), start);
        }
      });
    }
    for (const r of records) {
      r.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement) || !n.isConnected) return;
        for (const el of animated(n)) {
          const start = replaced.get(twinKey(el));
          if (start !== undefined && !el.hasAttribute('data-in')) carryOn(el, start);
          observe(el);
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
