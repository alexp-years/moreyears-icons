# More Years CDN

Documentation site and CDN for the More Years design system, built with Next.js and hosted on Vercel.

## Scope

- Public app routes: `/`, `/icons`
- Static CDN assets: `/icons/<weight>/<id>.svg`, `/icons/manifest.json`
- Package output: `packages/icons/dist`

---

## Icons / NPM Package Management

The site displays icons sourced from the `@moreyears/icons` npm package. Icons are served as static SVG files from `public/icons/` — they are **not** bundled at build time. Whenever the npm package is updated, the package lock must be updated **and** the static SVG assets must be re-synced and committed.

### How it works

```
@moreyears/icons (npm)
        │
        ▼
npm run icons:build        ← copies SVGs + generates manifest
        │
        ├── public/icons/  ← served as static files by Vercel
        └── packages/icons/dist/
```

`public/icons/` is committed to the repo. Vercel's build command (`next build`) does not run `icons:build`, so the static files must be synced and committed locally before pushing.

### Updating the icons package

Run these commands in order whenever a new version of `@moreyears/icons` is published:

```bash
# 1. Update the package lock to the latest version
npm update @moreyears/icons

# 2. Sync SVG assets and manifest from the updated package
npm run icons:build

# 3. Commit everything together
git add package-lock.json public/icons packages/icons
git commit -m "update @moreyears/icons to x.x.x"

# 4. Push — Vercel will auto-deploy
git push
```

> **Important:** Wait a minute or two after publishing to npm before running `npm update`. npm can take time to propagate a new version, and Vercel's build will fail with a 404 if it tries to install a version that hasn't fully propagated yet.

### Scripts

| Script | Description |
|---|---|
| `npm run icons:build` | Syncs SVGs and manifest from `@moreyears/icons` into `public/icons/` and `packages/icons/dist/` |
| `npm run icons:pack` | Runs `icons:build` then packs `packages/icons` as a local `.tgz` |

### Troubleshooting

**Icons updated on npm but not reflecting on the site**
The most common cause is forgetting to run `npm run icons:build` and commit the result. The Vercel build only runs `next build` — it never re-syncs the static assets. Always run `icons:build` and commit `public/icons/` alongside the package update.

**Vercel build fails with a 404 on the package**
The npm version hasn't fully propagated yet. Wait a minute and trigger a fresh redeploy from the Vercel dashboard — leave "Use existing build cache" unchecked.

---

## Local Development

```bash
npm install
npm run icons:build
npm run dev
```

## Deploy (Vercel)

Build command:
```bash
next build
```

Environment variable:
```bash
NEXT_PUBLIC_ICON_CDN_BASE=https://<your-vercel-domain>
```
