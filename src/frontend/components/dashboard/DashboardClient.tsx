"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw, ArrowRight, Search, ChevronDown } from "lucide-react";
import { KPICard } from "./KPICard";
import { VisibilityChart } from "./VisibilityChart";
import { CompetitorSOVChart, CompetitorTrendChart } from "./CompetitorChart";
import { RecommendationsPanel } from "./RecommendationsPanel";
import { ScanHistoryTable } from "./ScanHistoryTable";
import { InlineScanProgress } from "./InlineScanProgress";
import { QueryTypeBreakdown } from "./QueryTypeBreakdown";
import { InfluenceSources } from "./InfluenceSources";
import type { DashboardData, DashboardPoint } from "./types";
import { useScanWithProgress, type ScanParams } from "@/frontend/hooks/useScanWithProgress";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";

// ── helpers ──────────────────────────────────────────────────────────────────

function calcTrend(curr: number | null, prev: number | null): number | null {
  if (curr == null || prev == null) return null;
  return Math.round((curr - prev) * 10) / 10;
}

function getLatestTwo(points: DashboardPoint[]): [DashboardPoint | null, DashboardPoint | null] {
  if (points.length === 0) return [null, null];
  const sorted = [...points].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return [sorted[0], sorted[1] ?? null];
}

interface Averages {
  score: number;
  citationRate: number;
  position: number | null;
  sentiment: string;
}

function computeAverages(points: DashboardPoint[]): Averages | null {
  if (points.length === 0) return null;
  const n = points.length;
  const avgScore = Math.round(points.reduce((s, p) => s + p.score, 0) / n);
  const avgCitation = Math.round(
    (points.reduce((s, p) => s + p.citationRate, 0) / n) * 100
  );
  const withPos = points.filter((p) => p.averagePosition != null);
  const avgPos =
    withPos.length > 0
      ? Math.round(
          (withPos.reduce((s, p) => s + (p.averagePosition ?? 0), 0) /
            withPos.length) *
            10
        ) / 10
      : null;
  // Majority vote for sentiment
  const counts: Record<string, number> = {};
  for (const p of points) {
    counts[p.sentiment] = (counts[p.sentiment] ?? 0) + 1;
  }
  const sentiment = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return { score: avgScore, citationRate: avgCitation, position: avgPos, sentiment };
}

function sentimentLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sentimentAccent(s: string) {
  if (s === "positive") return "text-emerald-600";
  if (s === "negative") return "text-red-500";
  return "text-gray-500";
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({
  domain,
  onScan,
  t,
}: {
  domain: string;
  onScan: () => void;
  t: ReturnType<typeof useDictionary>["t"];
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">
        {t.dashboard.noScansTitle} <span className="font-bold">{domain}</span>
      </h3>
      <p className="mt-2 text-sm text-gray-500">{t.dashboard.noScansDesc}</p>
      <button
        onClick={onScan}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
      >
        {t.dashboard.launchAnalysis}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Domain input bar ──────────────────────────────────────────────────────────

function DomainBar({
  domain,
  suggestions,
  onDomainChange,
  isScanning,
  onScan,
  t,
}: {
  domain: string;
  suggestions: string[];
  onDomainChange: (d: string) => void;
  isScanning: boolean;
  onScan: () => void;
  t: ReturnType<typeof useDictionary>["t"];
}) {
  const [input, setInput] = useState(domain);
  const [open, setOpen] = useState(false);
  const picking = useRef(false);
  const prevDomain = useRef(domain);

  if (prevDomain.current !== domain) {
    prevDomain.current = domain;
    setInput(domain);
  }

  // Show all suggestions when input is empty / matches current, otherwise filter
  const filtered = open
    ? suggestions.filter(
        (s) =>
          s !== domain &&
          (input === domain || s.toLowerCase().includes(input.toLowerCase()))
      )
    : [];

  function select(d: string) {
    picking.current = true;
    setInput(d);
    setOpen(false);
    onDomainChange(d);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = input.trim();
    if (v && v !== domain) select(v);
    setOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOpen(true);
            }}
            onBlur={() => {
              // Delay to allow onMouseDown on suggestions to fire first
              setTimeout(() => {
                if (!picking.current) setOpen(false);
                picking.current = false;
              }, 200);
            }}
            onFocus={() => setOpen(true)}
            className="w-44 bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
            placeholder="example.com"
          />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute left-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur
                  select(s);
                }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Submit typed domain */}
      {input.trim() && input.trim() !== domain && (
        <button
          type="button"
          onClick={() => select(input.trim())}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Search className="h-3.5 w-3.5" />
          {t.dashboard.viewFullReport.split(" ")[0]}
        </button>
      )}

      {/* New scan button */}
      <button
        onClick={onScan}
        disabled={isScanning || !domain}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin" : ""}`} />
        {isScanning ? t.dashboard.analyzing : t.dashboard.newAnalysis}
      </button>
    </div>
  );
}

// ── Main DashboardClient ──────────────────────────────────────────────────────

export function DashboardClient({ initialDomain }: { initialDomain?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useDictionary();

  const [domain, setDomain] = useState(initialDomain ?? searchParams.get("domain") ?? "");
  const [data, setData] = useState<DashboardData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [scanParams, setScanParams] = useState<ScanParams | null>(null);
  const refreshTriggered = useRef(false);

  // hook for inline progress
  const { steps, isComplete, error: scanError, reportId } = useScanWithProgress(scanParams);

  // Load recent domains for suggestions
  useEffect(() => {
    fetch("/api/history?limit=20")
      .then((r) => r.json())
      .then((history: Array<{ domain: string }>) => {
        const unique = [...new Set(history.map((h) => h.domain))].slice(0, 10);
        setSuggestions(unique);
        // If no domain yet, default to most recent
        if (!domain && unique.length > 0) {
          setDomain(unique[0]);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch dashboard data whenever domain changes
  const fetchData = useCallback(async (d: string) => {
    if (!d) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?domain=${encodeURIComponent(d)}`);
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (domain) fetchData(domain);
  }, [domain, fetchData]);

  // When domain changes, update URL
  function handleDomainChange(d: string) {
    setDomain(d);
    router.replace(`/dashboard?domain=${encodeURIComponent(d)}`, { scroll: false });
  }

  // Trigger new scan
  function handleNewScan() {
    if (!domain) return;
    refreshTriggered.current = false;
    setScanParams({
      domain,
      engine: "perplexity",
      depth: "standard",
      types: "commercial,comparative,reputation,informational",
    });
    setShowProgress(true);
  }

  // When scan completes — refresh data
  useEffect(() => {
    if (isComplete && reportId && !refreshTriggered.current) {
      refreshTriggered.current = true;
      // Add new domain to suggestions
      setSuggestions((prev) =>
        prev.includes(domain) ? prev : [domain, ...prev]
      );
      // Refresh dashboard data after short delay
      setTimeout(() => fetchData(domain), 1200);
    }
  }, [isComplete, reportId, domain, fetchData]);

  function dismissProgress() {
    setShowProgress(false);
    setScanParams(null);
  }

  // ── Derived KPI data ──
  const [latest, prev] = data ? getLatestTwo(data.points) : [null, null];
  const avg = data ? computeAverages(data.points) : null;
  const n = data?.points.length ?? 0;

  const scoreT = calcTrend(latest?.score ?? null, prev?.score ?? null);
  const citationT = calcTrend(
    latest != null ? Math.round(latest.citationRate * 100) : null,
    prev != null ? Math.round(prev.citationRate * 100) : null
  );
  const positionT = calcTrend(latest?.averagePosition ?? null, prev?.averagePosition ?? null);

  const avgLabel = (v: string) =>
    n > 1 ? `${t.dashboard.avgAcross} ${n} scans: ${v}` : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* ── Top bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t.dashboard.title}</h1>
          {data?.sector && (
            <p className="mt-0.5 text-sm text-gray-500">
              {t.dashboard.sectorLabel}:{" "}
              <span className="font-medium text-gray-700">{data.sector}</span>
              {data.points.length > 0 && (
                <span className="ml-2 text-gray-400">
                  · {data.points.length} {t.dashboard.scansCount}
                  {data.points.length > 1 ? "s" : ""}
                </span>
              )}
            </p>
          )}
        </div>
        <DomainBar
          key={domain}
          domain={domain}
          suggestions={suggestions}
          onDomainChange={handleDomainChange}
          isScanning={showProgress && !isComplete && !scanError}
          onScan={handleNewScan}
          t={t}
        />
      </div>

      {/* ── Inline scan progress ── */}
      {showProgress && (
        <InlineScanProgress
          domain={domain}
          steps={steps}
          isComplete={isComplete}
          error={scanError}
          onDismiss={dismissProgress}
        />
      )}

      {/* ── Loading skeleton ── */}
      {loading && !data && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-gray-100 bg-gray-50"
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && data && data.points.length === 0 && domain && (
        <EmptyState domain={domain} onScan={handleNewScan} t={t} />
      )}

      {/* ── Dashboard content ── */}
      {!loading && data && data.points.length > 0 && latest && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard
              label={t.dashboard.visibilityScore}
              value={`${latest.score}/100`}
              sub={avgLabel(avg ? `${avg.score}/100` : "")}
              trend={scoreT != null ? scoreT : undefined}
              trendLabel={scoreT != null ? `${scoreT > 0 ? "+" : ""}${scoreT} pts` : undefined}
              firstScanLabel={t.dashboard.firstScan}
            />
            <KPICard
              label={t.dashboard.citationRate}
              value={`${Math.round(latest.citationRate * 100)}%`}
              sub={avgLabel(avg ? `${avg.citationRate}%` : "") ?? t.dashboard.citationRateSub}
              trend={citationT != null ? citationT : undefined}
              trendLabel={citationT != null ? `${citationT > 0 ? "+" : ""}${citationT}%` : undefined}
              firstScanLabel={t.dashboard.firstScan}
            />
            <KPICard
              label={t.dashboard.avgPosition}
              value={
                latest.averagePosition != null
                  ? `#${latest.averagePosition.toFixed(1)}`
                  : "—"
              }
              sub={avgLabel(avg?.position != null ? `#${avg.position}` : "—") ?? t.dashboard.avgPositionSub}
              trend={positionT != null ? positionT : undefined}
              trendLabel={
                positionT != null ? `${positionT > 0 ? "+" : ""}${positionT}` : undefined
              }
              invertTrend
              firstScanLabel={t.dashboard.firstScan}
            />
            <KPICard
              label={t.dashboard.sentiment}
              value={sentimentLabel(latest.sentiment)}
              sub={avg && n > 1 ? `${t.dashboard.avgAcross} ${n} scans: ${sentimentLabel(avg.sentiment)}` : undefined}
              accent={sentimentAccent(latest.sentiment)}
              trend={undefined}
              firstScanLabel={t.dashboard.firstScan}
            />
          </div>

          {/* Main chart + competitor SOV */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.dashboard.visibilityOverTime}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {t.dashboard.visibilityChartLegend}
                  </p>
                </div>
                <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-500">
                  {data.points.length} {t.dashboard.scansCount}
                  {data.points.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="h-56">
                <VisibilityChart points={data.points} />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                {t.dashboard.shareOfVoice}
              </p>
              <p className="mb-4 text-xs text-gray-400">{t.dashboard.sovSub}</p>
              <div className="h-52">
                <CompetitorSOVChart
                  latestPoint={latest}
                  domain={domain}
                  noDataLabel={t.dashboard.noCompetitorData}
                />
              </div>
            </div>
          </div>

          {/* Competitor trend + recommendations */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                {t.dashboard.competitorEvolution}
              </p>
              <p className="mb-4 text-xs text-gray-400">
                {t.dashboard.competitorEvolutionSub}
              </p>
              <div className="h-56">
                <CompetitorTrendChart
                  points={data.points}
                  topCompetitors={data.topCompetitors}
                  domain={domain}
                  needMoreScansLabel={t.dashboard.needMoreScans}
                  needMoreScansSub={t.dashboard.needMoreScansSub}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  {t.dashboard.recommendations}
                </p>
                <span className="text-xs text-gray-400">
                  {t.dashboard.recommendationsFrom}
                </span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
                <RecommendationsPanel
                  recommendations={data.latestRecommendations}
                  sector={data.sector}
                  priorityLabels={{
                    high: t.dashboard.priorityHigh,
                    medium: t.dashboard.priorityMedium,
                    low: t.dashboard.priorityLow,
                  }}
                  noRecommendationsLabel={t.dashboard.noRecommendations}
                  sectorLabel={t.dashboard.sectorLabel}
                />
              </div>
            </div>
          </div>

          {/* Query type breakdown + Influence sources */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                {t.dashboard.queryTypeBreakdown}
              </p>
              <p className="mb-4 text-xs text-gray-400">
                {t.dashboard.queryTypeBreakdownSub}
              </p>
              <QueryTypeBreakdown
                breakdown={data.queryTypeBreakdown ?? []}
                noDataLabel={t.dashboard.queryTypeNoData}
                labels={{
                  commercial: t.dashboard.queryCommercial,
                  comparative: t.dashboard.queryComparative,
                  reputation: t.dashboard.queryReputation,
                  informational: t.dashboard.queryInformational,
                }}
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-1 text-sm font-semibold text-gray-900">
                {t.dashboard.influenceSources}
              </p>
              <p className="mb-4 text-xs text-gray-400">
                {t.dashboard.influenceSourcesSub}
              </p>
              <InfluenceSources
                sources={data.influenceSources ?? []}
                noDataLabel={t.dashboard.noInfluenceSources}
              />
            </div>
          </div>

          {/* Scan history table */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">
              {t.dashboard.scanHistory}
            </p>
            <ScanHistoryTable
              points={data.points}
              labels={{
                date: t.dashboard.date,
                score: t.dashboard.score,
                citationRate: t.dashboard.citationRate,
                avgPosition: t.dashboard.avgPositionHeader,
                sentiment: t.dashboard.sentimentHeader,
                latest: t.dashboard.latest,
                report: t.dashboard.report,
                noScans: t.dashboard.noScansRecorded,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
