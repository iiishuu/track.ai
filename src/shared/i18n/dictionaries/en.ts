import type { Dictionary } from "../types";

export const en: Dictionary = {
  meta: {
    siteTitle: "TrackAI — AI Visibility Tracker",
    siteDescription:
      "Track your brand visibility across AI search engines like ChatGPT, Gemini, and Perplexity.",
    scanTitle: "Scan Your Domain — TrackAI",
    scanDescription:
      "Analyze your brand visibility across AI search engines like ChatGPT, Gemini, and Perplexity.",
    historyTitle: "Scan History — TrackAI",
    historyDescription:
      "View your past AI visibility scans and track your brand performance over time.",
    reportNotFound: "Report Not Found — TrackAI",
    reportTitle: "{domain} — AI Visibility Report — TrackAI",
    reportDescription:
      "AI visibility score: {score}/100 for {domain} in {sector}.",
    loadingTitle: "Analyzing — TrackAI",
  },

  nav: {
    scan: "Scan",
    history: "History",
    dashboard: "Dashboard",
    compare: "Compare",
  },

  hero: {
    badge: "Real-time AI monitoring",
    titleBefore: "Know how AI talks",
    titleHighlight: "about your brand",
    titleAfter: "",
    description:
      "See exactly how ChatGPT, Gemini, and Perplexity mention your brand. TrackAI gives you a clear visibility score and concrete steps to improve.",
    descPrefix: "Monitor how AI engines reference your brand — with real-time tracking of",
    badgeVisibility: "Visibility",
    badgeRanking: "Ranking",
    badgeSentiment: "Sentiment",
    placeholder: "Enter your domain...",
    analyze: "Run Free Scan",
    ctaSubtext: "No credit card required · Instant results",
  },

  aiLogos: {
    title: "Monitor your brand on",
    engines: ["ChatGPT", "Perplexity", "Gemini", "Copilot", "Claude"],
  },

  howItWorks: {
    title: "How TrackAI Works",
    subtitle:
      "Three steps to uncover how AI search engines perceive your brand.",
    stepLabel: "Step",
    steps: [
      {
        icon: "Globe",
        title: "Enter Your Domain",
        description:
          "Provide your brand's domain and TrackAI launches targeted queries across major AI search engines.",
      },
      {
        icon: "Brain",
        title: "AI-Powered Analysis",
        description:
          "We send sector-specific prompts to each AI engine and parse every response for brand mentions, ranking, and sentiment.",
      },
      {
        icon: "BarChart3",
        title: "Get Actionable Insights",
        description:
          "Receive a visibility score out of 100, a competitive breakdown, and prioritized recommendations you can act on today.",
      },
    ],
  },

  features: {
    title: "Built for AI-Era SEO",
    subtitle:
      "The visibility metrics traditional SEO tools can't give you.",
    items: [
      {
        icon: "Search",
        title: "Multi-Engine Scanning",
        description:
          "Run targeted queries on ChatGPT, Gemini, and Perplexity in one scan — no manual prompt testing needed.",
      },
      {
        icon: "Target",
        title: "Brand Mention Detection",
        description:
          "Know exactly where your brand appears in AI responses: position, surrounding context, and whether the tone is positive or negative.",
      },
      {
        icon: "TrendingUp",
        title: "Visibility Score (0–100)",
        description:
          "A single number that captures your overall presence across AI search — track it over time to measure progress.",
      },
      {
        icon: "Users",
        title: "Competitor Benchmarking",
        description:
          "See which competitors AI engines mention alongside your brand and compare share of voice in your sector.",
      },
      {
        icon: "Lightbulb",
        title: "Prioritized Recommendations",
        description:
          "Get specific, sector-aware actions ranked by impact — from content gaps to structured data improvements.",
      },
      {
        icon: "LineChart",
        title: "Trend Tracking",
        description:
          "Run regular scans and watch your visibility evolve. Spot the impact of content changes or competitor moves.",
      },
    ],
  },

  stats: {
    title: "Platform at a Glance",
    subtitle: "Real-time AI visibility intelligence for modern brands.",
    items: [
      { value: 4, suffix: "", label: "Query categories" },
      { value: 3, suffix: "", label: "AI engines scanned" },
      { value: 100, suffix: "", label: "Visibility score range" },
      { value: 24, suffix: "/7", label: "Monitoring ready" },
    ],
  },

  finalCta: {
    title: "Start Tracking Your AI Visibility",
    description:
      "Enter your domain and get a full AI visibility report in under two minutes — score, competitors, and recommendations included.",
    placeholder: "Enter your domain...",
    analyze: "Start Free Scan",
    ctaSubtext: "No credit card required",
  },

  footer: {
    tagline: "TrackAI",
    description:
      "AI visibility intelligence — track how ChatGPT, Gemini, and Perplexity reference your brand and improve your presence.",
    product: "Product",
    productLinks: [
      { label: "AI Scan", href: "/scan" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Compare", href: "/compare" },
    ],
    resources: "Resources",
    resourceLinks: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "AI SEO Guide", href: "#" },
    ],
    legal: "Legal",
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
    copyright: "All rights reserved.",
  },

  scan: {
    title: "Analyze Your Domain",
    description:
      "Enter a domain to discover how AI search engines reference your brand.",
    placeholder: "example.com",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    whatWeAnalyze: "What We Analyze",
    infoCards: [
      {
        title: "AI Engine Queries",
        description:
          "We query leading AI engines like Perplexity, ChatGPT, and Gemini with strategic prompts related to your industry.",
      },
      {
        title: "Brand Presence Detection",
        description:
          "We detect if and where your brand appears in AI responses, tracking position, sentiment, and context.",
      },
      {
        title: "Actionable Report",
        description:
          "Get a complete visibility score, competitive analysis, and personalized recommendations to improve.",
      },
    ],
    aiEngine: "AI Engine",
    aiEngineDesc: "Select which AI engine to query",
    queryTypes: "Question Types",
    queryTypesDesc: "Choose what types of queries to run",
    depth: "Analysis Depth",
    depthDesc: "Number of strategic queries to run",
    commercial: "Commercial",
    commercialDesc: "Best products, where to buy, reviews",
    comparative: "Comparative",
    comparativeDesc: "Brand vs competitor, alternatives, top 5",
    reputation: "Reputation",
    reputationDesc: "Brand reviews, reliability, issues",
    informational: "Informational",
    informationalDesc: "How it works, guides, explanations",
    quick: "Quick",
    quickDesc: "5 queries",
    standard: "Standard",
    standardDesc: "10 queries",
    deep: "Deep",
    deepDesc: "20 queries",
  },

  scanSteps: {
    domainValidation: "Domain validation",
    sectorDiscovery: "Sector discovery",
    aiQueryAnalysis: "AI query analysis",
    scoreComputation: "Score computation",
    recommendations: "Recommendations",
  },

  loading: {
    title: "Analyzing {domain}",
    subtitle: "Our AI agents are examining your brand visibility",
    stepDescriptions: {
      domainValidation: "Checking domain validity and accessibility...",
      sectorDiscovery:
        "Identifying your industry sector and key competitors...",
      aiQueryAnalysis:
        "Querying AI engines with strategic prompts about your brand...",
      scoreComputation:
        "Computing your visibility score across all responses...",
      recommendations:
        "Generating personalized recommendations for your brand...",
    },
    complete: "Analysis complete!",
    redirecting: "Redirecting to your report...",
    error: "Something went wrong",
    tryAgain: "Try Again",
    facts: [
      "70% of users trust AI-generated recommendations when choosing a product.",
      "Brands mentioned in the first 3 positions in AI responses get 5x more visibility.",
      "AI search engines analyze over 100 data sources to form their responses.",
      "Your digital footprint across review sites directly impacts AI visibility.",
      "Structured data on your website helps AI engines better understand your brand.",
    ],
  },

  report: {
    visibilityScore: "AI Visibility Score",
    metrics: "Metrics",
    aiResponses: "AI Responses",
    recommendations: "Recommendations",
    position: "Position",
    scoreGood: "Good",
    scoreAverage: "Average",
    scoreLow: "Low",
    header: "AI Visibility Report",
    scanDate: "Scanned on {date}",
    downloadPdf: "Download PDF",
    competitiveAnalysis: "Competitive Analysis",
    shareOfVoiceChart: "Share of Voice Distribution",
    yourBrand: "Your Brand",
    sourceAnalysis: "Source Analysis",
    influenceSources: "Influence Sources",
    influenceSourcesDesc:
      "Top domains and sources cited in AI responses about your industry",
    queriesAnalyzed: "Queries Analyzed",
    queriesAnalyzedDesc: "strategic queries sent to AI engines",
    sourcesCount: "Sources Found",
    sourcesCountDesc: "unique sources referenced by AI",
    viewFullResponse: "View full response",
    hideFullResponse: "Hide full response",
    aiSources: "Sources",
    noSources: "No sources available",
    noInfluenceSources: "No influence sources detected",
    scoreContext: {
      good: "Your brand has strong visibility across AI search engines. AI assistants frequently mention and recommend your brand.",
      average:
        "Your brand has moderate visibility. There is room to improve how AI search engines reference your brand.",
      low: "Your brand has limited visibility in AI responses. Significant improvements are needed to increase AI presence.",
    },
  },

  metrics: {
    citationRate: "Citation Rate",
    citationRateDesc: "of AI responses mention you",
    avgPosition: "Avg. Position",
    avgPositionDesc: "when mentioned in results",
    sentiment: "Sentiment",
    sentimentDesc: "overall AI perception",
    shareOfVoice: "Share of Voice",
    noData: "No data",
    na: "N/A",
  },

  labels: {
    present: "Present",
    absent: "Absent",
    positive: "positive",
    neutral: "neutral",
    negative: "negative",
    high: "high",
    medium: "medium",
    low: "low",
  },

  history: {
    title: "Scan History",
    description: "View and compare your past AI visibility analyses.",
    filterPlaceholder: "Filter by domain...",
    loading: "Loading history...",
    empty: "No scans yet. Start by analyzing a domain.",
    errorFetch: "Failed to load history",
  },

  dashboard: {
    title: "AI Visibility Dashboard",
    sectorLabel: "Sector",
    scansCount: "scan",
    viewingScanFrom: "Viewing scan from",
    selectScan: "Select scan",
    viewFullReport: "View full report",
    noScansTitle: "No scans for",
    noScansDesc: "Run your first analysis to start tracking visibility.",
    launchAnalysis: "Launch analysis",
    newAnalysis: "New analysis",
    analyzing: "Analyzing…",
    visibilityScore: "Visibility Score",
    citationRate: "Citation Rate",
    citationRateSub: "of AI queries",
    avgPosition: "Avg. Position",
    avgPositionSub: "when mentioned",
    sentiment: "Sentiment",
    firstScan: "First scan",
    visibilityOverTime: "Visibility over time",
    visibilityChartLegend: "Score (solid) · Citation % (dashed)",
    shareOfVoice: "Share of Voice",
    sovSub: "Latest scan snapshot",
    competitorEvolution: "Competitor evolution",
    competitorEvolutionSub: "Share of Voice over all scans",
    needMoreScans: "Need 2+ scans",
    needMoreScansSub: "Run another analysis to see trends",
    recommendations: "Recommendations",
    recommendationsFrom: "From latest scan",
    scanHistory: "Scan history",
    noScansRecorded: "No scans recorded yet.",
    latest: "Latest",
    viewing: "Viewing",
    report: "Report",
    noData: "No data yet",
    noCompetitorData: "No competitor data",
    dashboardUpdated: "Dashboard updated with new data",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    noRecommendations: "No recommendations yet",
    date: "Date",
    score: "Score",
    avgPositionHeader: "Avg. Position",
    sentimentHeader: "Sentiment",
    goBack: "Back",
    avgAcross: "Avg. across",
    queryTypeBreakdown: "Query Type Performance",
    queryTypeBreakdownSub: "How your brand performs by query category",
    queryTypeNoData: "No query data available",
    queryCommercial: "Commercial",
    queryComparative: "Comparative",
    queryReputation: "Reputation",
    queryInformational: "Informational",
    influenceSources: "Influence Sources",
    influenceSourcesSub: "Top sources cited by AI engines about your brand",
    noInfluenceSources: "No influence sources detected",
  },

  compare: {
    title: "Domain Comparison",
    description: "Run live parallel scans and compare AI visibility side by side.",
    domainA: "Domain A",
    domainB: "Domain B",
    placeholder: "example.com",
    runComparison: "Compare",
    comparing: "Scanning…",
    scanningBoth: "Running parallel scans for both domains",
    scanProgress: "Scan progress",
    waitingForResults: "Building comparison…",
    noData: "No data available",
    noDataDesc: "Enter two domains above and run a comparison.",
    scoreComparison: "Score Comparison",
    metricsBreakdown: "Metrics Breakdown",
    sovOverlap: "Share of Voice Overlap",
    visibilityScore: "Visibility Score",
    citationRate: "Citation Rate",
    avgPosition: "Avg. Position",
    sentiment: "Sentiment",
    recommendations: "Key Recommendations",
    winner: "Leader",
    tie: "Tie",
    vs: "vs",
    better: "leads by",
    worse: "trails by",
    advantageFor: "Advantage",
    strengthsWeaknesses: "Strengths & Gaps",
    sharedCompetitors: "Shared Competitors",
    uniqueTo: "Unique to",
    gapAnalysis: "Gap Analysis",
    metricAdvantage: "Metric Advantage",
    strongerOn: "Stronger on",
    weakerOn: "Weaker on",
    keyInsights: "Key Insights",
    existingScan: "Existing scan",
    newScan: "New scan",
    selectScan: "Select a past scan",
    searchHistory: "Search by domain...",
    scanDate: "Date",
    score: "Score",
    scanParams: "Scan parameters",
    noHistory: "No matching scans found.",
    loadingHistory: "Loading history...",
    loadingReport: "Loading report...",
  },

  errors: {
    scanFailed: "Scan failed. Please try again later.",
    unexpected: "An unexpected error occurred",
  },
};
