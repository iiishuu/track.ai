import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { DashboardPoint } from "./types";

interface ScanHistoryLabels {
  date: string;
  score: string;
  citationRate: string;
  avgPosition: string;
  sentiment: string;
  latest: string;
  report: string;
  noScans: string;
}

interface ScanHistoryTableProps {
  points: DashboardPoint[];
  labels: ScanHistoryLabels;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : score >= 40
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-red-50 text-red-600 border-red-100";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

function SentimentChip({ sentiment }: { sentiment: string }) {
  const map: Record<string, string> = {
    positive: "text-emerald-600",
    neutral: "text-gray-500",
    negative: "text-red-500",
  };
  return (
    <span className={`text-xs font-medium capitalize ${map[sentiment] ?? "text-gray-500"}`}>
      {sentiment}
    </span>
  );
}

export function ScanHistoryTable({ points, labels }: ScanHistoryTableProps) {
  const sorted = [...points].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-400">
        {labels.noScans}
      </p>
    );
  }

  const headers = [labels.date, labels.score, labels.citationRate, labels.avgPosition, labels.sentiment, ""];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {sorted.map((point, i) => (
            <tr
              key={point.reportId}
              className={`transition-colors hover:bg-gray-50 ${i === 0 ? "bg-gray-50/50" : ""}`}
            >
              <td className="px-5 py-3.5 text-gray-600">
                <div className="flex items-center gap-2">
                  {formatDate(point.date)}
                  {i === 0 && (
                    <span className="rounded-full bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      {labels.latest}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-3.5">
                <ScoreChip score={point.score} />
              </td>
              <td className="px-5 py-3.5 text-gray-700">
                {Math.round(point.citationRate * 100)}%
              </td>
              <td className="px-5 py-3.5 text-gray-700">
                {point.averagePosition != null
                  ? `#${point.averagePosition.toFixed(1)}`
                  : "—"}
              </td>
              <td className="px-5 py-3.5">
                <SentimentChip sentiment={point.sentiment} />
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  href={`/report/${point.reportId}`}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {labels.report}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
