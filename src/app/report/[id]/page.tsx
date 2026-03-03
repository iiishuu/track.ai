import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportHeader } from "@/frontend/components/report/ReportHeader";
import { ScoreCard } from "@/frontend/components/report/ScoreCard";
import { MetricsGrid } from "@/frontend/components/report/MetricsGrid";
import { CompetitiveAnalysis } from "@/frontend/components/report/CompetitiveAnalysis";
import { SourceAnalysis } from "@/frontend/components/report/SourceAnalysis";
import { SentimentChart } from "@/frontend/components/report/SentimentChart";
import { QueryResultCard } from "@/frontend/components/report/QueryResultCard";
import { RecommendationList } from "@/frontend/components/report/RecommendationList";
import { Separator } from "@/frontend/components/ui/separator";
import { BackButton } from "@/frontend/components/ui/BackButton";
import { getServerDictionary } from "@/shared/i18n/server";
import { getSupabaseAdmin } from "@/backend/lib/supabase/client";
import type { Report } from "@/shared/types";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

async function getReport(id: string): Promise<Report | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !report) return null;

    return {
      id: report.id,
      scanId: report.scan_id,
      domain: report.domain,
      sector: report.sector,
      metrics: report.metrics,
      queryResults: report.query_results,
      recommendations: report.recommendations,
      createdAt: report.created_at,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const [report, t] = await Promise.all([getReport(id), getServerDictionary()]);
  if (!report) {
    return { title: t.meta.reportNotFound };
  }
  return {
    title: t.meta.reportTitle.replace("{domain}", report.domain),
    description: t.meta.reportDescription
      .replace("{score}", String(Math.round(report.metrics.visibilityScore)))
      .replace("{domain}", report.domain)
      .replace("{sector}", report.sector),
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const [report, t] = await Promise.all([getReport(id), getServerDictionary()]);

  if (!report) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Back button */}
      <BackButton label={t.dashboard.goBack} />

      {/* Header */}
      <ReportHeader
        domain={report.domain}
        sector={report.sector}
        createdAt={report.createdAt}
        reportId={report.id}
        t={t}
      />

      {/* Score */}
      <section>
        <ScoreCard score={report.metrics.visibilityScore} t={t} />
      </section>

      {/* Metrics */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">{t.report.metrics}</h2>
        <MetricsGrid
          metrics={report.metrics}
          queryResults={report.queryResults}
          t={t}
        />
      </section>

      <Separator />

      {/* Competitive Analysis */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {t.report.competitiveAnalysis}
        </h2>
        <CompetitiveAnalysis
          shareOfVoice={report.metrics.shareOfVoice}
          domain={report.domain}
          t={t}
        />
      </section>

      {/* Sentiment Distribution */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {t.metrics.sentiment}
        </h2>
        <SentimentChart queryResults={report.queryResults} t={t} />
      </section>

      {/* Source Analysis */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {t.report.sourceAnalysis}
        </h2>
        <SourceAnalysis
          queryResults={report.queryResults}
          influenceSources={report.metrics.influenceSources}
          t={t}
        />
      </section>

      <Separator />

      {/* AI Responses */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {t.report.aiResponses} ({report.queryResults.length})
        </h2>
        <div className="space-y-3">
          {report.queryResults.map((result, index) => (
            <QueryResultCard key={index} result={result} index={index} t={t} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Recommendations */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          {t.report.recommendations}
        </h2>
        <RecommendationList recommendations={report.recommendations} t={t} />
      </section>
    </main>
  );
}
