import type { Recommendation } from "@/shared/types";

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  sector?: string;
  priorityLabels?: { high: string; medium: string; low: string };
  noRecommendationsLabel?: string;
  sectorLabel?: string;
}

const PRIORITY_STYLE = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-gray-50 text-gray-600 border-gray-200",
};

export function RecommendationsPanel({
  recommendations,
  sector,
  priorityLabels = { high: "High", medium: "Medium", low: "Low" },
  noRecommendationsLabel = "No recommendations yet",
  sectorLabel = "Sector",
}: RecommendationsPanelProps) {
  if (recommendations.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        {noRecommendationsLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sector && (
        <p className="text-xs text-gray-400">
          {sectorLabel}: <span className="font-medium text-gray-600">{sector}</span>
        </p>
      )}
      {recommendations.map((rec, i) => {
        const label = priorityLabels[rec.priority];
        const style = PRIORITY_STYLE[rec.priority];
        return (
          <div key={i} className="rounded-lg border border-gray-100 bg-white p-4">
            <div className="mb-2 flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style}`}
              >
                {label}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              {rec.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
