# More Years Icon CDN POC Handoff

## Goal
Ship a production-safe proof of concept for:
- Team-facing icon catalog UI (`/` and `/icons`)
- Static SVG CDN endpoints (versioned + legacy compatibility)
- Reusable npm package (`@moreyears/icons`)

This POC syncs from the published `@moreyears/icons` package, validates generated outputs at build time, and serves both versioned and legacy CDN-style paths.

## Current State
- Web app routes intentionally exposed: `/`, `/icons`
- Other docs routes return `404`:
  - `/colors`
  - `/spacing`
  - `/typography`
  - `/components`
- Icon generator script:
  - `scripts/build-icons.mjs`
- Icon verification script:
  - `scripts/verify-icons.mjs`
- Generated outputs:
  - `public/icons/<weight>/*.svg` (legacy CDN assets)
  - `public/icons/v<version>/<weight>/*.svg` (versioned CDN assets)
  - `public/icons/manifest.json`
  - `public/icons/v<version>/manifest.json`
  - `packages/icons/dist/**` (npm package distribution files)
- Search, category filtering, weight fallback, download SVG, and copy CDN URL are implemented in:
  - `components/docs/IconGrid.tsx`

## Runtime API Contract
- Preferred CDN path contract:
  - `/icons/v<version>/<weight>/<id>.svg`
- Backward-compatible legacy contract:
  - `/icons/<weight>/<id>.svg`
- Manifest paths:
  - `/icons/manifest.json`
  - `/icons/v<version>/manifest.json`
- Package exports:
  - `@moreyears/icons`
  - `@moreyears/icons/manifest`

Both contracts remain stable as the upstream package evolves. First-party UI now prefers versioned URLs; legacy remains supported.

## Build and Deploy Commands
- Local dev:
```bash
npm i @moreyears/icons@latest
npm run icons:build
npm run icons:verify
npm run dev
```

- Production build (authoritative):
```bash
npm run build
```

- Vercel build command:
```bash
npm run build
```

`npm run build` now runs:
1. `npm run icons:build`
2. `npm run icons:verify`
3. `next build --webpack`

## Caching Policy
- Config file:
  - `vercel.json`
- Headers:
  - Manifests (`/icons/manifest.json`, `/icons/v<version>/manifest.json`): short cache with revalidation
  - Versioned SVGs (`/icons/v<version>/<weight>/<id>.svg`): immutable long cache (`1 year`)
  - Legacy SVGs (`/icons/<weight>/<id>.svg`): shorter, non-immutable cache

## Developer Workflow for New Icon Source
1. Update to the latest published package version (`@moreyears/icons`).
2. Preserve:
  - `id` uniqueness behavior
  - `weights` per icon
  - manifest schema fields (`id`, `name`, `sourceName`, `category`, `weights`)
  - output paths and file naming for both legacy and versioned trees
3. Run:
```bash
npm i @moreyears/icons@latest
npm run build
npm run lint
```
4. Validate:
  - `/home/explore-icons` catalog loads
  - style selector includes all canonical weights
  - both legacy and versioned sample URLs resolve
  - search/filter results match manifest
  - fallback label appears only when selected weight is missing

## Publish Workflow
- Package path:
  - `packages/icons`
- Optional artifact check:
```bash
npm run icons:pack
```
- Publish:
```bash
cd packages/icons
npm publish --access public --tag poc
```

`prepublishOnly` runs package build before publish.

## Risks and Mitigations
- Risk: breaking consumer URLs
  - Mitigation: keep `/icons/<weight>/<id>.svg` stable while introducing `/icons/v<version>/...`
- Risk: manifest/schema drift
  - Mitigation: build-time verification (`icons:verify`) with actionable failure output
- Risk: stale cache serving mismatched assets
  - Mitigation: versioned immutable paths for first-party usage + shorter TTL for legacy paths
