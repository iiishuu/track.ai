# Project Plan — Global (5 Phases)

## Phase 1: Fondations

- [ ] Setup projet (Next.js, pnpm, shadcn, Tailwind, ESLint, Prettier, Vitest)
- [ ] Setup Supabase (schema tables scans + reports)
- [ ] Setup Docker (docker-compose dev local avec PostgreSQL)
- [ ] Setup CI/CD (GitHub Actions: lint, typecheck, tests, build)
- [ ] Structure de fichiers et types TypeScript de base

## Phase 2: Pipeline Backend

- [ ] **Discovery module**: Domain -> secteur + queries strategiques (via LLM)
- [ ] **AI Provider interface**: Pattern adapter pour Perplexity (extensible a OpenAI/Gemini)
- [ ] **Query execution**: Appels Perplexity API (sonar) avec gestion d'erreurs
- [ ] **Analysis & Parsing**: Extraction structuree des reponses (is_present, rank, sentiment, etc.)
- [ ] **Scoring engine**: Calcul du score de visibilite (0-100) + metriques agregees
- [ ] **Recommendations**: Generation de recommandations actionnables via LLM
- [ ] **API routes**: POST /api/scan, GET /api/report/[id], GET /api/history

## Phase 3: Frontend — Pages fonctionnelles

- [ ] **Page Scan** (`/scan`): Affichage progressif via SSE, feedback en temps reel
- [ ] **Page Report** (`/report/[id]`): Template de rapport avec score, metriques, reponses brutes, recommandations
- [ ] **Page History** (`/history`): Graphique d'evolution + liste des scans

## Phase 4: Landing Page & Design

- [ ] **Landing Page** (`/`): Hero + CTA + "Comment ca marche" + apercu + logos IA
- [ ] **Design system**: Theme coherent (dark/light), animations ReactBits
- [ ] **Polish**: Responsive, micro-interactions, transitions

## Phase 5: Finitions

- [ ] **Partage**: URL partageable + bouton copier le lien
- [ ] **Telechargement**: Export PDF du rapport
- [ ] **SEO**: Sitemap, robots.txt, structured data, OG tags, meta dynamiques
- [ ] **Tests**: Couverture des modules critiques
- [ ] **README**: Documentation complete
- [ ] **Demo**: Preparer un scan de demo pre-genere
