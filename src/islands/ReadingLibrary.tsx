import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

type Kind = 'book' | 'paper' | 'article';
type Status = 'reading' | 'finished' | 'queued';
interface Item {
  href: string; // the notes page, /reading/<slug>/
  title: string;
  author: string;
  kind: Kind;
  status: Status;
  topic?: string;
  year?: string;
  why?: string;
  notes: boolean; // has a Markdown body, so the notes page exists
}
interface Props {
  items: Item[];
  heading: string; // id of the (visually hidden) h2
}

const TABS: { id: Kind; label: string }[] = [
  { id: 'book', label: 'Books' },
  { id: 'paper', label: 'Papers' },
  { id: 'article', label: 'Articles' },
];
const STATUSES: (Status | 'all')[] = ['all', 'reading', 'finished', 'queued'];
const BOOK_STAGGER = ['', 'd1', 'd2', 'd3']; // 0 / 0.08 / 0.16 / 0.24s across each row of covers
const ROW_STAGGER = ['', 'd1', 'd2', 'd3', 'd4']; // 0.08s apart, capped

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

/** Book covers: shade, spine edge and rule height cycle through four variants. */
function Books({ list }: { list: Item[] }) {
  return (
    <ul className="rd-books">
      {list.map((b, i) => {
        const inner = (
          <>
            <span className={cx('rd-cover', `rd-cover-v${(i % 4) + 1}`)}>
              <span className="rd-cover-rule" aria-hidden="true"></span>
              <span className="rd-cover-title">{b.title}</span>
              <span className="rd-cover-author">{b.author}</span>
            </span>
            <span className="rd-book-meta">
              <span className={cx('rd-status', `rd-status-${b.status}`)}>{b.status}</span>
              {b.topic && <span className="rd-book-topic">{b.topic}</span>}
            </span>
          </>
        );
        return (
          <li key={b.href} className={cx('rd-book-item', `rd-is-${b.status}`, BOOK_STAGGER[i % 4])} data-anim="up">
            {b.notes ? <a className="rd-book" href={b.href}>{inner}</a> : <div className="rd-book">{inner}</div>}
          </li>
        );
      })}
    </ul>
  );
}

/** Paper / article rows. */
function Rows({ list }: { list: Item[] }) {
  return (
    <ul className="rd-rows">
      {list.map((r, i) => (
        <li key={r.href} className={cx('rd-row', ROW_STAGGER[Math.min(i, ROW_STAGGER.length - 1)])} data-anim="from-right">
          <span className="rd-row-year">{r.year}</span>
          <span className="rd-row-main">
            <span className="rd-row-title">{r.title}</span>
            <span className="rd-row-source">{r.author}</span>
            {r.why && <span className="rd-row-why">{r.why}</span>}
          </span>
          <span className="rd-row-side">
            <span className={cx('rd-status', `rd-status-${r.status}`)}>{r.status}</span>
            {r.notes && (
              <a className="rd-notes" href={r.href}>
                notes<span className="visually-hidden"> on {r.title}</span> →
              </a>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function List({ kind, list }: { kind: Kind; list: Item[] }) {
  if (list.length === 0) return <p className="rd-empty">Nothing here yet.</p>;
  return kind === 'book' ? <Books list={list} /> : <Rows list={list} />;
}

/**
 * Reading library (SPEC §5.6): Books / Papers / Articles tabs and status pills over book covers or
 * paper/article rows.
 *
 * Progressive enhancement, owned by the island: the server (and the first client render, so hydration
 * matches) stacks all three kinds under their own headings with every status, so everything is there
 * without JS and for crawlers. Once hydrated, an effect sets `ready` and the tabs and pills take over.
 */
export default function ReadingLibrary({ items, heading }: Props) {
  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<Kind>('book');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setReady(true), []);

  const shown = items.filter((it) => it.kind === kind && (status === 'all' || it.status === status));
  const panelId = 'rd-panel';
  const tabId = (k: Kind) => `rd-tab-${k}`;

  // Tab pattern (WAI-ARIA APG, automatic activation): arrows / Home / End move focus and select.
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = TABS.findIndex((t) => t.id === kind);
    const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + TABS.length) % TABS.length;
    setKind(TABS[i].id);
    tabRefs.current[i]?.focus();
  };

  return (
    <section className="rd" aria-labelledby={heading}>
      <h2 id={heading} className="visually-hidden">Library</h2>
      {/* The controls only work with JS, so they stay hidden until the island is ready. */}
      <div className="rd-bar" hidden={!ready}>
        <div className="rd-tabs" role="tablist" aria-label="Kind" onKeyDown={onTabKey}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={tabId(t.id)}
              className="rd-tab"
              aria-selected={t.id === kind}
              aria-controls={panelId}
              tabIndex={t.id === kind ? 0 : -1}
              onClick={() => setKind(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="rd-pills" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button key={s} type="button" className="pill-btn rd-pill" aria-pressed={s === status} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {ready ? (
        <div id={panelId} className="rd-panel" role="tabpanel" aria-labelledby={tabId(kind)} tabIndex={shown.length ? undefined : 0}>
          <List kind={kind} list={shown} />
        </div>
      ) : (
        TABS.map((t) => (
          <section key={t.id} className="rd-kind" aria-labelledby={`rd-h-${t.id}`}>
            <h3 id={`rd-h-${t.id}`} className="label rd-kind-label">{t.label}</h3>
            <List kind={t.id} list={items.filter((it) => it.kind === t.id)} />
          </section>
        ))
      )}
    </section>
  );
}
