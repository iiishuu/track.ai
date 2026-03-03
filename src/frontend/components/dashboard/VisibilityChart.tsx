"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { DashboardPoint } from "./types";

interface VisibilityChartProps {
  points: DashboardPoint[];
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateStr));
}

export function VisibilityChart({ points }: VisibilityChartProps) {
  const data = points.map((p) => ({
    date: formatDate(p.date),
    score: p.score,
    citationRate: Math.round(p.citationRate * 100),
  }));

  const avg =
    data.reduce((acc, d) => acc + d.score, 0) / (data.length || 1);

  if (points.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#111111" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#111111" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="citationGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            padding: "8px 12px",
          }}
          labelStyle={{ fontWeight: 600, color: "#111" }}
        />
        <ReferenceLine
          y={Math.round(avg)}
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          label={{ value: `avg ${Math.round(avg)}`, fontSize: 10, fill: "#9ca3af" }}
        />
        <Area
          type="monotone"
          dataKey="citationRate"
          name="Citation %"
          stroke="#6366f1"
          strokeWidth={1.5}
          fill="url(#citationGrad)"
          dot={false}
          strokeDasharray="4 4"
        />
        <Area
          type="monotone"
          dataKey="score"
          name="Visibility Score"
          stroke="#111111"
          strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={{ r: 4, fill: "#111", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
