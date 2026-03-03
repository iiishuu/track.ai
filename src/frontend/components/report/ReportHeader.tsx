import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { DownloadButton } from "./DownloadButton";
import type { Dictionary } from "@/shared/i18n/types";

interface ReportHeaderProps {
  domain: string;
  sector: string;
  createdAt: string;
  reportId: string;
  t: Dictionary;
}

export function ReportHeader({
  domain,
  sector,
  createdAt,
  reportId,
  t,
}: ReportHeaderProps) {
  const date = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{domain}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary">{sector}</Badge>
            <span className="text-sm text-muted-foreground">
              {t.report.scanDate.replace("{date}", date)}
            </span>
          </div>
        </div>
        <DownloadButton
          reportId={reportId}
          label={t.report.downloadPdf}
        />
      </div>
      <Separator />
    </div>
  );
}
