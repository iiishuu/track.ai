import type { Metrics, QueryResult, Sentiment } from "@/shared/types";

const WEIGHTS = {
  citationRate: 0.4,
  averagePosition: 0.3,
  sentiment: 0.2,
  sourcesDiversity: 0.1,
} as const;

const SENTIMENT_SCORES: Record<Sentiment, number> = {
  positive: 1,
  neutral: 0.5,
  negative: 0,
};

export function computeCitationRate(results: QueryResult[]): number {
  if (results.length === 0) return 0;
  // Only count results where the brand is genuinely present with real info
  const cited = results.filter((r) => r.isPresent && r.isSubstantive !== false).length;
  return cited / results.length;
}

export function computeAveragePosition(
  results: QueryResult[]
): number | null {
  const ranked = results.filter(
    (r) => r.isPresent && r.rank !== null
  ) as (QueryResult & { rank: number })[];

  if (ranked.length === 0) return null;

  const sum = ranked.reduce((acc, r) => acc + r.rank, 0);
  return sum / ranked.length;
}

export function computeSentimentScore(results: QueryResult[]): number {
  const cited = results.filter((r) => r.isPresent);
  if (cited.length === 0) return 0.5;

  const sum = cited.reduce(
    (acc, r) => acc + SENTIMENT_SCORES[r.sentiment],
    0
  );
  return sum / cited.length;
}

export function computeOverallSentiment(results: QueryResult[]): Sentiment {
  const score = computeSentimentScore(results);
  if (score >= 0.7) return "positive";
  if (score >= 0.4) return "neutral";
  return "negative";
}

export function computePositionScore(
  averagePosition: number | null
): number {
  if (averagePosition === null) return 0;
  return Math.max(0, 1 - (averagePosition - 1) / 9);
}

export function computeSourcesDiversityScore(
  results: QueryResult[]
): number {
  const allSources = results.flatMap((r) => r.sources);
  const uniqueSources = new Set(allSources);
  if (allSources.length === 0) return 0;
  return Math.min(1, uniqueSources.size / Math.max(allSources.length, 1));
}

export function computeShareOfVoice(
  results: QueryResult[],
  domain: string
): Record<string, number> {
  const mentions: Record<string, number> = {};

  for (const result of results) {
    if (result.isPresent) {
      mentions[domain] = (mentions[domain] || 0) + 1;
    }
    for (const competitor of result.competitors) {
      const key = competitor.toLowerCase();
      mentions[key] = (mentions[key] || 0) + 1;
    }
  }

  const total = Object.values(mentions).reduce((a, b) => a + b, 0);
  if (total === 0) return {};

  const shareOfVoice: Record<string, number> = {};
  for (const [name, count] of Object.entries(mentions)) {
    shareOfVoice[name] = Math.round((count / total) * 100);
  }

  return shareOfVoice;
}

export function collectInfluenceSources(results: QueryResult[]): string[] {
  const sourceCounts: Record<string, number> = {};

  for (const result of results) {
    for (const source of result.sources) {
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    }
  }

  return Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([source]) => source);
}

export function computeVisibilityScore(results: QueryResult[]): number {
  if (results.length === 0) return 0;

  const citationRate = computeCitationRate(results);
  const averagePosition = computeAveragePosition(results);
  const sentimentScore = computeSentimentScore(results);
  const diversityScore = computeSourcesDiversityScore(results);

  let rawScore: number;

  if (averagePosition !== null) {
    // Normal case: all 4 factors contribute
    const positionScore = computePositionScore(averagePosition);
    rawScore =
      citationRate * WEIGHTS.citationRate +
      positionScore * WEIGHTS.averagePosition +
      sentimentScore * WEIGHTS.sentiment +
      diversityScore * WEIGHTS.sourcesDiversity;
  } else {
    // No ranking data: give a neutral position score (0.3) instead of
    // redistributing weight, which was too generous for unknown brands
    const neutralPositionScore = 0.3;
    rawScore =
      citationRate * WEIGHTS.citationRate +
      neutralPositionScore * WEIGHTS.averagePosition +
      sentimentScore * WEIGHTS.sentiment +
      diversityScore * WEIGHTS.sourcesDiversity;
  }

  return Math.round(rawScore * 100);
}

export function computeMetrics(
  results: QueryResult[],
  domain: string
): Metrics {
  return {
    visibilityScore: computeVisibilityScore(results),
    citationRate: computeCitationRate(results),
    averagePosition: computeAveragePosition(results),
    overallSentiment: computeOverallSentiment(results),
    shareOfVoice: computeShareOfVoice(results, domain),
    influenceSources: collectInfluenceSources(results),
  };
}
