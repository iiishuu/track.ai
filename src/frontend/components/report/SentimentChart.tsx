"use client";

import type { QueryResult } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/types";

interface SentimentChartProps {
  queryResults: QueryResult[];
  t: Dictionary;
}

const SENTIMENT_CONFIG = [
  { key: "positive" as const, color: "#10b981" },
  { key: "neutral" as const, color: "#6b7280" },
  { key: "negative" as const, color: "#ef4444" },
];

export function SentimentChart({ queryResults, t }: SentimentChartProps) {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  for (const qr of queryResults) {
    counts[qr.sentiment]++;
  }

  const total = queryResults.length;
  const presentCount = queryResults.filter((qr) => qr.isPresent).length;

  const segments = SENTIMENT_CONFIG.map((cfg) => ({
    ...cfg,
    label: t.labels[cfg.key],
    count: counts[cfg.key],
    pct: total > 0 ? Math.round((counts[cfg.key] / total) * 100) : 0,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Segmented progress bar */}
      <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
        {segments.map((seg) => {
          const width = total > 0 ? (seg.count / total) * 100 : 0;
          if (width === 0) return null;
          return (
            <div
              key={seg.key}
              className="h-full transition-all duration-500"
              style={{ width: `${width}%`, backgroundColor: seg.color }}
            />
          );
        })}
      </div>

      {/* Sentiment breakdown cards */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {segments.map((seg) => (
          <div
            key={seg.key}
            className="rounded-lg border border-gray-100 p-3.5 text-center"
          >
            <div className="mb-1.5 flex items-center justify-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {seg.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{seg.count}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              {seg.pct}% · {seg.count}/{total}
            </p>
          </div>
        ))}
      </div>

      {/* Present / Absent summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-emerald-50 p-3 text-center">
          <p className="text-lg font-bold text-emerald-600">
            {presentCount}/{total}
          </p>
          <p className="text-xs text-gray-500">{t.labels.present}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 text-center">
          <p className="text-lg font-bold text-gray-500">
            {total - presentCount}/{total}
          </p>
          <p className="text-xs text-gray-500">{t.labels.absent}</p>
        </div>
      </div>
    </div>
  );
}
