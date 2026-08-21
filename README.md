# SPR Homecraft

Premium SPR Homecraft furniture showroom built with React, Vite, and Tailwind CSS. The repository includes the supplied sofa photos, official logo, original videos, and browser-compatible H.264 videos under `client/public/assets/`.

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm check
pnpm build
pnpm preview
```

The Netlify configuration is included in `netlify.toml`. It builds with `pnpm build`, publishes `dist`, and uses `client/public/_redirects` for SPA routing. No Manus runtime, storage proxy, analytics injection, or Manus-specific files are required.
