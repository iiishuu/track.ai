# Git — Commits, Branching & Push Protocol

## Convention de commits: Conventional Commits

```
feat: add scan progress bar
fix: correct score calculation for unranked domains
chore: update dependencies
docs: add API documentation
test: add unit tests for scoring engine
refactor: extract AI provider interface
style: fix formatting in report page
perf: optimize Perplexity API calls batching
ci: add type-check step to CI pipeline
```

## Rythme de commits

- Committer **regulierement** a chaque etape logique completee
- Un commit = une unite de travail coherente
- Exemples de bon rythme :
  - Setup du projet -> commit
  - Un composant UI termine -> commit
  - Un endpoint API fonctionnel -> commit
  - Un fix de bug -> commit
  - Des tests ajoutes -> commit
- **Ne pas** accumuler 3h de travail dans un seul commit
- **Ne pas** committer chaque micro-changement

## Branching: GitHub Flow

- `main` = branche de production, toujours deployable
- Feature branches: `feat/nom-feature`, `fix/nom-bug`, `chore/nom-tache`
- Toute modification passe par une **PR avec CI verte obligatoire**
- Jamais de push direct sur `main`
- Releases taguees quand necessaire (milestones, demos)

## Protocole de push

1. Creer une branche depuis `main`: `git checkout -b feat/ma-feature`
2. Developper + committer regulierement
3. Pousser la branche: `git push -u origin feat/ma-feature`
4. Creer une PR via `gh pr create`
5. CI doit passer (lint + typecheck + tests + build)
6. Merge via squash ou merge commit
7. Supprimer la branche apres merge
