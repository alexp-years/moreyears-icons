# More Years Icon CDN POC

Proof of concept for a custom icon CDN and npm package, synced from the published `@moreyears/icons` package.

## Scope
- Public app routes:
  - `/`
  - `/icons`
- Static CDN assets:
  - `/icons/<weight>/<id>.svg`
  - `/icons/manifest.json`
- Package output:
  - `packages/icons/dist`

## Commands
```bash
npm i @moreyears/icons
npm run icons:build
npm run dev
```

```bash
npm run build:poc
```

```bash
npm run icons:pack
```

## Deploy (Vercel)
- Build command:
```bash
npm run icons:build && npm run build -- --webpack
```

- Environment variable:
```bash
NEXT_PUBLIC_ICON_CDN_BASE=https://<your-vercel-domain>
```

## Developer Handoff
See:
- `ICON_CDN_POC_HANDOFF.md`
