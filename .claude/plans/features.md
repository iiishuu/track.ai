# Feature Plans (Pre-brainstorm — to be refined)

## Landing Page

- Hero avec champ de saisie de domaine integre
- Animations ReactBits (text animations, transitions, hover)
- 3 etapes visuelles "Comment ca marche"
- Section apercu avec mock du dashboard
- Logos des IA trackees
- Footer
- Responsive mobile-first pour la landing

## Scan Page

- SSE pour affichage progressif du pipeline
- Chaque etape animee au fur et a mesure
- Preview rapide (score + citations) avant "Voir le rapport"
- 3 boutons: Voir rapport, Partager, Telecharger
- Gestion d'erreurs gracieuse (domaine invalide, API down)

## Report Page

- Section 1: Score (0-100) + metriques (taux citation, position moyenne, sentiment, share of voice, sources)
- Section 2: Reponses brutes avec highlight de la marque
- Section 3: Recommandations actionnables priorisees
- URL partageable sans auth
- Export PDF

## History Page

- Graphique d'evolution du score dans le temps
- Liste des scans (date, domaine, score, lien rapport)
- Filtre par domaine

## AI Provider System

- Interface commune `AIProvider` (query, parseResponse)
- Implementation Perplexity (prioritaire)
- Architecture plug-and-play pour ajouter OpenAI/Gemini
- Gestion des rate limits par provider
- Fallback si un provider est down

## Scoring Engine

- Score 0-100 base sur: taux de citation, position, sentiment, diversite des queries
- Transparence: afficher "base sur X queries sur [providers]"
- Metriques agregees: share of voice, sources d'influence
- Formule documentee et testee
