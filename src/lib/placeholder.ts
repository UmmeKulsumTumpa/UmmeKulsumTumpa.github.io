/**
 * [bracket placeholders] mark text the owner has not written yet. They stay in the content files,
 * `npm run dev` shows them (so the owner can see what is missing) and production builds hide them:
 * - an item whose whole text is a placeholder is not rendered (`visible`, `keep`);
 * - a placeholder inside a string is removed with one neighbouring separator, " · " or " → " (`clean`);
 * - a section whose items are all placeholders is not rendered (`keep(...).length === 0`).
 * Every component uses these helpers; no ad-hoc regexes in components.
 */
export const SHOW_PLACEHOLDERS: boolean = import.meta.env.DEV;

const TOKEN = /\[[^[\]\n]+\]/;
// A token with the separator on either side of it, if any.
const TOKEN_IN_TEXT = /( · | → )?\[[^[\]\n]+\]( · | → )?/g;

/** True when the whole (trimmed) string is one [ ... ] token. */
export function isPlaceholder(s?: string): boolean {
  return s !== undefined && new RegExp(`^${TOKEN.source}$`).test(s.trim());
}

/** Non-empty, and either placeholders are shown (dev) or the string is not a placeholder. */
export function visible(s?: string): boolean {
  return !!s?.trim() && (SHOW_PLACEHOLDERS || !isPlaceholder(s));
}

/**
 * Dev: unchanged. Production: drops every [ ... ] token plus one adjacent " · " or " → ", then tidies spaces.
 * "[remote] · 2024" → "2024", "Cosmo Scope AI · [event name]" → "Cosmo Scope AI", "[Mon YYYY] → Dec 2024" → "Dec 2024".
 * Whitespace the string starts or ends with on purpose (text followed by a link) is kept.
 */
export function clean(s: string): string {
  if (SHOW_PLACEHOLDERS) return s;
  // Separators on both sides: keep one so the neighbours stay apart ("a · [x] · b" → "a · b").
  let out = s.replace(TOKEN_IN_TEXT, (_m, before?: string, after?: string) => (before && after ? after : '')).replace(/ {2,}/g, ' ');
  if (!/^\s/.test(s)) out = out.trimStart();
  if (!/\s$/.test(s)) out = out.trimEnd();
  return out;
}

/** The items whose text is visible() (all of them in dev, minus empty ones). */
export function keep<T>(items: T[], text: (t: T) => string | undefined): T[] {
  return items.filter((t) => visible(text(t)));
}
