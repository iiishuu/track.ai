"use client";

import { Progress } from "@/frontend/components/ui/progress";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import type { ScanStep } from "@/shared/types";

interface ScanProgressProps {
  steps?: ScanStep[];
}

export function ScanProgress({ steps: stepsProp }: ScanProgressProps) {
  const { t } = useDictionary();

  const steps: ScanStep[] = stepsProp ?? [
    { label: t.scanSteps.domainValidation, status: "done" },
    { label: t.scanSteps.sectorDiscovery, status: "running" },
    { label: t.scanSteps.aiQueryAnalysis, status: "pending" },
    { label: t.scanSteps.scoreComputation, status: "pending" },
    { label: t.scanSteps.recommendations, status: "pending" },
  ];

  const completedCount = steps.filter((s) => s.status === "done").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Progress value={progress} className="h-2" />
      <ul className="flex flex-col gap-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2 text-sm">
            <span
              className={
                step.status === "done"
                  ? "text-green-600"
                  : step.status === "running"
                    ? "text-blue-500 animate-pulse"
                    : step.status === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
              }
            >
              {step.status === "done"
                ? "\u2713"
                : step.status === "running"
                  ? "\u25CB"
                  : step.status === "error"
                    ? "\u2717"
                    : "\u2022"}
            </span>
            <span
              className={
                step.status === "pending"
                  ? "text-muted-foreground"
                  : undefined
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
