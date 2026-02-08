# More Years Icon CDN POC Handoff

## Goal
Ship a production-safe proof of concept for:
- Team-facing icon catalog UI (`/` and `/icons`)
- Static SVG CDN endpoints (`/icons/<weight>/<id>.svg`)
- Reusable npm package (`@moreyears/icons`)

This POC is Solar-based and intentionally designed so the in-house icon pack can replace source inputs without changing consumer APIs.

## Current State
- Web app routes intentionally exposed: `/`, `/icons`
- Other docs routes return `404`:
  - `/colors`
  - `/spacing`
  - `/typography`
  - `/components`
- Icon generator script:
  - `scripts/build-icons.mjs`
- Generated outputs:
  - `public/icons/**` (CDN assets)
  - `packages/icons/dist/**` (npm package distribution files)
- Search, category filtering, weight fallback, download SVG, and copy CDN URL are implemented in:
  - `components/docs/IconGrid.tsx`

## Runtime API Contract
- CDN path contract:
  - `/icons/<weight>/<id>.svg`
- Manifest path:
  - `/icons/manifest.json`
- Package exports:
  - `@moreyears/icons`
  - `@moreyears/icons/react`
  - `@moreyears/icons/manifest`

These contracts should not change when swapping from Solar to in-house icons.

## Build and Deploy Commands
- Local dev:
```bash
npm run icons:build
npm run dev
```

- Production build (recommended):
```bash
npm run build:poc
```

- Vercel build command:
```bash
npm run icons:build && npm run build -- --webpack
```

## Caching Policy (already added)
- Config file:
  - `vercel.json`
- Headers:
  - `/icons/manifest.json` short cache with revalidation
  - `/icons/*.svg` immutable long cache (`1 year`)

## Developer Workflow for New Icon Source
1. Replace Solar-derived source stage in `scripts/build-icons.mjs` with in-house source loader.
2. Preserve:
  - `id` uniqueness behavior
  - `weights` per icon
  - manifest schema fields (`id`, `name`, `sourceName`, `category`, `weights`)
  - output paths and file naming
3. Run:
```bash
npm run icons:build
npm run lint
npm run build:poc
```
4. Validate:
  - `/icons` catalog loads
  - search/filter results match manifest
  - copied CDN URLs resolve
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
  - Mitigation: keep `/icons/<weight>/<id>.svg` contract stable
- Risk: manifest/schema drift
  - Mitigation: treat manifest fields as versioned contract
- Risk: missing weights in in-house pack
  - Mitigation: keep fallback behavior in UI/package resolver

## Recommended Next Increment
1. Introduce explicit manifest schema validation in CI.
2. Add smoke checks for a sample of known icon URLs post-build.
3. Add versioned CDN prefix (`/icons/v1/...`) before broader adoption.
