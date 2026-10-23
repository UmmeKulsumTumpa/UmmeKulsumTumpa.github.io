import { useState } from 'react';

type Category = 'spl' | 'ai' | 'sys' | 'fund';
interface Project { id: string; category: Category; lang: string; desc: string; course: string }
interface Props {
  projects: Project[];
  id: string; // id of the section: the in-page link target (the section itself never animates)
  heading: string; // id of the h2
}

const FILTERS: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'spl', label: 'project labs' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'sys', label: 'systems & SE' },
  { id: 'fund', label: 'fundamentals' },
];
const CARD_LABEL: Record<Category, string> = { spl: 'project lab', ai: 'AI & ML', sys: 'systems & SE', fund: 'fundamentals' };
const STAGGER = ['', 'd1', 'd2']; // 0 / 0.08 / 0.16s across each row of three

/**
 * Course-project archive: filter pills (counts from the data) over a card grid. The server
 * renders the full "all" grid, so every card is there without JS; the pills filter once hydrated.
 */
export default function ProjectArchive({ projects, id, heading }: Props) {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const shown = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const count = (id: Category | 'all') => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length);

  return (
    <section id={id} className="arc" aria-labelledby={heading}>
      <div className="arc-head" data-anim="up">
        <div>
          <h2 id={heading} className="label arc-label">
            02 · course-project archive · {shown.length} of {projects.length}
          </h2>
          <p className="arc-title">Course projects</p>
        </div>
        <a className="arc-all" href="https://github.com/UmmeKulsumTumpa?tab=repositories">all repos&nbsp;<span aria-hidden="true">↗</span></a>
      </div>
      <div className="arc-filters" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className="pill-btn arc-pill" aria-pressed={f.id === filter} onClick={() => setFilter(f.id)}>
            {f.label} <span className="arc-pill-n">{count(f.id)}</span>
          </button>
        ))}
      </div>
      <div className="arc-grid">
        {shown.map((p, i) => (
          <a key={p.id} className={['arc-card', STAGGER[i % 3]].filter(Boolean).join(' ')} data-anim="up" href={`https://github.com/UmmeKulsumTumpa/${p.id}`}>
            <div className="arc-card-in">
              <div className="arc-meta">
                <span>{CARD_LABEL[p.category]}</span>
                <span className="arc-lang"><span className="arc-lang-dot" aria-hidden="true"></span>{p.lang}</span>
              </div>
              <div className="arc-name">{p.id}</div>
              <div className="arc-desc">{p.desc}</div>
              <div className="arc-foot">
                <span>{p.course}</span>
                <span className="arc-gh">github <span aria-hidden="true">↗</span></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
