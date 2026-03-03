"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/frontend/components/ui/collapsible";
import type { QueryResult } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/types";

interface QueryResultCardProps {
  result: QueryResult;
  index: number;
  t: Dictionary;
}

function sentimentVariant(
  sentiment: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (sentiment) {
    case "positive":
      return "default";
    case "negative":
      return "destructive";
    default:
      return "secondary";
  }
}

function translateSentiment(sentiment: string, t: Dictionary): string {
  const key = sentiment as keyof typeof t.labels;
  return t.labels[key] ?? sentiment;
}

export function QueryResultCard({ result, index, t }: QueryResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer pb-2 transition-colors hover:bg-muted/50">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-medium leading-tight">
                    {result.query}
                  </CardTitle>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge
                      variant={result.isPresent ? "default" : "outline"}
                    >
                      {result.isPresent ? t.labels.present : t.labels.absent}
                    </Badge>
                    <Badge variant={sentimentVariant(result.sentiment)}>
                      {translateSentiment(result.sentiment, t)}
                    </Badge>
                    {result.rank !== null && (
                      <Badge variant="secondary">#{result.rank}</Badge>
                    )}
                    {/* Chevron */}
                    <svg
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {result.context || result.response}
                </p>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 border-t pt-4">
            {/* Full response */}
            <div>
              <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                {t.report.aiResponses}
              </h4>
              <div className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed whitespace-pre-line">
                {result.response}
              </div>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  {t.report.aiSources}
                </h4>
                <ul className="space-y-1">
                  {result.sources.map((source, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <svg
                        className="h-3 w-3 shrink-0 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span className="truncate text-muted-foreground">
                        {source}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.sources.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {t.report.noSources}
              </p>
            )}

            {/* Competitors */}
            {result.competitors.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.competitors.map((comp) => (
                  <Badge key={comp} variant="outline" className="text-xs">
                    {comp}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
