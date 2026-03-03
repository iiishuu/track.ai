# TrackAI — Project Context

## Overview

TrackAI is a SaaS that tracks brand/domain visibility on AI search engines (ChatGPT, Gemini, Perplexity). Technical exercise for **SEO AI Systems** (Nathan, Founder). Working MVP presented in a 15-min session.

**Evaluation criteria**: product thinking, AI visibility understanding, recommendation quality, smart use of AI as accelerator.

**Key insight**: This is for an SEO agency — the site itself must demonstrate excellent technical SEO.

## Stack

| Composant | Technologie |
|---|---|
| Framework | Next.js (App Router) |
| Package Manager | pnpm |
| UI | shadcn/ui + ReactBits (animations) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| CI/CD | GitHub Actions |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Container | Docker (dev local only) |
| AI API (primary) | Perplexity API (sonar) |
| AI API (secondary) | OpenAI, Gemini (extensible) |

## Rules & Plans

Detailed rules and plans are split into dedicated files:

- `.claude/rules/git.md` — Commits, branching, push protocol
- `.claude/rules/ci-cd.md` — CI/CD pipeline
- `.claude/rules/coding-style.md` — TypeScript, architecture, naming, file structure
- `.claude/rules/testing.md` — Testing strategy
- `.claude/rules/security.md` — Security standards
- `.claude/rules/seo.md` — Technical SEO
- `.claude/plans/global.md` — Global project plan (5 phases)
- `.claude/plans/features.md` — Pre-brainstorm feature plans
