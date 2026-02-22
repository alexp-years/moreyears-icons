# More Years CDN

Documentation site and CDN for the More Years design system, built with Next.js and hosted on Vercel.

## Scope

- Public app routes: `/`, `/icons`
- Static CDN assets (recommended): `/icons/v<version>/<weight>/<id>.svg`
- Static CDN assets (legacy, supported): `/icons/<weight>/<id>.svg`
- Manifest endpoints:
  - `/icons/manifest.json`
  - `/icons/v<version>/manifest.json`
- Package output: `packages/icons/dist`

---

## Icons / NPM Package Management

The site displays icons sourced from the published `@moreyears/icons` npm package. SVG assets are generated into `public/icons/` and committed to this repo.

### Authoritative build flow

`npm run build` is the production-safe, authoritative command. It now runs:

1. `npm run icons:build`
2. `npm run icons:verify`
3. `next build --webpack`

This guarantees icon sync + validation before every production build.

### How icon sync works

```
@moreyears/icons (npm)
        │
        ▼
npm run icons:build
        │
        ├── public/icons/<weight>/<id>.svg            (legacy)
        ├── public/icons/v<version>/<weight>/<id>.svg (versioned)
        ├── public/icons/manifest.json
        ├── public/icons/v<version>/manifest.json
        └── packages/icons/dist/
```

Versioned URLs are preferred for clients to avoid stale CDN misses during icon updates. Legacy URLs remain supported for backward compatibility.

### Updating the icons package

Run these commands when a new `@moreyears/icons` version is published:

```bash
# 1. Update lockfile/package install target
npm update @moreyears/icons

# 2. Run the authoritative build (sync + verify + Next build)
npm run build

# 3. Commit generated assets and lockfile
git add package-lock.json public/icons packages/icons
git commit -m "update @moreyears/icons to x.x.x"

# 4. Push for Vercel deploy
git push
```

> Important: npm propagation can lag briefly after publish. If a new version is not yet resolvable, wait a minute and rerun.

### Scripts

| Script | Description |
|---|---|
| `npm run build` | Authoritative build: sync icons, verify output integrity, run `next build --webpack` |
| `npm run icons:build` | Sync SVGs/manifests from `@moreyears/icons` into `public/icons` and `packages/icons/dist` |
| `npm run icons:verify` | Validate canonical weights and required files in both legacy and versioned icon trees |
| `npm run icons:pack` | Run `icons:build` then pack `packages/icons` as a local `.tgz` |

### Troubleshooting

**Only one weight appears in the icon browser**
- Run `npm run icons:build` and `npm run icons:verify`.
- Confirm `public/icons/manifest.json` includes all canonical weights.
- Confirm `public/icons/v<version>/manifest.json` exists and matches icon count.

**Icons are stale after deploy**
- Prefer versioned URLs (`/icons/v<version>/...`) to avoid stale misses.
- Legacy `/icons/<weight>/<id>.svg` endpoints are intentionally cached for a shorter TTL, not immutable.

---

## Local Development

```bash
npm install
npm run icons:build
npm run icons:verify
npm run dev
```

## Deploy (Vercel)

Build command:
```bash
npm run build
```

Environment variable:
```bash
NEXT_PUBLIC_ICON_CDN_BASE=https://<your-vercel-domain>
```
