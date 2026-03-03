"use client";

import { X } from "lucide-react";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";

type StepStatus = "pending" | "running" | "done" | "error";

interface Step {
  key: string;
  status: StepStatus;
}

interface InlineScanProgressProps {
  domain: string;
  steps: Step[];
  isComplete: boolean;
  error: string | null;
  onDismiss: () => void;
}

const STEP_KEYS = [
  "domainValidation",
  "sectorDiscovery",
  "aiQueryAnalysis",
  "scoreComputation",
  "recommendations",
] as const;

export function InlineScanProgress({
  domain,
  steps,
  isComplete,
  error,
  onDismiss,
}: InlineScanProgressProps) {
  const { t } = useDictionary();
  const completedCount = steps.filter((s) => s.status === "done").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {isComplete
              ? t.loading.complete
              : t.loading.title.replace("{domain}", domain)}
          </p>
          {!isComplete && !error && (
            <p className="mt-0.5 text-xs text-gray-400">{t.loading.subtitle}</p>
          )}
        </div>
        {(isComplete || error) && (
          <button
            onClick={onDismiss}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            error
              ? "bg-red-400"
              : isComplete
                ? "bg-emerald-500"
                : "bg-gray-900"
          }`}
          style={{ width: `${isComplete ? 100 : progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => {
          const key = STEP_KEYS[i];
          const isVisible =
            step.status === "running" ||
            step.status === "done" ||
            step.status === "error";
          if (!isVisible && step.status !== "done") return null;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  step.status === "done"
                    ? "bg-emerald-100 text-emerald-600"
                    : step.status === "running"
                      ? "bg-gray-900 text-white"
                      : step.status === "error"
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.status === "done"
                  ? "✓"
                  : step.status === "running"
                    ? "…"
                    : step.status === "error"
                      ? "✗"
                      : i + 1}
              </span>
              <span
                className={
                  step.status === "done"
                    ? "text-gray-500 line-through"
                    : step.status === "running"
                      ? "font-medium text-gray-900"
                      : "text-gray-400"
                }
              >
                {t.scanSteps[key]}
              </span>
              {step.status === "running" && (
                <span className="ml-auto animate-pulse text-gray-400">
                  {t.loading.stepDescriptions[key]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      )}
      {isComplete && (
        <p className="mt-3 text-xs font-medium text-emerald-600">
          Dashboard updated with new data ↓
        </p>
      )}
    </div>
  );
}
