# Testing Strategy

## Focus: logique metier

Les tests doivent valider les **attentes fonctionnelles** du projet, pas couvrir du boilerplate UI.

## Ce qu'on teste (priorite haute -> basse)

1. **Scoring engine** — Le calcul du score de visibilite doit etre deterministe et correct
2. **AI response parsing** — L'extraction structuree (is_present, rank, sentiment, competitors, sources) doit etre fiable
3. **Discovery pipeline** — La generation de queries strategiques doit etre coherente
4. **API routes** — Les endpoints doivent gerer les cas normaux et les erreurs proprement
5. **Composants critiques** — Uniquement les composants avec logique (pas les composants purement visuels)

## Ce qu'on ne teste PAS

- Les composants purement visuels (shadcn/ui wrappers, layout)
- Le styling / CSS
- Les appels API externes (on les mock)

## Convention de fichiers de test

- Tests a cote du fichier source: `scoringEngine.test.ts` dans le meme dossier que `scoringEngine.ts`
- Nommage: `[filename].test.ts` ou `[filename].test.tsx`
