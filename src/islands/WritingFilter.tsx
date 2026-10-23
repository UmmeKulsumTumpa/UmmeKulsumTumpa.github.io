import { useEffect, useState } from 'react';

interface Row { id: string; href: string; date: string; title: string; summary: string; tags: string[]; minutes: number }
interface Props {
  posts: Row[]; // newest first
  tags: readonly string[]; // filter order
  heading: string; // id of the h2
}

// Rows enter from alternate sides, 0.06s apart (Writing.dc.html), mapped to the nearest stagger class.
const STAGGER = ['', 'd1', 'd2', 'd2', 'd3', 'd4'];

/**
 * "All posts": tag filter pills over the post rows. The server renders every row, so the list
 * works without JS; the pills filter once hydrated. Posts can carry several tags; a pill matches any.
 * The pills do nothing without JS, so (as in ReadingLibrary) they stay hidden until the island is ready.
 */
export default function WritingFilter({ posts, tags, heading }: Props) {
  const [ready, setReady] = useState(false);
  const [tag, setTag] = useState('all');
  useEffect(() => setReady(true), []);
  const shown = tag === 'all' ? posts : posts.filter((p) => p.tags.includes(tag));

  return (
    <section className="wr-all" aria-labelledby={heading}>
      <div className="wr-all-head">
        <h2 id={heading} className="label wr-all-label">all posts · {shown.length}</h2>
        <div className="wr-filters" role="group" aria-label="Filter by topic" hidden={!ready}>
          {['all', ...tags].map((t) => (
            <button key={t} type="button" className="pill-btn wr-pill" aria-pressed={t === tag} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <ul className="wr-rows" role="list">
        {shown.map((p, i) => (
          <li key={p.id}>
            <a className={['wr-row', STAGGER[Math.min(i, STAGGER.length - 1)]].filter(Boolean).join(' ')} data-anim={i % 2 ? 'from-right' : 'from-left'} href={p.href}>
              <span className="wr-row-date">{p.date}</span>
              <span className="wr-row-body">
                <span className="wr-row-title">{p.title}</span>
                <span className="wr-row-summary">{p.summary}</span>
              </span>
              <span className="wr-row-meta">
                {[...p.tags, `${p.minutes} min`].join(' · ')} <span className="wr-arrow" aria-hidden="true">→</span>
              </span>
            </a>
          </li>
        ))}
        {shown.length === 0 && <li className="wr-empty">no posts tagged {tag} yet</li>}
      </ul>
    </section>
  );
}
