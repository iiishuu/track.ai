# Coding Style

## TypeScript

- `strict: true` dans tsconfig — pas de `any` sauf cas justifie
- Types explicites pour les fonctions exportees et les props de composants
- Interfaces pour les objets metier (Report, Scan, Query, etc.)
- Enums ou union types pour les valeurs fixes (sentiment, status)

## Architecture: Frontend / Backend separes

- **`frontend/`**: Tout le UI — composants organises par page, hooks, rien de logique metier
- **`backend/`**: Toute la logique serveur — organisee par feature (scan, report, history) + lib partagee (AI providers, Supabase)
- **`shared/`**: Types, validators et config utilises par les deux cotes
- **`app/`**: Routes Next.js — thin layer qui branche frontend (composants) et backend (services)
- **Server Components par defaut** (App Router): `"use client"` uniquement quand necessaire

## Structure de fichiers

```
src/
  app/                              # Routes Next.js (thin layer)
    page.tsx                        # Landing
    layout.tsx
    globals.css
    scan/page.tsx
    report/[id]/page.tsx
    history/page.tsx
    api/scan/route.ts               # → appelle backend/scan/
    api/report/[id]/route.ts        # → appelle backend/report/
    api/history/route.ts            # → appelle backend/history/

  frontend/                         # UI uniquement
    components/
      landing/                      # Hero, HowItWorks, Preview, LogosAI
      scan/                         # ScanProgress, ScanForm
      report/                       # ScoreCard, QueryResultCard, RecommendationList
      history/                      # HistoryChart, HistoryList
      ui/                           # shadcn/ui components
    hooks/                          # useDebounce, useScan, etc.

  backend/                          # Logique serveur, par feature
    scan/                           # pipeline.ts, discovery.ts, analysis.ts, scoring.ts
    report/                         # reportService.ts
    history/                        # historyService.ts
    lib/
      ai/                           # Providers: Perplexity, OpenAI, Gemini
      supabase/                     # Client Supabase + helpers

  shared/                           # Partage entre front et back
    types/                          # Tous les types (Scan, Report, AIProvider, etc.)
    validators/                     # Validation de domaine, inputs
    config/                         # Constants, env config
```

## Regles d'import

- `frontend/` importe depuis `shared/` uniquement (jamais depuis `backend/`)
- `backend/` importe depuis `shared/` uniquement (jamais depuis `frontend/`)
- `app/` importe depuis `frontend/`, `backend/` et `shared/`
- Import alias: `@/` pointe vers `src/`

## Naming conventions

- Fichiers composants: `PascalCase.tsx` (ex: `ScoreCard.tsx`)
- Fichiers services/lib: `camelCase.ts` (ex: `scoringEngine.ts`)
- Fichiers de types: `camelCase.ts` dans `shared/types/`
- Variables/fonctions: `camelCase`
- Types/Interfaces: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: Tailwind utility classes (pas de CSS modules sauf exception)
