--# TrackAI — AI Visibility Tracker SaaS

## 🎯 Vision Produit

TrackAI est un SaaS gratuit qui permet de tracker la visibilité d'une marque/domaine sur les moteurs de recherche IA (ChatGPT, Gemini, Perplexity). L'utilisateur entre un nom de domaine et obtient un rapport complet : score de visibilité, métriques, réponses brutes des IA, analyse concurrentielle, sources d'influence, et recommandations actionnables.

Ce projet est un exercice technique pour SEO AI Systems. L'objectif est de montrer :
- Une vraie réflexion produit sur le GEO (Generative Engine Optimization)
- Un SaaS complet avec un design professionnel (niveau Peec.ai)
- Une architecture scalable même si la logique métier est MVP
- Une CI/CD complète et des pratiques d'ingénierie matures

---

## 🏗️ Stack Technique

| Composant | Technologie |
|-----------|------------|
| Framework | Next.js (App Router) |
| UI | shadcn/ui + ReactBits (animations/effets visuels) |
| Styling | Tailwind CSS |
| Base de données | Supabase (PostgreSQL) |
| Déploiement | Vercel (gratuit) |
| CI/CD | GitHub Actions |
| Containerisation | Docker (dev local uniquement) |
| API IA principale | Perplexity API (modèle sonar) |
| API IA secondaires | OpenAI, Gemini (à brancher après, architecture extensible) |

---

## 📄 Pages & Features

### Page 1 : Landing Page (`/`)

**Objectif** : Première impression professionnelle. L'utilisateur doit voir un produit, pas un projet étudiant.

**Contenu** :
- **Hero section** : Titre accrocheur + sous-titre expliquant la proposition de valeur + **champ de saisie du domaine** intégré directement dans le hero + bouton CTA "Analyser"
- **Section "Comment ça marche"** : 3 étapes visuelles (Entrez votre domaine → On interroge les IA → Recevez votre rapport)
- **Section aperçu** : Screenshot ou mock du dashboard pour montrer ce que l'utilisateur va obtenir
- **Section logos** : Logos des IA trackées (ChatGPT, Perplexity, Gemini)
- **Footer** classique

**Comportement** : Quand l'utilisateur entre un domaine dans le hero et clique "Analyser", il est redirigé vers `/scan?domain=example.com`

**Design** : Utiliser ReactBits pour les animations (text animations, transitions, hover effects). Le design doit être moderne, sombre ou clair mais pro. S'inspirer de https://peec.ai/ pour le niveau de qualité visuelle.

**SEO/Meta** : Open Graph tags, meta description, favicon. C'est un SaaS de visibilité — le site lui-même doit être bien optimisé.

**Responsive** : La landing page doit être mobile-friendly.

---

### Page 2 : Page de Scan (`/scan?domain=example.com`)

**Objectif** : Transformer le temps d'attente en expérience engageante.

**Comportement** : Affichage progressif en temps réel du pipeline. Chaque étape apparaît au fur et à mesure :

```
🔍 Analyse du domaine example.com...
📊 Identification du secteur : [Secteur détecté]
🔑 Génération des requêtes stratégiques...
💬 Interrogation de Perplexity sur "[Query 1]"...
✅ Réponse reçue — analyse en cours
💬 Interrogation de Perplexity sur "[Query 2]"...
✅ Réponse reçue — analyse en cours
...
📈 Calcul du score de visibilité...
✅ Rapport prêt !
```

**Technique** : Server-Sent Events (SSE) ou polling depuis le front pour recevoir les updates du back-end en temps réel.

**À la fin du scan** : Afficher 3 boutons d'action :
1. **Voir le rapport** → redirige vers `/report/[id]`
2. **Partager** → copie le lien `/report/[id]` dans le presse-papier
3. **Télécharger** → version imprimable/PDF du rapport

**Preview** : Avant même de cliquer "Voir le rapport", afficher un résumé rapide (score global + nombre de citations) directement sur la page de scan.

---

### Page 3 : Page Rapport (`/report/[id]`)

**Objectif** : Le cœur du produit. Un template de rapport fixe rempli par les données du scan.

**Structure du rapport (dans cet ordre de priorité)** :

#### Section 1 : Score & Métriques (priorité haute)
- **AI Visibility Score** (0-100) — score global bien visible, gros chiffre
- **Taux de citation** — sur X queries, la marque apparaît dans Y réponses
- **Position moyenne** — quand citée, en moyenne position N
- **Sentiment global** — positif / neutre / négatif
- **Share of Voice** — graphique circulaire (camembert) : ta marque X% vs concurrent A Y% vs concurrent B Z%
- **Sources d'influence** — les sites web que les IA utilisent comme références

*Note : Le détail des métriques et la formule du score seront affinés pendant l'implémentation. L'important est que le scoring soit transparent (afficher "basé sur X queries sur Perplexity").*

#### Section 2 : Réponses Brutes des IA (transparence)
- Pour chaque query posée, afficher :
  - La question posée
  - La réponse complète de l'IA
  - Si la marque est citée (highlight)
  - Les concurrents cités
  - Les sources utilisées par l'IA

#### Section 3 : Recommandations Actionnables
- Liste de recommandations concrètes générées par l'IA
- Chaque recommandation doit être spécifique : "Créez du contenu sur [sujet] car Perplexity utilise [source] comme référence et vous n'y êtes pas"
- Priorisées par impact potentiel

**URL partageable** : Chaque rapport a une URL unique `/report/[id]` accessible par n'importe qui (pas d'auth).

**Téléchargement** : Bouton qui génère une version imprimable/PDF du rapport.

---

### Page 4 : Page Historique (`/history`)

**Objectif** : Suivi dans le temps. Montrer que c'est un outil de monitoring, pas un one-shot.

**Contenu** :
- **Graphique d'évolution** en haut : courbe du score de visibilité au fil du temps (par domaine)
- **Liste des scans** en dessous : date + domaine + score + lien vers le rapport complet

*Note : Sans auth, l'historique sera lié au domaine scanné. L'utilisateur peut voir l'historique de n'importe quel domaine.*

---

## ⚙️ Pipeline Métier (Backend)

### Architecture extensible

L'implémentation doit être conçue pour que l'ajout d'un nouveau provider IA (Gemini, OpenAI) soit simple. Utiliser un pattern d'abstraction (interface/adapter) pour les providers.

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐     ┌────────────────┐
│  Input   │────▶│  Discovery   │────▶│  Query LLMs │────▶│ Analysis │────▶│  Report Gen    │
│ (domain) │     │ (secteur +   │     │ (Perplexity │     │ (parsing │     │ (score +       │
│          │     │  queries)    │     │  API calls)  │     │  + scoring│    │  recommendations│
└─────────┘     └──────────────┘     └─────────────┘     └──────────┘     └────────────────┘
```

### Étape 1 : Discovery
- Input : URL du domaine
- Action : Appeler un LLM pour analyser le domaine et déterminer :
  - Le secteur d'activité
  - Les concurrents probables
  - 5-10 requêtes stratégiques "intent-based" (informatives, transactionnelles, comparatives)
- Output : Objet structuré avec secteur + liste de queries

### Étape 2 : Interrogation des IA
- Input : Liste de queries
- Action : Pour chaque query, appeler l'API Perplexity (modèle sonar) qui fait une recherche web en temps réel et retourne les sources citées
- Output : Pour chaque query, le texte de la réponse + les sources/citations
- **Important** : Architecture extensible pour brancher d'autres providers après

### Étape 3 : Analyse & Parsing
- Input : Réponses brutes des IA
- Action : Utiliser un LLM en mode "structured output" (JSON) pour extraire de chaque réponse :
  - `is_present` : boolean (la marque est-elle citée ?)
  - `rank` : number (position dans la liste si citée)
  - `sentiment` : "positive" | "neutral" | "negative"
  - `competitors` : string[] (concurrents cités)
  - `sources` : string[] (URLs des sources utilisées par l'IA)
  - `context` : string (dans quel contexte la marque est mentionnée)
- Output : Données structurées pour chaque query

### Étape 4 : Scoring & Recommandations
- Input : Données structurées de toutes les queries
- Action :
  - Calculer le score global et les métriques agrégées
  - Générer des recommandations actionnables via un LLM basé sur l'analyse de gap (ce que les concurrents ont et que le client n'a pas)
- Output : Rapport complet prêt à afficher

### Stockage (Supabase)
- Table `scans` : id, domain, created_at, status
- Table `reports` : id, scan_id, score, metrics (JSON), raw_responses (JSON), recommendations (JSON)
- *Le schéma exact sera affiné pendant l'implémentation*

---

## 🔄 CI/CD (GitHub Actions)

### À chaque push (toutes les branches) :
- **Lint** : ESLint
- **Type check** : TypeScript
- **Tests** : Tests unitaires (Vitest ou Jest)
- **Audit sécurité** : `npm audit` + optionnel Snyk/SonarCloud

### À chaque merge sur main :
- Tout ce qui est au-dessus +
- **Build** : Vérifier que le projet build sans erreur
- **Deploy** : Déploiement automatique sur Vercel
- **Tag de version** : Semantic versioning automatique

### Fichiers attendus dans le repo :
- `.github/workflows/ci.yml` — Pipeline CI
- `.github/workflows/deploy.yml` — Pipeline de déploiement
- `docker-compose.yml` — Setup dev local avec PostgreSQL
- `.env.example` — Variables d'environnement documentées
- `README.md` — Documentation complète (stack, architecture, comment lancer en local, comment contribuer)

---

## 🛡️ Bonnes Pratiques

- **Rate limiting** : Implémenter un rate limit basique par IP sur les endpoints de scan (pas d'auth = risque de spam des APIs payantes)
- **Gestion d'erreurs** : Si l'API Perplexity est down, si le domaine n'existe pas, si le parsing échoue → messages d'erreur propres, pas de crash
- **Variables d'environnement** : Toutes les clés API dans `.env`, jamais en dur
- **TypeScript strict** : Typage complet pour la robustesse
- **Code propre** : Composants bien découpés, logique métier séparée de la UI

---

## 🎨 Design

- **Inspiration principale** : https://peec.ai/ pour le niveau de qualité
- **UI Kit** : shadcn/ui pour tous les composants structurels (boutons, cartes, tableaux, formulaires)
- **Animations** : ReactBits (https://reactbits.dev) pour le wow effect sur la landing page et les transitions
- **Style** : Moderne, professionnel. Thème sombre ou clair au choix mais cohérent.
- **Dashboard desktop-first**, landing page responsive

---

## 📋 Priorités d'exécution

### Jour 1 : Fondations + Pipeline
1. Setup du projet (Next.js, shadcn, Supabase, Docker, GitHub Actions)
2. Pipeline back-end complet : domaine → discovery → queries → Perplexity API → parsing → scoring
3. Page de scan avec affichage progressif
4. Page rapport fonctionnelle (même avec un design basique)

### Jour 2 : Design + Polish
1. Landing page avec design pro et ReactBits
2. Polish du dashboard/rapport
3. Page historique
4. Fonctionnalités partage/téléchargement
5. Tests, README, cleanup du code
6. Si temps restant : auth basique, ajout OpenAI/Gemini

---

## 🔑 APIs nécessaires

- **Perplexity API** : Clé à créer sur https://docs.perplexity.ai/ — modèle `sonar` pour le search en temps réel
- **Supabase** : Créer un projet sur https://supabase.com/ — récupérer URL + anon key
- **Vercel** : Connecter le repo GitHub pour le déploiement auto

---

## 📝 Notes pour la présentation (15 min avec Nathan)

- Avoir un scan de démo déjà prêt (ne pas tout faire en live)
- Expliquer les choix d'architecture (pourquoi Perplexity en premier, pourquoi l'architecture extensible)
- Montrer la CI/CD et le repo GitHub
- Parler des limites assumées (non-déterminisme des LLMs, petit échantillon) et des améliorations futures
- Mentionner le terme "GEO" (Generative Engine Optimization) naturellement
- Expliquer la différence entre SEO classique et visibilité IA
