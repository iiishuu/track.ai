"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeftRight,
  Trophy,
  Equal,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Zap,
  Shield,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { BackButton } from "@/frontend/components/ui/BackButton";
import {
  DomainSlot,
  DEFAULT_SLOT,
  slotToConfig,
  type SlotState,
  type SlotConfig,
} from "@/frontend/components/compare/DomainSlot";
import type { Report, Metrics, Recommendation } from "@/shared/types";
import type { QueryType, ScanDepth } from "@/shared/i18n/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface ScanState {
  status: "idle" | "scanning" | "done" | "error";
  progress: number; // 0-100
  stepLabel: string;
  reportId: string | null;
  report: Report | null;
  error: string | null;
}

const INITIAL_STATE: ScanState = {
  status: "idle",
  progress: 0,
  stepLabel: "",
  reportId: null,
  report: null,
  error: null,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const BRAND_A = "#111111";
const BRAND_B = "#6366f1";

const STEPS = [
  { key: "domainValidation", pct: 15 },
  { key: "sectorDiscovery", pct: 30 },
  { key: "aiQueryAnalysis", pct: 70 },
  { key: "scoreComputation", pct: 90 },
  { key: "recommendations", pct: 100 },
] as const;

function sentimentToNum(s: string): number {
  if (s === "positive") return 100;
  if (s === "neutral") return 50;
  return 0;
}

// ── DomainInputForm ──────────────────────────────────────────────────────────

function DomainInputForm({
  onCompare,
  loading,
}: {
  onCompare: (configA: SlotConfig, configB: SlotConfig) => void;
  loading: boolean;
}) {
  const { t } = useDictionary();
  const [slotA, setSlotA] = useState<SlotState>({ ...DEFAULT_SLOT });
  const [slotB, setSlotB] = useState<SlotState>({ ...DEFAULT_SLOT });

  function isValid(): boolean {
    return slotToConfig(slotA) !== null && slotToConfig(slotB) !== null;
  }

  function swap() {
    const temp = { ...slotA };
    setSlotA({ ...slotB });
    setSlotB(temp);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const configA = slotToConfig(slotA);
    const configB = slotToConfig(slotB);
    if (configA && configB) {
      onCompare(configA, configB);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row">
        <DomainSlot
          label={t.compare.domainA}
          config={slotA}
          onChange={(update) => setSlotA((prev) => ({ ...prev, ...update }))}
        />

        <button
          type="button"
          onClick={swap}
          className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 sm:mt-8"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <DomainSlot
          label={t.compare.domainB}
          config={slotB}
          onChange={(update) => setSlotB((prev) => ({ ...prev, ...update }))}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading || !isValid()}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t.compare.comparing : t.compare.runComparison}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

// ── DualProgress ─────────────────────────────────────────────────────────────

function DualProgress({
  stateA,
  stateB,
  domainA,
  domainB,
}: {
  stateA: ScanState;
  stateB: ScanState;
  domainA: string;
  domainB: string;
}) {
  const { t } = useDictionary();

  function renderBar(state: ScanState, domain: string, color: string) {
    const isDone = state.status === "done";
    const isError = state.status === "error";

    return (
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">{domain}</span>
          {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          {isError && <AlertCircle className="h-4 w-4 text-red-400" />}
          {!isDone && !isError && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${isDone ? 100 : state.progress}%`,
              backgroundColor: isError ? "#f87171" : color,
            }}
          />
        </div>
        <p className="text-xs text-gray-400">
          {isError
            ? state.error
            : isDone
              ? t.loading.complete
              : state.stepLabel || t.compare.scanProgress}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="mb-1 text-sm font-semibold text-gray-900">
        {t.compare.scanningBoth}
      </p>
      <p className="mb-5 text-xs text-gray-400">
        {stateA.status === "done" && stateB.status === "done"
          ? t.compare.waitingForResults
          : t.compare.scanProgress}
      </p>
      <div className="flex gap-6">
        {renderBar(stateA, domainA, BRAND_A)}
        {renderBar(stateB, domainB, BRAND_B)}
      </div>
    </div>
  );
}

// ── MetricRow ────────────────────────────────────────────────────────────────

function MetricRow({
  label,
  icon,
  valueA,
  valueB,
  format,
  invertBetter,
}: {
  label: string;
  icon: React.ReactNode;
  valueA: number | null;
  valueB: number | null;
  format?: (v: number | null) => string;
  invertBetter?: boolean;
}) {
  const fmt = format ?? ((v: number | null) => (v != null ? `${v}` : "—"));
  const a = valueA ?? 0;
  const b = valueB ?? 0;
  const diff = a - b;
  const aWins = invertBetter ? diff < 0 : diff > 0;
  const bWins = invertBetter ? diff > 0 : diff < 0;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-gray-100 py-3.5 last:border-b-0">
      <div className="text-right">
        <span
          className={`text-lg font-bold ${aWins ? "text-gray-900" : "text-gray-400"}`}
        >
          {fmt(valueA)}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </span>
        </div>
        {diff !== 0 && (
          <div className="flex items-center gap-0.5 text-[10px]">
            {aWins ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : bWins ? (
              <TrendingDown className="h-3 w-3 text-red-400" />
            ) : (
              <Minus className="h-3 w-3 text-gray-300" />
            )}
            <span className={aWins ? "text-emerald-600" : "text-red-400"}>
              {Math.abs(diff).toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div>
        <span
          className={`text-lg font-bold ${bWins ? "text-indigo-600" : "text-gray-400"}`}
        >
          {fmt(valueB)}
        </span>
      </div>
    </div>
  );
}

// ── RadarComparison ──────────────────────────────────────────────────────────

function RadarComparison({
  metricsA,
  metricsB,
  domainA,
  domainB,
}: {
  metricsA: Metrics;
  metricsB: Metrics;
  domainA: string;
  domainB: string;
}) {
  const data = [
    {
      metric: "Score",
      A: metricsA.visibilityScore,
      B: metricsB.visibilityScore,
    },
    {
      metric: "Citation",
      A: Math.round(metricsA.citationRate * 100),
      B: Math.round(metricsB.citationRate * 100),
    },
    {
      metric: "Position",
      A:
        metricsA.averagePosition != null
          ? Math.max(0, 100 - metricsA.averagePosition * 10)
          : 0,
      B:
        metricsB.averagePosition != null
          ? Math.max(0, 100 - metricsB.averagePosition * 10)
          : 0,
    },
    {
      metric: "Sentiment",
      A: sentimentToNum(metricsA.overallSentiment),
      B: sentimentToNum(metricsB.overallSentiment),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11, fill: "#6b7280" }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name={domainA}
          dataKey="A"
          stroke={BRAND_A}
          fill={BRAND_A}
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name={domainB}
          dataKey="B"
          stroke={BRAND_B}
          fill={BRAND_B}
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ── SOV Overlap Chart ────────────────────────────────────────────────────────

function SOVOverlapChart({
  metricsA,
  metricsB,
  domainA,
  domainB,
}: {
  metricsA: Metrics;
  metricsB: Metrics;
  domainA: string;
  domainB: string;
}) {
  const allPlayers = new Set([
    ...Object.keys(metricsA.shareOfVoice),
    ...Object.keys(metricsB.shareOfVoice),
  ]);

  const data = [...allPlayers]
    .map((player) => ({
      name: player.length > 12 ? player.slice(0, 10) + "…" : player,
      [domainA]: Math.round(metricsA.shareOfVoice[player] ?? 0),
      [domainB]: Math.round(metricsB.shareOfVoice[player] ?? 0),
    }))
    .sort((a, b) => {
      const totalA = (a[domainA] as number) + (a[domainB] as number);
      const totalB = (b[domainA] as number) + (b[domainB] as number);
      return totalB - totalA;
    })
    .slice(0, 8);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f3f4f6"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            fontSize: 11,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
          formatter={(v: number | undefined) => [`${v ?? 0}%`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey={domainA}
          fill={BRAND_A}
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
        <Bar
          dataKey={domainB}
          fill={BRAND_B}
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Winner badge ─────────────────────────────────────────────────────────────

function WinnerBadge({
  scoreA,
  scoreB,
  domainA,
  domainB,
}: {
  scoreA: number;
  scoreB: number;
  domainA: string;
  domainB: string;
}) {
  const { t } = useDictionary();
  const diff = scoreA - scoreB;

  if (diff === 0) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-semibold text-gray-600">
        <Equal className="h-4 w-4" />
        {t.compare.tie}
      </div>
    );
  }

  const winner = diff > 0 ? domainA : domainB;
  const lead = Math.abs(diff);

  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
      <Trophy className="h-4 w-4" />
      {winner} — {t.compare.better} {lead} pts
    </div>
  );
}

// ── GapAnalysisCard ──────────────────────────────────────────────────────────
// Analyzes which query results each domain won

function GapAnalysisCard({
  reportA,
  reportB,
  domainA,
  domainB,
}: {
  reportA: Report;
  reportB: Report;
  domainA: string;
  domainB: string;
}) {
  const { t } = useDictionary();

  // Build per-query comparison
  const queriesA = reportA.queryResults;
  const queriesB = reportB.queryResults;

  // Group by query type presence
  const aPresent = queriesA.filter((q) => q.isPresent).length;
  const bPresent = queriesB.filter((q) => q.isPresent).length;
  const aPositive = queriesA.filter((q) => q.sentiment === "positive").length;
  const bPositive = queriesB.filter((q) => q.sentiment === "positive").length;
  const aNegative = queriesA.filter((q) => q.sentiment === "negative").length;
  const bNegative = queriesB.filter((q) => q.sentiment === "negative").length;

  const insights: Array<{ icon: React.ReactNode; text: string; type: "a" | "b" | "neutral" }> = [];

  // Presence gap
  if (aPresent > bPresent) {
    insights.push({
      icon: <Eye className="h-4 w-4 text-gray-900" />,
      text: `${domainA} appears in ${aPresent}/${queriesA.length} queries vs ${bPresent}/${queriesB.length} for ${domainB}`,
      type: "a",
    });
  } else if (bPresent > aPresent) {
    insights.push({
      icon: <Eye className="h-4 w-4 text-indigo-600" />,
      text: `${domainB} appears in ${bPresent}/${queriesB.length} queries vs ${aPresent}/${queriesA.length} for ${domainA}`,
      type: "b",
    });
  }

  // Sentiment gap
  if (aPositive > bPositive) {
    insights.push({
      icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
      text: `${domainA} has more positive sentiment (${aPositive} vs ${bPositive} positive mentions)`,
      type: "a",
    });
  } else if (bPositive > aPositive) {
    insights.push({
      icon: <MessageSquare className="h-4 w-4 text-emerald-600" />,
      text: `${domainB} has more positive sentiment (${bPositive} vs ${aPositive} positive mentions)`,
      type: "b",
    });
  }

  // Negative sentiment warning
  if (aNegative > 0 || bNegative > 0) {
    const target = aNegative >= bNegative ? domainA : domainB;
    const count = Math.max(aNegative, bNegative);
    insights.push({
      icon: <Shield className="h-4 w-4 text-amber-500" />,
      text: `${target} has ${count} negative mention${count > 1 ? "s" : ""} — reputation risk to address`,
      type: "neutral",
    });
  }

  // Source influence comparison
  const sourcesA = reportA.metrics.influenceSources?.length ?? 0;
  const sourcesB = reportB.metrics.influenceSources?.length ?? 0;
  if (sourcesA !== sourcesB) {
    const better = sourcesA > sourcesB ? domainA : domainB;
    const bCount = Math.max(sourcesA, sourcesB);
    insights.push({
      icon: <Zap className="h-4 w-4 text-blue-500" />,
      text: `${better} is backed by more influence sources (${bCount} unique sources)`,
      type: sourcesA > sourcesB ? "a" : "b",
    });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-gray-900">
        {t.compare.keyInsights}
      </p>
      {insights.length === 0 && (
        <p className="text-xs text-gray-400">
          Both domains perform similarly across all metrics.
        </p>
      )}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              insight.type === "a"
                ? "border-gray-100 bg-gray-50/50"
                : insight.type === "b"
                  ? "border-indigo-50 bg-indigo-50/30"
                  : "border-amber-50 bg-amber-50/30"
            }`}
          >
            <div className="mt-0.5 shrink-0">{insight.icon}</div>
            <p className="text-xs leading-relaxed text-gray-700">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CompetitorOverlap ────────────────────────────────────────────────────────

function CompetitorOverlap({
  reportA,
  reportB,
  domainA,
  domainB,
}: {
  reportA: Report;
  reportB: Report;
  domainA: string;
  domainB: string;
}) {
  const { t } = useDictionary();

  // Extract competitors from query results
  const compsA = new Set(reportA.queryResults.flatMap((q) => q.competitors));
  const compsB = new Set(reportB.queryResults.flatMap((q) => q.competitors));

  const shared = [...compsA].filter((c) => compsB.has(c));
  const onlyA = [...compsA].filter((c) => !compsB.has(c));
  const onlyB = [...compsB].filter((c) => !compsA.has(c));

  function renderTags(
    items: string[],
    colorClass: string,
    limit = 8
  ) {
    if (items.length === 0) return <p className="text-xs text-gray-300">—</p>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, limit).map((c) => (
          <span
            key={c}
            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs ${colorClass}`}
          >
            {c}
          </span>
        ))}
        {items.length > limit && (
          <span className="text-xs text-gray-400">
            +{items.length - limit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-gray-900">
        {t.compare.sharedCompetitors}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.compare.uniqueTo} {domainA}
          </p>
          {renderTags(onlyA, "border-gray-200 bg-gray-50 text-gray-600")}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.compare.sharedCompetitors}
          </p>
          {renderTags(
            shared,
            "border-emerald-100 bg-emerald-50 text-emerald-700"
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.compare.uniqueTo} {domainB}
          </p>
          {renderTags(onlyB, "border-indigo-100 bg-indigo-50 text-indigo-700")}
        </div>
      </div>
    </div>
  );
}

// ── RecommendationsCompare ───────────────────────────────────────────────────

function RecommendationsCompare({
  reportA,
  reportB,
  domainA,
  domainB,
}: {
  reportA: Report;
  reportB: Report;
  domainA: string;
  domainB: string;
}) {
  const { t } = useDictionary();

  function renderRecs(recs: Recommendation[]) {
    if (recs.length === 0) {
      return <p className="text-xs text-gray-400">{t.compare.noData}</p>;
    }
    return (
      <div className="space-y-2">
        {recs.slice(0, 3).map((rec, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  rec.priority === "high"
                    ? "bg-red-50 text-red-600"
                    : rec.priority === "medium"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {rec.priority}
              </span>
              <p className="text-xs font-semibold text-gray-900">{rec.title}</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
              {rec.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">
          {t.compare.recommendations} — {domainA}
        </p>
        {renderRecs(reportA.recommendations)}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-indigo-600">
          {t.compare.recommendations} — {domainB}
        </p>
        {renderRecs(reportB.recommendations)}
      </div>
    </div>
  );
}

// ── Main CompareClient ───────────────────────────────────────────────────────

export function CompareClient() {
  const { t } = useDictionary();

  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [stateA, setStateA] = useState<ScanState>(INITIAL_STATE);
  const [stateB, setStateB] = useState<ScanState>(INITIAL_STATE);
  const [phase, setPhase] = useState<"input" | "scanning" | "results">("input");
  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch an existing report ──
  async function fetchExistingReport(
    reportId: string,
    setState: React.Dispatch<React.SetStateAction<ScanState>>,
    signal: AbortSignal
  ): Promise<Report | null> {
    setState({
      status: "scanning",
      progress: 50,
      stepLabel: t.compare.loadingReport,
      reportId,
      report: null,
      error: null,
    });

    try {
      const res = await fetch(`/api/report/${reportId}`, { signal });
      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: t.errors.unexpected,
        }));
        return null;
      }
      const report: Report = await res.json();
      setState({
        status: "done",
        progress: 100,
        stepLabel: "",
        reportId,
        report,
        error: null,
      });
      return report;
    } catch {
      if (signal.aborted) return null;
      setState((prev) => ({
        ...prev,
        status: "error",
        error: t.errors.unexpected,
      }));
      return null;
    }
  }

  // ── Run a new scan with simulated progress ──
  async function runScan(
    domain: string,
    depth: ScanDepth,
    queryTypes: QueryType[],
    setState: React.Dispatch<React.SetStateAction<ScanState>>,
    signal: AbortSignal
  ) {
    setState({
      status: "scanning",
      progress: 5,
      stepLabel: t.scanSteps.domainValidation,
      reportId: null,
      report: null,
      error: null,
    });

    // Simulate step progress while waiting for API
    let stepIdx = 0;
    const timer = setInterval(() => {
      if (signal.aborted) {
        clearInterval(timer);
        return;
      }
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 1);
      const step = STEPS[stepIdx];
      setState((prev) => ({
        ...prev,
        progress: step.pct,
        stepLabel:
          t.scanSteps[step.key as keyof typeof t.scanSteps] ?? prev.stepLabel,
      }));
    }, 4000);

    try {
      const scanRes = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, depth, queryTypes }),
        signal,
      });

      clearInterval(timer);

      if (!scanRes.ok) {
        const err = await scanRes.json();
        setState((prev) => ({
          ...prev,
          status: "error",
          progress: prev.progress,
          error: err.error || t.errors.scanFailed,
        }));
        return null;
      }

      const { reportId } = await scanRes.json();

      setState((prev) => ({
        ...prev,
        progress: 95,
        stepLabel: t.compare.waitingForResults,
        reportId,
      }));

      const reportRes = await fetch(`/api/report/${reportId}`, { signal });
      if (!reportRes.ok) {
        setState((prev) => ({
          ...prev,
          status: "error",
          error: t.errors.unexpected,
        }));
        return null;
      }

      const report: Report = await reportRes.json();

      setState({
        status: "done",
        progress: 100,
        stepLabel: "",
        reportId,
        report,
        error: null,
      });

      return report;
    } catch {
      clearInterval(timer);
      if (signal.aborted) return null;
      setState((prev) => ({
        ...prev,
        status: "error",
        error: t.errors.unexpected,
      }));
      return null;
    }
  }

  // ── Resolve a slot (existing or new) ──
  async function resolveSlot(
    config: SlotConfig,
    setState: React.Dispatch<React.SetStateAction<ScanState>>,
    signal: AbortSignal
  ): Promise<Report | null> {
    if (config.mode === "existing") {
      return fetchExistingReport(config.reportId, setState, signal);
    }
    return runScan(config.domain, config.depth, config.queryTypes, setState, signal);
  }

  // ── Start comparison ──
  async function startComparison(configA: SlotConfig, configB: SlotConfig) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setDomainA(configA.domain);
    setDomainB(configB.domain);
    setPhase("scanning");
    setStateA(INITIAL_STATE);
    setStateB(INITIAL_STATE);

    // Run sequentially to avoid rate-limiting on new scans
    const reportA = await resolveSlot(configA, setStateA, controller.signal);
    const reportB = await resolveSlot(configB, setStateB, controller.signal);

    if (reportA && reportB) {
      setPhase("results");
    }
  }

  const isScanning = phase === "scanning";
  const hasResults =
    phase === "results" && stateA.report && stateB.report;

  const reportA = stateA.report;
  const reportB = stateB.report;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton label={t.dashboard.goBack} />
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t.compare.title}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {t.compare.description}
          </p>
        </div>
      </div>

      {/* Domain input form */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <DomainInputForm
          onCompare={startComparison}
          loading={isScanning}
        />
      </div>

      {/* Dual progress bars */}
      {isScanning && (
        <DualProgress
          stateA={stateA}
          stateB={stateB}
          domainA={domainA}
          domainB={domainB}
        />
      )}

      {/* Error state */}
      {(stateA.status === "error" || stateB.status === "error") &&
        phase === "scanning" && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
            {stateA.error || stateB.error}
          </div>
        )}

      {/* ── Comparison results ── */}
      {hasResults && reportA && reportB && (
        <>
          {/* Winner badge */}
          <div className="flex justify-center">
            <WinnerBadge
              scoreA={reportA.metrics.visibilityScore}
              scoreB={reportB.metrics.visibilityScore}
              domainA={domainA}
              domainB={domainB}
            />
          </div>

          {/* Score + Radar */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Score cards side by side */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-4 text-sm font-semibold text-gray-900">
                {t.compare.scoreComparison}
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                <div className="text-center">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {domainA}
                  </p>
                  <p className="text-5xl font-bold text-gray-900">
                    {reportA.metrics.visibilityScore}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">/100</p>
                  {stateA.reportId && (
                    <Link
                      href={`/report/${stateA.reportId}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                    >
                      <FileText className="h-3 w-3" />
                      {t.dashboard.viewFullReport}
                    </Link>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                    {t.compare.vs}
                  </span>
                </div>
                <div className="text-center">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {domainB}
                  </p>
                  <p className="text-5xl font-bold text-indigo-600">
                    {reportB.metrics.visibilityScore}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">/100</p>
                  {stateB.reportId && (
                    <Link
                      href={`/report/${stateB.reportId}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <FileText className="h-3 w-3" />
                      {t.dashboard.viewFullReport}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Radar chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-2 text-sm font-semibold text-gray-900">
                {t.compare.metricsBreakdown}
              </p>
              <div className="h-64">
                <RadarComparison
                  metricsA={reportA.metrics}
                  metricsB={reportB.metrics}
                  domainA={domainA}
                  domainB={domainB}
                />
              </div>
            </div>
          </div>

          {/* Detailed metrics comparison */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 grid grid-cols-[1fr_auto_1fr] gap-4">
              <p className="text-right text-xs font-semibold uppercase tracking-wider text-gray-900">
                {domainA}
              </p>
              <span />
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {domainB}
              </p>
            </div>
            <MetricRow
              label={t.compare.visibilityScore}
              icon={<TrendingUp className="h-3.5 w-3.5 text-gray-400" />}
              valueA={reportA.metrics.visibilityScore}
              valueB={reportB.metrics.visibilityScore}
              format={(v) => (v != null ? `${v}/100` : "—")}
            />
            <MetricRow
              label={t.compare.citationRate}
              icon={<Eye className="h-3.5 w-3.5 text-gray-400" />}
              valueA={Math.round(reportA.metrics.citationRate * 100)}
              valueB={Math.round(reportB.metrics.citationRate * 100)}
              format={(v) => (v != null ? `${v}%` : "—")}
            />
            <MetricRow
              label={t.compare.avgPosition}
              icon={<Zap className="h-3.5 w-3.5 text-gray-400" />}
              valueA={reportA.metrics.averagePosition}
              valueB={reportB.metrics.averagePosition}
              format={(v) => (v != null ? `#${v.toFixed(1)}` : "—")}
              invertBetter
            />
            <MetricRow
              label={t.compare.sentiment}
              icon={<MessageSquare className="h-3.5 w-3.5 text-gray-400" />}
              valueA={sentimentToNum(reportA.metrics.overallSentiment)}
              valueB={sentimentToNum(reportB.metrics.overallSentiment)}
              format={(v) => {
                if (v == null) return "—";
                if (v >= 75) return "Positive";
                if (v >= 25) return "Neutral";
                return "Negative";
              }}
            />
          </div>

          {/* Key Insights / Gap analysis */}
          <GapAnalysisCard
            reportA={reportA}
            reportB={reportB}
            domainA={domainA}
            domainB={domainB}
          />

          {/* SOV overlap chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-1 text-sm font-semibold text-gray-900">
              {t.compare.sovOverlap}
            </p>
            <p className="mb-4 text-xs text-gray-400">
              {domainA} {t.compare.vs} {domainB}
            </p>
            <div className="h-56">
              <SOVOverlapChart
                metricsA={reportA.metrics}
                metricsB={reportB.metrics}
                domainA={domainA}
                domainB={domainB}
              />
            </div>
          </div>

          {/* Competitor overlap */}
          <CompetitorOverlap
            reportA={reportA}
            reportB={reportB}
            domainA={domainA}
            domainB={domainB}
          />

          {/* Recommendations side by side */}
          <RecommendationsCompare
            reportA={reportA}
            reportB={reportB}
            domainA={domainA}
            domainB={domainB}
          />
        </>
      )}

      {/* Initial empty state */}
      {phase === "input" && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 py-16 text-center">
          <p className="text-sm text-gray-400">{t.compare.noDataDesc}</p>
        </div>
      )}
    </div>
  );
}
