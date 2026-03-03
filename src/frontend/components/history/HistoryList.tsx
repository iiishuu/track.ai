"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import type { HistoryEntry } from "@/shared/types";

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

const LOCALE_MAP = { en: "en-US", fr: "fr-FR" } as const;

export function HistoryList() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useDictionary();

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(LOCALE_MAP[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    async function fetchHistory() {
      try {
        const url = filter
          ? `/api/history?domain=${encodeURIComponent(filter)}`
          : "/api/history";
        const response = await fetch(url);
        if (!response.ok) throw new Error(t.history.errorFetch);
        const data: HistoryEntry[] = await response.json();
        setEntries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t.history.errorFetch
        );
      } finally {
        setIsLoading(false);
      }
    }

    const timeout = setTimeout(fetchHistory, filter ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [filter, t.history.errorFetch]);

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder={t.history.filterPlaceholder}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && (
        <p className="text-sm text-muted-foreground">{t.history.loading}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && entries.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {t.history.empty}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <Link key={entry.reportId} href={`/report/${entry.reportId}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {entry.domain}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${getScoreColor(entry.score)}`}
                    >
                      {Math.round(entry.score)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(entry.createdAt)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
