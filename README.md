# PsychDispo

Psychiatric disposition and discharge planning tool for medically cleared patients.

**Live:** [psychdispo.com/dispo](https://psychdispo.com/dispo)

## Coverage

Ohio · Washington · NY/NJ · West Virginia

## Requirements

- Node.js ≥ 22.12 (see `.nvmrc`)

## Development

```bash
npm install
npm run dev
```

Open `/psychdispo.html#plan` for the disposition planner.

## Deploy (Vercel)

Build produces a Nitro/Vercel bundle (configured in `vite.config.ts`):

```bash
npm run build
npx vercel deploy --prebuilt --prod --yes
```

## Key files

| Path | Purpose |
|------|---------|
| `public/psychdispo.html` | Disposition planner (source of truth) |
| `public/psychref.html` | Psychiatric emergency clinical reference |
| `scripts/` | Patch and audit utilities |

## Scripts

- `scripts/button-audit.js` — live button/control audit
- `scripts/patch-opt-buttons.js` — convert `.opt` toggles to accessible buttons
- `scripts/patch-wv-expansion.js` — West Virginia resource expansion
