import type { Recommendation, Sentiment } from "@/shared/types";

export interface DashboardPoint {
  reportId: string;
  scanId: string;
  date: string;
  score: number;
  citationRate: number;
  averagePosition: number | null;
  sentiment: Sentiment;
  shareOfVoice: Record<string, number>;
}

export interface QueryTypePerformance {
  type: string;
  queriesCount: number;
  presenceRate: number;
  avgPosition: number | null;
  positiveRate: number;
}

export interface DashboardData {
  domain: string;
  sector: string;
  points: DashboardPoint[];
  latestRecommendations: Recommendation[];
  topCompetitors: string[];
  queryTypeBreakdown: QueryTypePerformance[];
  influenceSources: string[];
}
