# Hansi Lee: portfolio

A recruiting portfolio built with Next.js 16, React 19, TypeScript, Tailwind v4 and React Three Fiber. Every page is prerendered as static content and hosted on Vercel.

- **Home** (`/`): hero with an interactive neural network, projects, research, about, skills, contact
- **`/projects/gesture-recognition`**: case study with a 3D confusion-matrix explorer built from the paper's real results
- **`/projects/sudoku-solver`**: case study with a live 3D backtracking Sudoku solver

## Editing content

| What | Where |
|------|-------|
| Name, tagline, links (email, LinkedIn, GitHub, resume), education, honors, certifications, skills | `src/content/site.ts` |
| Project cards on the home page | `src/content/projects.ts` |
| Gesture-model results (confusion matrices, P/R/F1) | `src/content/gesture.ts` |
| Case-study text | `src/app/projects/*/page.tsx` |
| Images | `public/projects/` |

Contact links set to `null` are hidden. **Open items are listed in [TODO.md](TODO.md).** Design decisions are in [docs/decisions.md](docs/decisions.md).

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (also type-checks)
npm run lint
```

## Deploying on Vercel (one-time setup)

1. Go to <https://vercel.com/signup> and choose **Continue with GitHub** (you sign in to GitHub with Google).
2. Open <https://vercel.com/new>, find this repository, and click **Import**. The defaults detect Next.js, so leave them as they are.
3. Click **Deploy**. The site goes live at `https://<project>.vercel.app`.
4. In the project, open **Analytics** and enable **Web Analytics**. The `<Analytics />` component is already in the code.

From then on, every `git push` to `main` deploys to production, and other branches get preview URLs.

## Adding your domain (later)

1. Vercel project → **Settings → Domains** → add `yourdomain.com`. Also add `www.yourdomain.com` and set it to **redirect to** `yourdomain.com`.
2. At your registrar, create the DNS records Vercel shows. These are usually an `A` record for `@` pointing to Vercel's IP and a `CNAME` for `www` pointing to Vercel's `cname` target. Copy the exact values from the Domains page, because Vercel may change them. Alternatively, point the domain's nameservers at Vercel.
3. Vercel → **Settings → Environment Variables**: set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` for Production, then redeploy. Canonical URLs, the sitemap and social previews all use it.

HTTPS certificates are issued automatically.

## Privacy note

The source documents (`Internship_apps.zip`) are git-ignored. The award letter contains a student ID and payment details and must never be committed.
