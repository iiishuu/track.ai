"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type StepStatus = "pending" | "running" | "done" | "error";

interface Step {
  key: string;
  status: StepStatus;
}

export interface ScanParams {
  domain: string;
  engine: string;
  depth: string;
  types: string;
}

interface UseScanWithProgressReturn {
  steps: Step[];
  currentStep: number;
  isComplete: boolean;
  error: string | null;
  reportId: string | null;
}

const STEP_KEYS = [
  "domainValidation",
  "sectorDiscovery",
  "aiQueryAnalysis",
  "scoreComputation",
  "recommendations",
] as const;

const DEPTH_DELAYS: Record<string, number[]> = {
  quick:    [1500, 3000,  8000,  3000, 2500],
  standard: [2000, 4000, 15000,  5000, 3000],
  deep:     [2000, 5000, 30000, 10000, 5000],
};

export function useScanWithProgress(
  params: ScanParams | null
): UseScanWithProgressReturn {
  const [steps, setSteps] = useState<Step[]>(
    STEP_KEYS.map((key) => ({ key, status: "pending" }))
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const apiDone = useRef(false);
  const apiResult = useRef<string | null>(null);
  const apiError = useRef<string | null>(null);
  const started = useRef(false);

  const completeAllSteps = useCallback(() => {
    setSteps(STEP_KEYS.map((key) => ({ key, status: "done" })));
    setCurrentStep(STEP_KEYS.length - 1);
    if (apiResult.current) {
      setReportId(apiResult.current);
      setIsComplete(true);
    }
  }, []);

  useEffect(() => {
    if (!params || started.current) return;
    started.current = true;

    const queryTypes = params.types
      ? params.types.split(",").filter(Boolean)
      : undefined;

    // Start API call with all scan options
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: params.domain,
        depth: params.depth || "standard",
        queryTypes,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Scan failed");
        }
        return res.json();
      })
      .then((data) => {
        apiDone.current = true;
        apiResult.current = data.reportId;
      })
      .catch((err) => {
        apiDone.current = true;
        apiError.current =
          err instanceof Error ? err.message : "An unexpected error occurred";
      });

    // Start step timer — delays scale with scan depth
    const stepDelays = DEPTH_DELAYS[params.depth] || DEPTH_DELAYS.standard;
    let stepIndex = 0;

    function advanceStep() {
      if (apiError.current) {
        setSteps((prev) =>
          prev.map((s, i) =>
            i === stepIndex
              ? { ...s, status: "error" }
              : i < stepIndex
                ? { ...s, status: "done" }
                : s
          )
        );
        setCurrentStep(stepIndex);
        setError(apiError.current);
        return;
      }

      setSteps((prev) =>
        prev.map((s, i) =>
          i === stepIndex
            ? { ...s, status: "running" }
            : i < stepIndex
              ? { ...s, status: "done" }
              : s
        )
      );
      setCurrentStep(stepIndex);

      const delay = stepDelays[stepIndex];
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === stepIndex ? { ...s, status: "done" } : s))
        );

        stepIndex++;

        if (stepIndex >= STEP_KEYS.length) {
          if (apiDone.current) {
            if (apiError.current) {
              setError(apiError.current);
            } else {
              setReportId(apiResult.current);
              setIsComplete(true);
            }
          } else {
            const poll = setInterval(() => {
              if (apiDone.current) {
                clearInterval(poll);
                if (apiError.current) {
                  setError(apiError.current);
                } else {
                  setReportId(apiResult.current);
                  setIsComplete(true);
                }
              }
            }, 500);
          }
        } else if (apiDone.current && !apiError.current) {
          completeAllSteps();
        } else {
          advanceStep();
        }
      }, delay);
    }

    advanceStep();
  }, [params, completeAllSteps]);

  return { steps, currentStep, isComplete, error, reportId };
}
