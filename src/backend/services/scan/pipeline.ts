import type { AIProvider, QueryResult, Report } from "@/shared/types";
import type { Locale, QueryType, ScanDepth } from "@/shared/i18n/types";
import { getSupabaseAdmin } from "@/backend/lib/supabase/client";
import { validateAndSanitizeDomain } from "@/backend/validation/domain";
import { discoverDomain } from "./discovery";
import { analyzeResponse } from "./analysis";
import { computeMetrics } from "./scoringEngine";
import { generateRecommendations } from "./recommendations";
import { auditResults } from "./scoringAudit";

export interface ScanOptions {
  depth: ScanDepth;
  queryTypes: QueryType[];
}

const DEPTH_QUERY_COUNT: Record<ScanDepth, number> = {
  quick: 5,
  standard: 10,
  deep: 20,
};

export interface PipelineResult {
  scanId: string;
  reportId: string;
  report: Report;
}

export async function runScanPipeline(
  rawDomain: string,
  provider: AIProvider,
  locale: Locale = "en",
  options: ScanOptions = {
    depth: "standard",
    queryTypes: ["commercial", "comparative", "reputation", "informational"],
  }
): Promise<PipelineResult> {
  const supabase = getSupabaseAdmin();
  const queryCount = DEPTH_QUERY_COUNT[options.depth];

  // 1. Validate domain
  const validation = validateAndSanitizeDomain(rawDomain);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  const domain = validation.domain;

  // 2. Create scan in DB (status: running)
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({ domain, status: "running" })
    .select("id")
    .single();

  if (scanError || !scan) {
    throw new Error(`Failed to create scan: ${scanError?.message}`);
  }

  const scanId = scan.id;

  try {
    // 3. Discovery — sector + competitors + queries (with depth and query types)
    const discovery = await discoverDomain(
      domain,
      provider,
      locale,
      queryCount,
      options.queryTypes
    );

    // 4. Execute each query via AI provider
    // 5. Analyze each response (batched for speed)
    const BATCH_SIZE = 5;
    const queryResults: QueryResult[] = [];

    for (let i = 0; i < discovery.queries.length; i += BATCH_SIZE) {
      const batch = discovery.queries.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (query) => {
          const aiResponse = await provider.query({ query, domain });
          return analyzeResponse(
            domain,
            query,
            aiResponse.content,
            aiResponse.sources,
            provider,
            locale
          );
        })
      );
      queryResults.push(...batchResults);
    }

    // 6. Compute preliminary score + metrics
    const preliminaryMetrics = computeMetrics(queryResults, domain);

    // 7. AI Audit — review results for false positives, wrong sentiments, brand confusion
    const auditedResults = await auditResults(
      domain,
      discovery.sector,
      preliminaryMetrics.visibilityScore,
      queryResults,
      provider
    );

    // 8. Recompute metrics with audited results
    const metrics = computeMetrics(auditedResults, domain);

    // 9. Generate recommendations (with full context)
    const recommendations = await generateRecommendations(
      {
        domain,
        sector: discovery.sector,
        competitors: discovery.competitors,
        metrics,
        queryResults,
      },
      provider,
      locale
    );

    // 10. Save report in DB
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        scan_id: scanId,
        domain,
        sector: discovery.sector,
        score: metrics.visibilityScore,
        metrics,
        query_results: auditedResults,
        recommendations,
      })
      .select("id")
      .single();

    if (reportError || !report) {
      throw new Error(`Failed to save report: ${reportError?.message}`);
    }

    // 11. Update scan status to completed
    await supabase
      .from("scans")
      .update({ status: "completed" })
      .eq("id", scanId);

    return {
      scanId,
      reportId: report.id,
      report: {
        id: report.id,
        scanId,
        domain,
        sector: discovery.sector,
        metrics,
        queryResults: auditedResults,
        recommendations,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    // On failure, mark scan as failed
    await supabase
      .from("scans")
      .update({ status: "failed" })
      .eq("id", scanId);

    throw error;
  }
}
