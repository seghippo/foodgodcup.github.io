# League HQ — Next.js Sports League + Blog

A clean Next.js 14 (App Router) + Tailwind starter for a sports league: Teams, Schedule, Standings, and a Blog.

## Quickstart

```bash
npm i
npm run dev
# open http://localhost:3000
```

## Customize

- Edit `lib/data.ts` for teams, schedule, standings, and posts.
- Tweak colors in `tailwind.config.ts`.
- Add pages/components as needed.

## Deploy from GitHub (recommended: Vercel)

1. Create a new GitHub repo and push this project:

```bash
git init
git add .
git commit -m "init: league hq"
git branch -M main
git remote add origin https://github.com/<your-username>/league-hq.git
git push -u origin main
```

2. Go to https://vercel.com/new, **Import Git Repository**, select your repo, and deploy.
   - Framework preset: **Next.js**
   - Build command: `next build`
   - Output: `.vercel/output` (Vercel handles this automatically)

Your site will be live at a vercel.app domain; you can add a custom domain later.

### (Optional) GitHub Pages

Next.js dynamic routes need server rendering. If you want GitHub Pages (static hosting), you must **export a static site** and avoid dynamic features.

Add this to `next.config.ts` (only if all routes are fully static):

```ts
const nextConfig = {
  output: 'export', // disables server features; generates /out
};
export default nextConfig;
```

Then:

```bash
npm run build
npx next export
# upload the /out folder to GitHub Pages (e.g., via gh-pages branch)
```

For most leagues, **Vercel** is simpler and supports dynamic features out of the box.

## License

MIT
