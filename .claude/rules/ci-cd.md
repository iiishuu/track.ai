# CI/CD Pipeline

## Sur chaque push (toutes les branches)

1. **Lint**: `pnpm lint`
2. **Type check**: `pnpm tsc --noEmit`
3. **Tests**: `pnpm test`
4. **Security audit**: `pnpm audit`

## Sur merge dans main

1. Tout le CI ci-dessus +
2. **Build**: `pnpm build`
3. **Deploy**: Deploiement auto sur Vercel
4. **Tag de version**: Semantic versioning si release

## Fichiers CI attendus

- `.github/workflows/ci.yml` — Pipeline CI (lint, typecheck, tests, audit)
- `.github/workflows/deploy.yml` — Pipeline deploy (build + Vercel)
