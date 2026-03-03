import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import type { Metrics, QueryResult } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/types";

interface MetricsGridProps {
  metrics: Metrics;
  queryResults: QueryResult[];
  t: Dictionary;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function sentimentVariant(
  sentiment: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (sentiment) {
    case "positive":
      return "default";
    case "negative":
      return "destructive";
    default:
      return "secondary";
  }
}

function translateSentiment(sentiment: string, t: Dictionary): string {
  const key = sentiment as keyof typeof t.labels;
  return t.labels[key] ?? sentiment;
}

export function MetricsGrid({ metrics, queryResults, t }: MetricsGridProps) {
  const uniqueSources = new Set(queryResults.flatMap((qr) => qr.sources));

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {/* Citation Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t.metrics.citationRate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatPercent(metrics.citationRate)}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.metrics.citationRateDesc}
          </p>
        </CardContent>
      </Card>

      {/* Avg Position */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {t.metrics.avgPosition}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {metrics.averagePosition !== null
              ? `#${metrics.averagePosition.toFixed(1)}`
              : t.metrics.na}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.metrics.avgPositionDesc}
          </p>
        </CardContent>
      </Card>

      {/* Sentiment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {t.metrics.sentiment}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={sentimentVariant(metrics.overallSentiment)}>
            {translateSentiment(metrics.overallSentiment, t)}
          </Badge>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.metrics.sentimentDesc}
          </p>
        </CardContent>
      </Card>

      {/* Share of Voice (summary) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t.metrics.shareOfVoice}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {Object.keys(metrics.shareOfVoice).length}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.report.competitiveAnalysis.toLowerCase()}
          </p>
        </CardContent>
      </Card>

      {/* Queries Analyzed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t.report.queriesAnalyzed}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{queryResults.length}</p>
          <p className="text-xs text-muted-foreground">
            {t.report.queriesAnalyzedDesc}
          </p>
        </CardContent>
      </Card>

      {/* Sources Found */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {t.report.sourcesCount}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{uniqueSources.size}</p>
          <p className="text-xs text-muted-foreground">
            {t.report.sourcesCountDesc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
