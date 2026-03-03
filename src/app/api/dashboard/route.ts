import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/backend/lib/supabase/client";
import type { Recommendation, QueryResult } from "@/shared/types";

export interface DashboardPoint {
  reportId: string;
  scanId: string;
  date: string;
  score: number;
  citationRate: number;
  averagePosition: number | null;
  sentiment: "positive" | "neutral" | "negative";
  shareOfVoice: Record<string, number>;
}

/** Per-query-type performance breakdown */
export interface QueryTypePerformance {
  type: string;
  queriesCount: number;
  presenceRate: number;   // 0-100
  avgPosition: number | null;
  positiveRate: number;   // 0-100
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "domain is required" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("reports")
      .select("id, scan_id, domain, sector, score, metrics, recommendations, query_results, created_at")
      .ilike("domain", domain.toLowerCase().trim())
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      console.error("Dashboard fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          domain,
          sector: "",
          points: [],
          latestRecommendations: [],
          topCompetitors: [],
          queryTypeBreakdown: [],
          influenceSources: [],
        } satisfies DashboardData
      );
    }

    // Build time-series points
    const points: DashboardPoint[] = data.map((row) => ({
      reportId: row.id,
      scanId: row.scan_id,
      date: row.created_at,
      score: Math.round(row.score ?? 0),
      citationRate: row.metrics?.citationRate ?? 0,
      averagePosition: row.metrics?.averagePosition ?? null,
      sentiment: row.metrics?.overallSentiment ?? "neutral",
      shareOfVoice: row.metrics?.shareOfVoice ?? {},
    }));

    // Derive top competitors sorted by avg SOV across all scans
    const competitorTotals: Record<string, number> = {};
    const competitorCounts: Record<string, number> = {};
    for (const point of points) {
      for (const [name, sov] of Object.entries(point.shareOfVoice)) {
        if (!name.toLowerCase().includes(domain.toLowerCase().split(".")[0])) {
          competitorTotals[name] = (competitorTotals[name] ?? 0) + sov;
          competitorCounts[name] = (competitorCounts[name] ?? 0) + 1;
        }
      }
    }

    const topCompetitors = Object.entries(competitorTotals)
      .map(([name, total]) => ({
        name,
        avg: total / (competitorCounts[name] ?? 1),
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5)
      .map((c) => c.name);

    // Latest report data
    const latest = data[data.length - 1];
    const latestRecommendations: Recommendation[] = (latest?.recommendations ?? []).slice(0, 5);

    // ── Query type performance breakdown (from latest report) ──
    const queryResults: QueryResult[] = latest?.query_results ?? [];
    const typeMap: Record<string, QueryResult[]> = {};
    for (const q of queryResults) {
      // Infer query type from query text keywords
      const qLower = q.query.toLowerCase();
      let type = "informational";
      if (qLower.includes("best") || qLower.includes("buy") || qLower.includes("recommend") || qLower.includes("top")) {
        type = "commercial";
      } else if (qLower.includes("vs") || qLower.includes("alternative") || qLower.includes("compar")) {
        type = "comparative";
      } else if (qLower.includes("review") || qLower.includes("reliable") || qLower.includes("trust") || qLower.includes("reputation")) {
        type = "reputation";
      }
      if (!typeMap[type]) typeMap[type] = [];
      typeMap[type].push(q);
    }

    const queryTypeBreakdown: QueryTypePerformance[] = Object.entries(typeMap).map(
      ([type, queries]) => {
        const present = queries.filter((q) => q.isPresent);
        const withRank = queries.filter((q) => q.rank != null && q.rank > 0);
        const positive = queries.filter((q) => q.sentiment === "positive");
        return {
          type,
          queriesCount: queries.length,
          presenceRate: Math.round((present.length / queries.length) * 100),
          avgPosition:
            withRank.length > 0
              ? Math.round(
                  (withRank.reduce((s, q) => s + (q.rank ?? 0), 0) / withRank.length) * 10
                ) / 10
              : null,
          positiveRate: Math.round((positive.length / queries.length) * 100),
        };
      }
    );

    // ── Influence sources (aggregate across all reports) ──
    const sourceCounts: Record<string, number> = {};
    for (const row of data) {
      const sources: string[] = row.metrics?.influenceSources ?? [];
      for (const src of sources) {
        sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
      }
      // Also aggregate from query_results sources
      const qResults: QueryResult[] = row.query_results ?? [];
      for (const q of qResults) {
        for (const src of q.sources ?? []) {
          sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
        }
      }
    }

    const influenceSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([src]) => src);

    return NextResponse.json({
      domain,
      sector: latest?.sector ?? "",
      points,
      latestRecommendations,
      topCompetitors,
      queryTypeBreakdown,
      influenceSources,
    } satisfies DashboardData);
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
