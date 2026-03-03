import { Card, CardContent } from "@/frontend/components/ui/card";
import type { QueryResult } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/types";

interface SourceAnalysisProps {
  queryResults: QueryResult[];
  influenceSources: string[];
  t: Dictionary;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SourceAnalysis({
  queryResults,
  t,
}: SourceAnalysisProps) {
  // Aggregate all sources across queries and group by domain
  const domainCounts = new Map<string, number>();
  for (const qr of queryResults) {
    for (const source of qr.sources) {
      const domain = extractDomain(source);
      domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    }
  }

  const sortedDomains = [...domainCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  const totalSources = queryResults.reduce(
    (sum, qr) => sum + qr.sources.length,
    0
  );
  const uniqueDomains = domainCounts.size;

  if (sortedDomains.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          {t.report.noInfluenceSources}
        </CardContent>
      </Card>
    );
  }

  const maxCount = sortedDomains[0][1];

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t.report.influenceSources}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t.report.influenceSourcesDesc}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold tabular-nums">{uniqueDomains}</p>
            <p className="text-xs text-muted-foreground">
              {totalSources} {t.report.sourcesCountDesc}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {sortedDomains.map(([domain, count], i) => {
            const barWidth = Math.max((count / maxCount) * 100, 5);
            return (
              <div key={domain} className="flex items-center gap-3">
                <span className="w-5 text-right text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{domain}</span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {count}x
                    </span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary/60 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
