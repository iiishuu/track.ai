"use client";

import { useState } from "react";

interface ScanResult {
  scanId: string;
  reportId: string;
}

interface UseScanReturn {
  scan: (domain: string) => Promise<ScanResult>;
  isLoading: boolean;
  error: string | null;
}

export function useScan(): UseScanReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scan(domain: string): Promise<ScanResult> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Scan failed");
      }

      const result: ScanResult = await response.json();
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { scan, isLoading, error };
}
