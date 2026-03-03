"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/frontend/components/ui/card";
import type { Dictionary } from "@/shared/i18n/types";

interface CompetitiveAnalysisProps {
  shareOfVoice: Record<string, number>;
  domain: string;
  t: Dictionary;
}

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(40, 80%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(10, 70%, 50%)",
  "hsl(190, 60%, 45%)",
  "hsl(320, 60%, 50%)",
  "hsl(90, 50%, 45%)",
];

export function CompetitiveAnalysis({
  shareOfVoice,
  domain,
  t,
}: CompetitiveAnalysisProps) {
  const entries = Object.entries(shareOfVoice).sort(([, a], [, b]) => b - a);

  if (entries.length === 0) return null;

  // Group small competitors into "Others" for cleaner chart
  const TOP_COUNT = 6;
  const topEntries = entries.slice(0, TOP_COUNT);
  const otherEntries = entries.slice(TOP_COUNT);
  const otherTotal = otherEntries.reduce((sum, [, v]) => sum + v, 0);

  const chartData = [
    ...topEntries.map(([name, value]) => ({
      name,
      value: Math.round(value),
      isDomain: name.toLowerCase() === domain.toLowerCase(),
    })),
    ...(otherTotal > 0
      ? [{ name: `+${otherEntries.length} others`, value: Math.round(otherTotal), isDomain: false }]
      : []),
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">
          {t.report.shareOfVoiceChart}
        </h3>
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Donut chart */}
          <div className="h-64 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.isDomain
                          ? "hsl(220, 90%, 45%)"
                          : COLORS[i % COLORS.length]
                      }
                      strokeWidth={entry.isDomain ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid hsl(0 0% 90%)",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                  iconSize={8}
                  layout="horizontal"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rankings table */}
          <div className="w-full md:w-1/2">
            <div className="space-y-2">
              {topEntries.map(([name, share], i) => {
                const isDomain =
                  name.toLowerCase() === domain.toLowerCase();
                return (
                  <div
                    key={name}
                    className={`flex items-center gap-3 rounded-md p-2 ${isDomain ? "bg-primary/5 font-semibold" : ""}`}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: isDomain
                          ? "hsl(220, 90%, 45%)"
                          : COLORS[i % COLORS.length],
                      }}
                    />
                    <span className="flex-1 truncate text-sm">
                      {name}
                      {isDomain && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({t.report.yourBrand})
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-medium tabular-nums">
                      {Math.round(share)}%
                    </span>
                  </div>
                );
              })}
              {otherTotal > 0 && (
                <div className="flex items-center gap-3 rounded-md p-2 text-muted-foreground">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-muted" />
                  <span className="flex-1 text-sm">
                    +{otherEntries.length} others
                  </span>
                  <span className="text-sm tabular-nums">
                    {Math.round(otherTotal)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
