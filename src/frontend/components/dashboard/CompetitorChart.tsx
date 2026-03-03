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
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { DashboardPoint } from "./types";

const COLORS = [
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#10B981", // green
  "#8B5CF6", // purple
  "#EF4444", // red
];

interface CompetitorSOVChartProps {
  latestPoint: DashboardPoint;
  domain: string;
  noDataLabel?: string;
}

export function CompetitorSOVChart({
  latestPoint,
  domain,
  noDataLabel = "No competitor data",
}: CompetitorSOVChartProps) {
  const entries = Object.entries(latestPoint.shareOfVoice)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const data = entries.map(([name, sov]) => ({
    name: name.length > 14 ? name.slice(0, 12) + "…" : name,
    sov: Math.round(sov),
    isOwn: name.toLowerCase().includes(domain.split(".")[0].toLowerCase()),
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        {noDataLabel}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#374151" }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            fontSize: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
          formatter={(v: number | undefined) => [`${v ?? 0}%`, "Share of Voice"]}
        />
        <Bar dataKey="sov" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.isOwn ? "#111111" : COLORS[index % COLORS.length]}
              opacity={entry.isOwn ? 1 : 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CompetitorTrendChartProps {
  points: DashboardPoint[];
  topCompetitors: string[];
  domain: string;
  needMoreScansLabel?: string;
  needMoreScansSub?: string;
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateStr));
}

export function CompetitorTrendChart({
  points,
  topCompetitors,
  domain,
  needMoreScansLabel = "Need 2+ scans",
  needMoreScansSub = "Run another analysis to see trends",
}: CompetitorTrendChartProps) {
  if (points.length < 2) {
    return (
      <div className="flex h-full items-center justify-center text-center text-sm text-gray-400">
        <div>
          <p>{needMoreScansLabel}</p>
          <p className="mt-1 text-xs">{needMoreScansSub}</p>
        </div>
      </div>
    );
  }

  const allPlayers = [domain, ...topCompetitors.slice(0, 4)];

  const data = points.map((p) => {
    const row: Record<string, string | number> = { date: formatDate(p.date) };
    for (const player of allPlayers) {
      row[player] = Math.round(p.shareOfVoice[player] ?? 0);
    }
    return row;
  });

  const playerColors = ["#111111", ...COLORS];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
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
          formatter={(v: number | undefined) => [`${v ?? 0}%`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {allPlayers.map((player, idx) => (
          <Line
            key={player}
            type="monotone"
            dataKey={player}
            stroke={playerColors[idx]}
            strokeWidth={idx === 0 ? 2.5 : 1.5}
            dot={false}
            activeDot={{ r: 4 }}
            name={player.length > 18 ? player.slice(0, 16) + "…" : player}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
