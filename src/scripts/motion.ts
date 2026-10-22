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
  root.setAttribute('data-anim-ready', '');

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.intersectionRatio >= 0.12) e.target.setAttribute('data-in', '');
        else if (!e.isIntersecting) e.target.removeAttribute('data-in');
      }
    },
    { threshold: [0, 0.12] },
  );
  const scan = (scope: ParentNode = document) =>
    scope.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => io.observe(el));
  scan();

  // React islands render later or re-render on filter changes: watch for new nodes.
  new MutationObserver((records) => {
    for (const r of records) r.addedNodes.forEach((n) => n instanceof HTMLElement && (n.matches('[data-anim]') ? io.observe(n) : scan(n)));
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
