"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  useScanWithProgress,
  type ScanParams,
} from "@/frontend/hooks/useScanWithProgress";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";

const STEP_KEYS = [
  "domainValidation",
  "sectorDiscovery",
  "aiQueryAnalysis",
  "scoreComputation",
  "recommendations",
] as const;

export function ScanLoading() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const router = useRouter();
  const { t } = useDictionary();

  const scanParams: ScanParams | null = domain
    ? {
        domain,
        engine: searchParams.get("engine") || "perplexity",
        depth: searchParams.get("depth") || "standard",
        types:
          searchParams.get("types") ||
          "commercial,comparative,reputation,informational",
      }
    : null;

  const { steps, isComplete, error, reportId } =
    useScanWithProgress(scanParams);
  const [factIndex, setFactIndex] = useState(0);

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % t.loading.facts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [t.loading.facts.length]);

  // Redirect to report when complete
  useEffect(() => {
    if (isComplete && reportId) {
      const timeout = setTimeout(() => {
        router.push(`/report/${reportId}`);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, reportId, router]);

  if (!domain) {
    router.push("/scan");
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-xl flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {t.loading.title.replace("{domain}", domain)}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.loading.subtitle}</p>
      </div>

      {/* Stacking step cards */}
      <div className="flex w-full flex-col gap-3">
        {steps.map((step, i) => {
          const stepKey = STEP_KEYS[i];
          const isVisible =
            step.status === "running" ||
            step.status === "done" ||
            step.status === "error";

          return (
            <div
              key={step.key}
              className={`transition-all duration-500 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              <Card
                className={`transition-colors duration-300 ${
                  step.status === "done"
                    ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
                    : step.status === "error"
                      ? "border-destructive/50 bg-destructive/5"
                      : step.status === "running"
                        ? "border-primary/50 bg-primary/5"
                        : ""
                }`}
              >
                <CardContent className="flex items-center gap-3 py-4">
                  {/* Status icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    {step.status === "done" && (
                      <svg
                        className="h-6 w-6 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {step.status === "running" && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    {step.status === "error" && (
                      <svg
                        className="h-6 w-6 text-destructive"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t.scanSteps[stepKey]}
                    </p>
                    {step.status === "running" && (
                      <p className="text-xs text-muted-foreground">
                        {t.loading.stepDescriptions[stepKey]}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Complete state */}
      {isComplete && (
        <div className="animate-in fade-in text-center">
          <p className="text-lg font-semibold text-green-600">
            {t.loading.complete}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.loading.redirecting}
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() =>
              router.push(`/scan?domain=${encodeURIComponent(domain)}`)
            }
          >
            {t.loading.tryAgain}
          </Button>
        </div>
      )}

      {/* Fun facts */}
      {!isComplete && !error && (
        <div className="w-full rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground italic">
            {t.loading.facts[factIndex]}
          </p>
        </div>
      )}
    </main>
  );
}
