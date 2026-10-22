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
  root.setAttribute('data-motion', 'on');

  // Enter when 12% is visible. Leave (so it replays later) only once the element is more than
  // OUT_MARGIN px outside the viewport: observers see the transformed box, and the hidden state moves
  // elements down by up to 64px, so leaving right at the edge would pull an element parked just above
  // the top back into view, where it re-enters, leaves again, and flickers in a loop.
  const OUT_MARGIN = 80;
  const enter = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.intersectionRatio >= 0.12) e.target.setAttribute('data-in', '');
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
  const scan = (scope: ParentNode = document) =>
    scope.querySelectorAll<HTMLElement>('[data-anim]').forEach(observe);
  scan();

  // React islands render later or re-render on filter changes: watch for new nodes.
  new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && (n.matches('[data-anim]') ? observe(n) : scan(n)));
  }).observe(document.body, { childList: true, subtree: true });

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
