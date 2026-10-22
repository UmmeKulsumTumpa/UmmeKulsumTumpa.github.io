# Design reference

The approved design, captured from the claude.ai prototype. **Build to match the screenshots.**
Read `../SPEC.md` for the rules behind them; when a screenshot and the spec disagree, the spec wins.

## How to use these

1. Before building a page, open every screenshot for that page (Claude Code: use the Read tool on each `.jpg`; it renders images).
2. Build the page.
3. Run `npm run build && npm run preview`, then `npm run shots -- /<page>/` (writes `.shots/`).
4. Read your `.shots/<page>-desktop-dark-NN.png` next to the matching screenshot below and list every visible difference
   (spacing, type size, alignment, colour, missing element). Fix them, re-shoot, repeat until there are none worth naming.

Desktop captures: 1375×732 viewport (the top 80px is the prototype viewer's toolbar, not part of the site), dark theme unless named `light`. Mobile captures: the phone frame only (308 or 616px wide). A mouse cursor and the prototype tooltip appear in a few captures; ignore them.
Each desktop file is one viewport-height step down the page, taken after the entrance animations settled.
Placeholder text in `[brackets]` is content the owner will fill; keep the placeholders until she does.

## Screenshot index (`screenshots/`)

| Page | Files | What each shows |
|---|---|---|
| Home | `home-desktop-01.jpg` | hero: path + live clock, "hello, I'm", one-line name with caret, role, italic statement, "currently" block, ghost word "context" |
| | `home-desktop-02.jpg` | About: heading row, facts `aside` (left) + lead + paragraphs (right) — approved, do not restructure |
| | `home-desktop-03.jpg` | About row 2: "off the clock" 2×2 tiles (left) + portrait 4:5 (right), equal height |
| | `home-desktop-04.jpg` | full-width quote "why I do both" + glimpse heading |
| | `home-desktop-05.jpg` | glimpse bento tiles |
| | `home-desktop-06.jpg` | bento end, token strip ("fig. 0 — me, tokenized"), start of contact |
| | `home-desktop-07-footer.jpg` | "Say hello." + email button + links, footer, dock (page end) |
| | `home-light-01.jpg` | hero in the light theme (background, colours) |
| | `mobile-home-01…04.jpg` | phone: hero (name on 2 lines), about, quote, **glimpse as a numbered list**, token strip, contact |
| Education | `education-desktop-01.jpg` | page head: path, § label, serif title, ghost word "learning", lead |
| | `education-desktop-02.jpg` | timeline: IIT block with connected dots (M.Sc. → B.Sc.), course cards, then College, School |
| | `education-desktop-03.jpg` | course-project archive header + filter pills with counts + first cards |
| | `education-desktop-04-scrolling.jpg` | card grid (right column mid-entrance; shows the stagger) |
| | `education-desktop-05.jpg` | last card, awards & activities (left) + hackathons & contests (right) |
| Experience | `experience-desktop-01.jpg` | page head, ghost "ship it", timeline start (Cefalo) |
| | `experience-desktop-02.jpg` | Cefalo 3 roles connected (current role filled dot), Fellowship.AI |
| | `experience-desktop-03.jpg` | BARTA Research Lab, selected projects header |
| | `experience-desktop-04-projects-GLITCH.jpg` | **prototype bug** in the first project card: see SPEC §5.3; copy the second card's layout |
| | `experience-desktop-05.jpg` | toolbox: Web / Mobile / Research / Practice columns |
| Research | `research-desktop-01.jpg` | page head, ghost "inference", lead with BARTA link |
| | `research-desktop-02.jpg` | interests (3 columns) + publications row (year, figure, title, authors, venue, TL;DR, link pills) |
| | `research-desktop-03.jpg` | in progress list with status pills, talks & posters, collaborators |
| | `research-desktop-04.jpg` | page end |
| Writing | `writing-desktop-01.jpg` | page head, ghost "notes", rss / email links, featured card start |
| | `writing-desktop-02.jpg` | featured card (title, summary, date, cover diagram) + "all posts" + tag pills + rows |
| | `writing-desktop-03.jpg` | remaining rows (hover state visible on one row: underline) |
| Reading | `reading-desktop-01.jpg` | page head, ghost "library", three counters, Books/Papers/Articles tabs + status pills |
| | `reading-desktop-02-books.jpg`, `-03-books.jpg` | book covers grid (2:3, spine edge, accent rule on "reading"), status + topic under each |
| | `reading-desktop-04-papers.jpg` | Papers tab: rows with year, title, authors · venue, italic "why", status, notes → |
| | `reading-light-01-papers.jpg` | same in the light theme |
| | `mobile-reading-light-01…02.jpg` | phone, light: head, tabs, pills, 2-column covers, dock without Email |

## Prototype sources

`*.dc.html` are the prototype pages (Main = Home). They depend on the prototype runtime, so they do not open as plain
HTML; read them for exact copy, sizes and colours. `canvas.json` maps artboards to files.
