import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: number | null; // positive = up, negative = down, null = no data
  trendLabel?: string;
  invertTrend?: boolean; // for position: lower is better
  accent?: string;
  firstScanLabel?: string;
}

export function KPICard({
  label,
  value,
  sub,
  trend,
  trendLabel,
  invertTrend = false,
  accent,
  firstScanLabel = "First scan",
}: KPICardProps) {
  const isUp = trend != null && trend > 0;
  const isDown = trend != null && trend < 0;
  const goodTrend = invertTrend ? isDown : isUp;
  const badTrend = invertTrend ? isUp : isDown;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <p
        className={`text-3xl font-bold tracking-tight ${accent ?? "text-gray-900"}`}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
      {trend != null && (
        <div
          className={`mt-3 flex items-center gap-1 text-xs font-medium ${
            goodTrend
              ? "text-emerald-600"
              : badTrend
                ? "text-red-500"
                : "text-gray-400"
          }`}
        >
          {goodTrend ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : badTrend ? (
            <TrendingDown className="h-3.5 w-3.5" />
          ) : (
            <Minus className="h-3.5 w-3.5" />
          )}
          <span>
            {trend > 0 ? "+" : ""}
            {trendLabel ?? trend}
          </span>
        </div>
      )}
      {trend == null && (
        <p className="mt-3 text-xs text-gray-300">{firstScanLabel}</p>
      )}
    </div>
  );
}
