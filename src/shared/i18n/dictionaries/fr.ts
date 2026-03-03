import type { Dictionary } from "../types";

export const fr: Dictionary = {
  meta: {
    siteTitle: "TrackAI — Suivi de Visibilité IA",
    siteDescription:
      "Suivez la visibilité de votre marque sur les moteurs de recherche IA comme ChatGPT, Gemini et Perplexity.",
    scanTitle: "Analysez votre domaine — TrackAI",
    scanDescription:
      "Analysez la visibilité de votre marque sur les moteurs de recherche IA comme ChatGPT, Gemini et Perplexity.",
    historyTitle: "Historique des scans — TrackAI",
    historyDescription:
      "Consultez vos analyses de visibilité IA passées et suivez les performances de votre marque.",
    reportNotFound: "Rapport introuvable — TrackAI",
    reportTitle: "{domain} — Rapport de visibilité IA — TrackAI",
    reportDescription:
      "Score de visibilité IA : {score}/100 pour {domain} dans le secteur {sector}.",
    loadingTitle: "Analyse en cours — TrackAI",
  },

  nav: {
    scan: "Scanner",
    history: "Historique",
    dashboard: "Dashboard",
    compare: "Comparer",
  },

  hero: {
    badge: "Suivi IA en temps réel",
    titleBefore: "Découvrez ce que l'IA",
    titleHighlight: "dit de votre marque",
    titleAfter: "",
    description:
      "Voyez précisément comment ChatGPT, Gemini et Perplexity mentionnent votre marque. TrackAI vous donne un score de visibilité clair et des actions concrètes.",
    descPrefix: "Surveillez comment les moteurs IA référencent votre marque — avec un suivi en temps réel de la",
    badgeVisibility: "Visibilité",
    badgeRanking: "Position",
    badgeSentiment: "Sentiment",
    placeholder: "Entrez votre domaine...",
    analyze: "Scan gratuit",
    ctaSubtext: "Sans carte bancaire · Résultats instantanés",
  },

  aiLogos: {
    title: "Surveillez votre marque sur",
    engines: ["ChatGPT", "Perplexity", "Gemini", "Copilot", "Claude"],
  },

  howItWorks: {
    title: "Comment fonctionne TrackAI",
    subtitle:
      "Trois étapes pour comprendre comment les moteurs IA perçoivent votre marque.",
    stepLabel: "Étape",
    steps: [
      {
        icon: "Globe",
        title: "Entrez votre domaine",
        description:
          "Renseignez le domaine de votre marque et TrackAI lance des requêtes ciblées sur les principaux moteurs de recherche IA.",
      },
      {
        icon: "Brain",
        title: "Analyse IA automatisée",
        description:
          "Nous envoyons des requêtes spécifiques à votre secteur et analysons chaque réponse : mentions, position et tonalité.",
      },
      {
        icon: "BarChart3",
        title: "Insights actionnables",
        description:
          "Recevez un score de visibilité sur 100, un benchmark concurrentiel et des recommandations prioritaires applicables immédiatement.",
      },
    ],
  },

  features: {
    title: "Pensé pour le SEO de l'ère IA",
    subtitle:
      "Les métriques de visibilité que les outils SEO classiques ne peuvent pas fournir.",
    items: [
      {
        icon: "Search",
        title: "Scan multi-moteurs",
        description:
          "Lancez des requêtes ciblées sur ChatGPT, Gemini et Perplexity en un seul scan — sans tester manuellement chaque prompt.",
      },
      {
        icon: "Target",
        title: "Détection de mentions",
        description:
          "Identifiez exactement où votre marque apparaît dans les réponses IA : position, contexte et tonalité positive ou négative.",
      },
      {
        icon: "TrendingUp",
        title: "Score de visibilité (0–100)",
        description:
          "Un score unique qui mesure votre présence globale sur les moteurs de recherche IA — suivez-le dans le temps.",
      },
      {
        icon: "Users",
        title: "Benchmark concurrentiel",
        description:
          "Identifiez les concurrents que les moteurs IA mentionnent avec votre marque et comparez la part de voix dans votre secteur.",
      },
      {
        icon: "Lightbulb",
        title: "Recommandations priorisées",
        description:
          "Obtenez des actions spécifiques à votre secteur, classées par impact — des lacunes de contenu aux améliorations de données structurées.",
      },
      {
        icon: "LineChart",
        title: "Suivi des tendances",
        description:
          "Lancez des scans réguliers et observez l'évolution de votre visibilité. Mesurez l'impact de vos changements de contenu.",
      },
    ],
  },

  stats: {
    title: "La plateforme en un coup d'œil",
    subtitle: "Intelligence de visibilité IA en temps réel pour les marques modernes.",
    items: [
      { value: 4, suffix: "", label: "Catégories de requêtes" },
      { value: 3, suffix: "", label: "Moteurs IA analysés" },
      { value: 100, suffix: "", label: "Score de visibilité max" },
      { value: 24, suffix: "/7", label: "Surveillance prête" },
    ],
  },

  finalCta: {
    title: "Commencez à suivre votre visibilité IA",
    description:
      "Entrez votre domaine et obtenez un rapport de visibilité IA complet en moins de deux minutes — score, concurrents et recommandations inclus.",
    placeholder: "Entrez votre domaine...",
    analyze: "Scan gratuit",
    ctaSubtext: "Sans carte bancaire",
  },

  footer: {
    tagline: "TrackAI",
    description:
      "Intelligence de visibilité IA — suivez comment ChatGPT, Gemini et Perplexity référencent votre marque et améliorez votre présence.",
    product: "Produit",
    productLinks: [
      { label: "Scan IA", href: "/scan" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Comparer", href: "/compare" },
    ],
    resources: "Ressources",
    resourceLinks: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guide SEO IA", href: "#" },
    ],
    legal: "Légal",
    legalLinks: [
      { label: "Politique de confidentialité", href: "#" },
      { label: "Conditions d'utilisation", href: "#" },
    ],
    copyright: "Tous droits réservés.",
  },

  scan: {
    title: "Analysez votre domaine",
    description:
      "Entrez un domaine pour découvrir comment les moteurs de recherche IA référencent votre marque.",
    placeholder: "exemple.com",
    analyze: "Analyser",
    analyzing: "Analyse en cours...",
    whatWeAnalyze: "Ce que nous analysons",
    infoCards: [
      {
        title: "Requêtes IA",
        description:
          "Nous interrogeons les moteurs IA leaders comme Perplexity, ChatGPT et Gemini avec des requêtes stratégiques liées à votre secteur.",
      },
      {
        title: "Détection de présence",
        description:
          "Nous détectons si et où votre marque apparaît dans les réponses IA, en suivant la position, le sentiment et le contexte.",
      },
      {
        title: "Rapport actionnable",
        description:
          "Obtenez un score de visibilité complet, une analyse concurrentielle et des recommandations personnalisées.",
      },
    ],
    aiEngine: "Moteur IA",
    aiEngineDesc: "Sélectionnez le moteur IA à interroger",
    queryTypes: "Types de questions",
    queryTypesDesc: "Choisissez les types de requêtes à exécuter",
    depth: "Profondeur d'analyse",
    depthDesc: "Nombre de requêtes stratégiques à exécuter",
    commercial: "Commerciales",
    commercialDesc: "Meilleurs produits, où acheter, avis",
    comparative: "Comparatives",
    comparativeDesc: "Marque vs concurrent, alternatives, top 5",
    reputation: "Réputation",
    reputationDesc: "Avis sur la marque, fiabilité, problèmes",
    informational: "Informationnelles",
    informationalDesc: "Comment ça marche, guides, explications",
    quick: "Rapide",
    quickDesc: "5 requêtes",
    standard: "Standard",
    standardDesc: "10 requêtes",
    deep: "Approfondie",
    deepDesc: "20 requêtes",
  },

  scanSteps: {
    domainValidation: "Validation du domaine",
    sectorDiscovery: "Découverte du secteur",
    aiQueryAnalysis: "Analyse des requêtes IA",
    scoreComputation: "Calcul du score",
    recommendations: "Recommandations",
  },

  loading: {
    title: "Analyse de {domain}",
    subtitle: "Nos agents IA examinent la visibilité de votre marque",
    stepDescriptions: {
      domainValidation:
        "Vérification de la validité et de l'accessibilité du domaine...",
      sectorDiscovery:
        "Identification de votre secteur d'activité et de vos concurrents clés...",
      aiQueryAnalysis:
        "Interrogation des moteurs IA avec des requêtes stratégiques sur votre marque...",
      scoreComputation:
        "Calcul de votre score de visibilité à travers toutes les réponses...",
      recommendations:
        "Génération de recommandations personnalisées pour votre marque...",
    },
    complete: "Analyse terminée !",
    redirecting: "Redirection vers votre rapport...",
    error: "Une erreur est survenue",
    tryAgain: "Réessayer",
    facts: [
      "70 % des utilisateurs font confiance aux recommandations générées par l'IA pour choisir un produit.",
      "Les marques mentionnées dans les 3 premières positions des réponses IA obtiennent 5x plus de visibilité.",
      "Les moteurs de recherche IA analysent plus de 100 sources de données pour formuler leurs réponses.",
      "Votre empreinte numérique sur les sites d'avis impacte directement votre visibilité IA.",
      "Les données structurées sur votre site aident les moteurs IA à mieux comprendre votre marque.",
    ],
  },

  report: {
    visibilityScore: "Score de visibilité IA",
    metrics: "Métriques",
    aiResponses: "Réponses IA",
    recommendations: "Recommandations",
    position: "Position",
    scoreGood: "Bon",
    scoreAverage: "Moyen",
    scoreLow: "Faible",
    header: "Rapport de visibilité IA",
    scanDate: "Analysé le {date}",
    downloadPdf: "Télécharger PDF",
    competitiveAnalysis: "Analyse concurrentielle",
    shareOfVoiceChart: "Répartition de la part de voix",
    yourBrand: "Votre marque",
    sourceAnalysis: "Analyse des sources",
    influenceSources: "Sources d'influence",
    influenceSourcesDesc:
      "Principaux domaines et sources cités dans les réponses IA de votre secteur",
    queriesAnalyzed: "Requêtes analysées",
    queriesAnalyzedDesc: "requêtes stratégiques envoyées aux moteurs IA",
    sourcesCount: "Sources trouvées",
    sourcesCountDesc: "sources uniques référencées par l'IA",
    viewFullResponse: "Voir la réponse complète",
    hideFullResponse: "Masquer la réponse complète",
    aiSources: "Sources",
    noSources: "Aucune source disponible",
    noInfluenceSources: "Aucune source d'influence détectée",
    scoreContext: {
      good: "Votre marque bénéficie d'une forte visibilité sur les moteurs de recherche IA. Les assistants IA mentionnent et recommandent fréquemment votre marque.",
      average:
        "Votre marque a une visibilité modérée. Il y a des axes d'amélioration pour la façon dont les moteurs IA référencent votre marque.",
      low: "Votre marque a une visibilité limitée dans les réponses IA. Des améliorations significatives sont nécessaires pour augmenter votre présence IA.",
    },
  },

  metrics: {
    citationRate: "Taux de citation",
    citationRateDesc: "des réponses IA vous mentionnent",
    avgPosition: "Position moy.",
    avgPositionDesc: "quand mentionné dans les résultats",
    sentiment: "Sentiment",
    sentimentDesc: "perception IA globale",
    shareOfVoice: "Part de voix",
    noData: "Aucune donnée",
    na: "N/A",
  },

  labels: {
    present: "Présent",
    absent: "Absent",
    positive: "positif",
    neutral: "neutre",
    negative: "négatif",
    high: "haute",
    medium: "moyenne",
    low: "basse",
  },

  history: {
    title: "Historique des scans",
    description:
      "Consultez et comparez vos analyses de visibilité IA passées.",
    filterPlaceholder: "Filtrer par domaine...",
    loading: "Chargement de l'historique...",
    empty: "Aucun scan pour le moment. Commencez par analyser un domaine.",
    errorFetch: "Impossible de charger l'historique",
  },

  dashboard: {
    title: "Tableau de bord visibilité IA",
    sectorLabel: "Secteur",
    scansCount: "scan",
    viewingScanFrom: "Scan du",
    selectScan: "Sélectionner un scan",
    viewFullReport: "Voir le rapport complet",
    noScansTitle: "Aucun scan pour",
    noScansDesc: "Lancez votre première analyse pour commencer le suivi.",
    launchAnalysis: "Lancer l'analyse",
    newAnalysis: "Nouvelle analyse",
    analyzing: "Analyse en cours…",
    visibilityScore: "Score de visibilité",
    citationRate: "Taux de citation",
    citationRateSub: "des requêtes IA",
    avgPosition: "Position moy.",
    avgPositionSub: "quand mentionné",
    sentiment: "Sentiment",
    firstScan: "Premier scan",
    visibilityOverTime: "Visibilité dans le temps",
    visibilityChartLegend: "Score (plein) · Citation % (pointillé)",
    shareOfVoice: "Part de voix",
    sovSub: "Aperçu du dernier scan",
    competitorEvolution: "Évolution concurrentielle",
    competitorEvolutionSub: "Part de voix sur tous les scans",
    needMoreScans: "2+ scans nécessaires",
    needMoreScansSub: "Lancez une autre analyse pour voir les tendances",
    recommendations: "Recommandations",
    recommendationsFrom: "Du dernier scan",
    scanHistory: "Historique des scans",
    noScansRecorded: "Aucun scan enregistré.",
    latest: "Dernier",
    viewing: "En cours",
    report: "Rapport",
    noData: "Pas encore de données",
    noCompetitorData: "Aucune donnée concurrentielle",
    dashboardUpdated: "Dashboard mis à jour",
    priorityHigh: "Haute",
    priorityMedium: "Moyenne",
    priorityLow: "Basse",
    noRecommendations: "Aucune recommandation",
    date: "Date",
    score: "Score",
    avgPositionHeader: "Position moy.",
    sentimentHeader: "Sentiment",
    goBack: "Retour",
    avgAcross: "Moy. sur",
    queryTypeBreakdown: "Performance par type de requête",
    queryTypeBreakdownSub: "Comment votre marque performe par catégorie de requête",
    queryTypeNoData: "Aucune donnée de requête",
    queryCommercial: "Commerciales",
    queryComparative: "Comparatives",
    queryReputation: "Réputation",
    queryInformational: "Informationnelles",
    influenceSources: "Sources d'influence",
    influenceSourcesSub: "Sources les plus citées par les moteurs IA sur votre marque",
    noInfluenceSources: "Aucune source d'influence détectée",
  },

  compare: {
    title: "Comparaison de domaines",
    description: "Lancez des scans parallèles et comparez la visibilité IA côte à côte.",
    domainA: "Domaine A",
    domainB: "Domaine B",
    placeholder: "exemple.com",
    runComparison: "Comparer",
    comparing: "Scan en cours…",
    scanningBoth: "Scans parallèles en cours pour les deux domaines",
    scanProgress: "Progression du scan",
    waitingForResults: "Construction de la comparaison…",
    noData: "Aucune donnée",
    noDataDesc: "Entrez deux domaines ci-dessus et lancez la comparaison.",
    scoreComparison: "Comparaison des scores",
    metricsBreakdown: "Détail des métriques",
    sovOverlap: "Part de voix croisée",
    visibilityScore: "Score de visibilité",
    citationRate: "Taux de citation",
    avgPosition: "Position moy.",
    sentiment: "Sentiment",
    recommendations: "Recommandations clés",
    winner: "Leader",
    tie: "Égalité",
    vs: "vs",
    better: "devance de",
    worse: "en retard de",
    advantageFor: "Avantage",
    strengthsWeaknesses: "Forces & Faiblesses",
    sharedCompetitors: "Concurrents communs",
    uniqueTo: "Unique à",
    gapAnalysis: "Analyse des écarts",
    metricAdvantage: "Avantage métrique",
    strongerOn: "Plus fort sur",
    weakerOn: "Plus faible sur",
    keyInsights: "Points clés",
    existingScan: "Scan existant",
    newScan: "Nouveau scan",
    selectScan: "Sélectionner un scan passé",
    searchHistory: "Rechercher par domaine...",
    scanDate: "Date",
    score: "Score",
    scanParams: "Paramètres du scan",
    noHistory: "Aucun scan correspondant.",
    loadingHistory: "Chargement de l'historique...",
    loadingReport: "Chargement du rapport...",
  },

  errors: {
    scanFailed: "L'analyse a échoué. Veuillez réessayer plus tard.",
    unexpected: "Une erreur inattendue s'est produite",
  },
};
