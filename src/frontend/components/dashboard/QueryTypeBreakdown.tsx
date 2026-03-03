"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { QueryTypePerformance } from "./types";

const TYPE_COLORS: Record<string, string> = {
  commercial: "#3B82F6",
  comparative: "#8B5CF6",
  reputation: "#F59E0B",
  informational: "#10B981",
};

const TYPE_LABELS: Record<string, string> = {
  commercial: "Commercial",
  comparative: "Comparative",
  reputation: "Reputation",
  informational: "Informational",
};

interface QueryTypeBreakdownProps {
  breakdown: QueryTypePerformance[];
  noDataLabel?: string;
  labels?: {
    commercial: string;
    comparative: string;
    reputation: string;
    informational: string;
  };
}

export function QueryTypeBreakdown({
  breakdown,
  noDataLabel = "No query data",
  labels,
}: QueryTypeBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        {noDataLabel}
      </div>
    );
  }

  const localLabels = labels ?? TYPE_LABELS;

  const data = breakdown.map((b) => ({
    name: localLabels[b.type as keyof typeof localLabels] ?? b.type,
    type: b.type,
    presence: b.presenceRate,
    positive: b.positiveRate,
    queries: b.queriesCount,
  }));

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {breakdown.map((b) => {
          const label = localLabels[b.type as keyof typeof localLabels] ?? b.type;
          const color = TYPE_COLORS[b.type] ?? "#6b7280";
          return (
            <div
              key={b.type}
              className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-semibold text-gray-700">
                  {label}
                </span>
              </div>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {b.presenceRate}%
              </p>
              <p className="text-[10px] text-gray-400">
                {b.queriesCount} queries · {b.positiveRate}% positive
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="h-40">
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
              domain={[0, 100]}
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
              formatter={(v: number | undefined, name?: string) => [
                `${v ?? 0}%`,
                name === "presence" ? "Presence" : "Positive",
              ]}
            />
            <Bar dataKey="presence" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell
                  key={entry.type}
                  fill={TYPE_COLORS[entry.type] ?? "#6b7280"}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
