import { ExternalLink } from "lucide-react";

interface InfluenceSourcesProps {
  sources: string[];
  noDataLabel?: string;
}

export function InfluenceSources({
  sources,
  noDataLabel = "No influence sources detected",
}: InfluenceSourcesProps) {
  if (sources.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        {noDataLabel}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {sources.map((src, i) => {
        // Try to extract domain from URL
        let display = src;
        try {
          const url = new URL(src.startsWith("http") ? src : `https://${src}`);
          display = url.hostname.replace(/^www\./, "");
        } catch {
          display = src.length > 40 ? src.slice(0, 38) + "…" : src;
        }

        return (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/30 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-500">
                {i + 1}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {display}
              </span>
            </div>
            {src.startsWith("http") && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gray-500"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
