"use client";

import { Button } from "@/frontend/components/ui/button";

interface DownloadButtonProps {
  reportId: string;
  label: string;
}

export function DownloadButton({ label }: DownloadButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="no-print gap-2"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3"
        />
      </svg>
      {label}
    </Button>
  );
}
