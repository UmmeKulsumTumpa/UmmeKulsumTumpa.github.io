export const site = {
  name: 'Umme Kulsum Tumpa',
  handle: 'ummekulsumtumpa',
  handleShort: 'ukt', // Home top line on phones (MobileHome.dc.html)
  role: 'Software Engineer · Researcher',
  description:
    'Software engineer at Cefalo Bangladesh and M.Sc. researcher at IIT, University of Dhaka, working on LLM efficiency, context management and adaptive inference.',
  // Home hero bio (Hero.astro sets the named entities in the text colour).
  bio: "I'm a software engineer at Cefalo Bangladesh and a thesis-based M.Sc. student in Software Engineering at IIT, University of Dhaka. At BARTA Research Lab I work on NLP, LLMs and AI agents; my thesis is on adaptive inference for efficient LLMs.",
  statement:
    'I build production software by day, and research how language models can do more with less.',
  location: 'Dhaka, Bangladesh',
  timezone: 'Asia/Dhaka',
  email: 'bsse1307@iit.du.ac.bd',
  links: {
    scholar: 'https://scholar.google.com/citations?user=3iF7aUQAAAAJ&hl=en',
    github: 'https://github.com/UmmeKulsumTumpa',
    linkedin: 'https://www.linkedin.com/in/umme-kulsum-tumpa-082245288',
    leetcode: 'https://leetcode.com/iampilgrim_',
    cv: '/cv.pdf',
  },
} as const;

/** Dock order: Home, Education, Experience, Research, Writing, Reading. */
export const nav = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'education', label: 'Education', href: '/education/' },
  { id: 'experience', label: 'Experience', href: '/experience/' },
  { id: 'research', label: 'Research', href: '/research/' },
  { id: 'writing', label: 'Writing', href: '/writing/' },
  { id: 'reading', label: 'Reading', href: '/reading/' },
] as const;

export type NavId = (typeof nav)[number]['id'];
