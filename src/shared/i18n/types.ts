export type Locale = "en" | "fr";

export type QueryType =
  | "commercial"
  | "comparative"
  | "reputation"
  | "informational";

export type ScanDepth = "quick" | "standard" | "deep";

export interface Dictionary {
  meta: {
    siteTitle: string;
    siteDescription: string;
    scanTitle: string;
    scanDescription: string;
    historyTitle: string;
    historyDescription: string;
    reportNotFound: string;
    reportTitle: string;
    reportDescription: string;
    loadingTitle: string;
  };

  nav: {
    scan: string;
    history: string;
    dashboard: string;
    compare: string;
  };

  hero: {
    badge: string;
    titleBefore: string;
    titleHighlight: string;
    titleAfter: string;
    description: string;
    descPrefix: string;
    badgeVisibility: string;
    badgeRanking: string;
    badgeSentiment: string;
    placeholder: string;
    analyze: string;
    ctaSubtext: string;
  };

  aiLogos: {
    title: string;
    engines: string[];
  };

  howItWorks: {
    title: string;
    subtitle: string;
    stepLabel: string;
    steps: Array<{ icon: string; title: string; description: string }>;
  };

  features: {
    title: string;
    subtitle: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };

  stats: {
    title: string;
    subtitle: string;
    items: Array<{ value: number; suffix: string; label: string }>;
  };

  finalCta: {
    title: string;
    description: string;
    placeholder: string;
    analyze: string;
    ctaSubtext: string;
  };

  footer: {
    tagline: string;
    description: string;
    product: string;
    productLinks: Array<{ label: string; href: string }>;
    resources: string;
    resourceLinks: Array<{ label: string; href: string }>;
    legal: string;
    legalLinks: Array<{ label: string; href: string }>;
    copyright: string;
  };

  scan: {
    title: string;
    description: string;
    placeholder: string;
    analyze: string;
    analyzing: string;
    whatWeAnalyze: string;
    infoCards: Array<{ title: string; description: string }>;
    aiEngine: string;
    aiEngineDesc: string;
    queryTypes: string;
    queryTypesDesc: string;
    depth: string;
    depthDesc: string;
    commercial: string;
    commercialDesc: string;
    comparative: string;
    comparativeDesc: string;
    reputation: string;
    reputationDesc: string;
    informational: string;
    informationalDesc: string;
    quick: string;
    quickDesc: string;
    standard: string;
    standardDesc: string;
    deep: string;
    deepDesc: string;
  };

  scanSteps: {
    domainValidation: string;
    sectorDiscovery: string;
    aiQueryAnalysis: string;
    scoreComputation: string;
    recommendations: string;
  };

  loading: {
    title: string;
    subtitle: string;
    stepDescriptions: {
      domainValidation: string;
      sectorDiscovery: string;
      aiQueryAnalysis: string;
      scoreComputation: string;
      recommendations: string;
    };
    complete: string;
    redirecting: string;
    error: string;
    tryAgain: string;
    facts: string[];
  };

  report: {
    visibilityScore: string;
    metrics: string;
    aiResponses: string;
    recommendations: string;
    position: string;
    scoreGood: string;
    scoreAverage: string;
    scoreLow: string;
    header: string;
    scanDate: string;
    downloadPdf: string;
    competitiveAnalysis: string;
    shareOfVoiceChart: string;
    yourBrand: string;
    sourceAnalysis: string;
    influenceSources: string;
    influenceSourcesDesc: string;
    queriesAnalyzed: string;
    queriesAnalyzedDesc: string;
    sourcesCount: string;
    sourcesCountDesc: string;
    viewFullResponse: string;
    hideFullResponse: string;
    aiSources: string;
    noSources: string;
    noInfluenceSources: string;
    scoreContext: {
      good: string;
      average: string;
      low: string;
    };
  };

  metrics: {
    citationRate: string;
    citationRateDesc: string;
    avgPosition: string;
    avgPositionDesc: string;
    sentiment: string;
    sentimentDesc: string;
    shareOfVoice: string;
    noData: string;
    na: string;
  };

  labels: {
    present: string;
    absent: string;
    positive: string;
    neutral: string;
    negative: string;
    high: string;
    medium: string;
    low: string;
  };

  history: {
    title: string;
    description: string;
    filterPlaceholder: string;
    loading: string;
    empty: string;
    errorFetch: string;
  };

  dashboard: {
    title: string;
    sectorLabel: string;
    scansCount: string;
    viewingScanFrom: string;
    selectScan: string;
    viewFullReport: string;
    noScansTitle: string;
    noScansDesc: string;
    launchAnalysis: string;
    newAnalysis: string;
    analyzing: string;
    visibilityScore: string;
    citationRate: string;
    citationRateSub: string;
    avgPosition: string;
    avgPositionSub: string;
    sentiment: string;
    firstScan: string;
    visibilityOverTime: string;
    visibilityChartLegend: string;
    shareOfVoice: string;
    sovSub: string;
    competitorEvolution: string;
    competitorEvolutionSub: string;
    needMoreScans: string;
    needMoreScansSub: string;
    recommendations: string;
    recommendationsFrom: string;
    scanHistory: string;
    noScansRecorded: string;
    latest: string;
    viewing: string;
    report: string;
    noData: string;
    noCompetitorData: string;
    dashboardUpdated: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    noRecommendations: string;
    date: string;
    score: string;
    avgPositionHeader: string;
    sentimentHeader: string;
    goBack: string;
    avgAcross: string;
    queryTypeBreakdown: string;
    queryTypeBreakdownSub: string;
    queryTypeNoData: string;
    queryCommercial: string;
    queryComparative: string;
    queryReputation: string;
    queryInformational: string;
    influenceSources: string;
    influenceSourcesSub: string;
    noInfluenceSources: string;
  };

  compare: {
    title: string;
    description: string;
    domainA: string;
    domainB: string;
    placeholder: string;
    runComparison: string;
    comparing: string;
    scanningBoth: string;
    scanProgress: string;
    waitingForResults: string;
    noData: string;
    noDataDesc: string;
    scoreComparison: string;
    metricsBreakdown: string;
    sovOverlap: string;
    visibilityScore: string;
    citationRate: string;
    avgPosition: string;
    sentiment: string;
    recommendations: string;
    winner: string;
    tie: string;
    vs: string;
    better: string;
    worse: string;
    advantageFor: string;
    strengthsWeaknesses: string;
    sharedCompetitors: string;
    uniqueTo: string;
    gapAnalysis: string;
    metricAdvantage: string;
    strongerOn: string;
    weakerOn: string;
    keyInsights: string;
    existingScan: string;
    newScan: string;
    selectScan: string;
    searchHistory: string;
    scanDate: string;
    score: string;
    scanParams: string;
    noHistory: string;
    loadingHistory: string;
    loadingReport: string;
  };

  errors: {
    scanFailed: string;
    unexpected: string;
  };
}
