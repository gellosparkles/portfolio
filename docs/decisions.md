# Decisions

These were settled in the grilling session on 2026-10-11. Raw facts are in [source-material.md](source-material.md). Open items are in [../TODO.md](../TODO.md).

| # | Decision | Choice | Why |
|---|----------|--------|-----|
| 1 | Target roles | ML/AI research intern **and** applied ML engineer intern | The two strongest pieces are an ML paper and an ML-on-hardware build. Embedded work is shown as range, not as the headline. |
| 2 | Name | **Hansi Lee** is the main name. The site states "Legal name: Tz-Jing Lee". No Chinese characters. | The paper and certificate are issued to Tz-Jing Lee, so recruiters need the link between the two names. |
| 3 | Education | B.S. Electrical & Computer Engineering, USC Viterbi, expected 2028 | User-provided. |
| 4 | Unverified items | Publish them as the source documents state, and track each one in `TODO.md` | User asked for this. The award letter itself is **never** published: only the line "CURVE Fellow, Fall 2026" appears. |
| 5 | Hosting | Vercel, on the default `*.vercel.app` URL for now. Custom domain later, bare domain primary with `www` redirecting. | User will buy the domain later. Setup steps are in the README. |
| 6 | Deploy flow | GitHub repo connected to Vercel (git push deploys). The user signs in to GitHub with Google. | Gives preview deployments per branch, and the repo itself counts as a portfolio piece. |
| 7 | Stack | Next.js 16 (App Router, statically prerendered) + React 19 + TypeScript + Tailwind v4. **3D: three.js via @react-three/fiber + drei.** | User asked for React with interactive 3D. |
| 8 | Structure | Home page (hero, about, featured projects, publication, honors, skills, contact) plus one case-study page per project | Recruiters skim the home page in 30 seconds. Engineers click through to the depth. |
| 9 | Look | Minimal, typographic, light and dark from the OS setting, one accent color. The 3D is purposeful (it shows real data) rather than decorative. | Clarity reads better than flash to ML recruiters. |
| 10 | Contact | Plain email link and LinkedIn, no form. **Vercel Web Analytics** is on. | No backend, no spam. Analytics needs no cookie banner. |

## 3D pieces (each one shows something true)
- **Home hero:** a neural network you can interact with. Its layers echo the gesture model: per-frame CNN features feed a GRU, which feeds 5 classes.
- **Gesture case study:** a 3D bar chart of the paper's real confusion matrices (32 test clips each), with a toggle between MobileNet+GRU and RNN+GRU. An HTML table gives the same data for screen readers.
- **Sudoku case study:** a 3D board that solves a puzzle live with backtracking, which is the solver half of the project.

All canvases load only on the client, pause when scrolled off-screen, and stay still when the OS "reduce motion" setting is on.

## Content source of truth
- `src/content/site.ts`: profile, links, honors, certifications, skills
- `src/content/projects.ts`: project card summaries
- Project pages: `src/app/projects/<slug>/page.tsx`. Each one is bespoke because each has its own visualization.

## Deliberately excluded
- Award letter contents (student ID, amounts, payment schedule, international status)
- Certificate number and certificate image
- Gesture-dataset frames and any photos showing people's faces
