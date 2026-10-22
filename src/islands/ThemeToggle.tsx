import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

const SUN = 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4';
const MOON = 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z';

/** html[data-theme] is the source of truth: the head script sets it before paint. */
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

const Icon = ({ d, className }: { d: string; className: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/**
 * Dock button that flips html[data-theme] and remembers the choice.
 * Both icons and tooltip words are rendered; CSS (dock.css) shows the one for the
 * current theme, so the button is right on first paint, before React hydrates.
 */
export default function ThemeToggle() {
  // Static HTML is built as dark; after hydration this follows html[data-theme].
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => 'dark');

  const toggle = () => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  };

  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button type="button" className="dock-item" onClick={toggle} aria-label={label}>
      <Icon d={SUN} className="dock-theme-dark" />
      <Icon d={MOON} className="dock-theme-light" />
      <span className="dock-tip" aria-hidden="true">
        <span className="dock-theme-dark">Light</span>
        <span className="dock-theme-light">Dark</span>
      </span>
    </button>
  );
}
