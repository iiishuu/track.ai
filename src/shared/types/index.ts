// --- Common ---
export type Sentiment = "positive" | "neutral" | "negative";

// --- Scan ---
export type ScanStatus = "pending" | "running" | "completed" | "failed";

export interface Scan {
  id: string;
  domain: string;
  status: ScanStatus;
  createdAt: string;
}

export interface ScanStep {
  label: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
}

export interface DiscoveryResult {
  sector: string;
  competitors: string[];
  queries: string[];
}

// --- AI Provider ---
export interface AIQueryRequest {
  query: string;
  domain: string;
}

export interface AIQueryResponse {
  content: string;
  sources: string[];
  provider: string;
}

export interface AIProvider {
  name: string;
  query(request: AIQueryRequest): Promise<AIQueryResponse>;
}

// --- Report ---
export interface QueryResult {
  query: string;
  response: string;
  isPresent: boolean;
  rank: number | null;
  sentiment: Sentiment;
  competitors: string[];
  sources: string[];
  context: string;
}

export interface Metrics {
  visibilityScore: number;
  citationRate: number;
  averagePosition: number | null;
  overallSentiment: Sentiment;
  shareOfVoice: Record<string, number>;
  influenceSources: string[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface Report {
  id: string;
  scanId: string;
  domain: string;
  sector: string;
  metrics: Metrics;
  queryResults: QueryResult[];
  recommendations: Recommendation[];
  createdAt: string;
}

// --- History ---
export interface HistoryEntry {
  scanId: string;
  reportId: string;
  domain: string;
  score: number;
  createdAt: string;
}
