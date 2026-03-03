"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import type { QueryType, ScanDepth } from "@/shared/i18n/types";

const AI_ENGINES = [
  { id: "perplexity", label: "Perplexity", available: true },
  { id: "openai", label: "OpenAI", available: false },
  { id: "gemini", label: "Gemini", available: false },
] as const;

const QUERY_TYPES: QueryType[] = [
  "commercial",
  "comparative",
  "reputation",
  "informational",
];

const SCAN_DEPTHS: ScanDepth[] = ["quick", "standard", "deep"];

export function ScanForm() {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState(searchParams.get("domain") ?? "");
  const [engine, setEngine] = useState("perplexity");
  const [queryTypes, setQueryTypes] = useState<QueryType[]>([
    "commercial",
    "comparative",
    "reputation",
    "informational",
  ]);
  const [depth, setDepth] = useState<ScanDepth>("standard");
  const router = useRouter();
  const { t } = useDictionary();

  function toggleQueryType(type: QueryType) {
    setQueryTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim() || queryTypes.length === 0) return;

    const params = new URLSearchParams({
      domain: domain.trim(),
      engine,
      depth,
      types: queryTypes.join(","),
    });
    router.push(`/scan/loading?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={t.scan.placeholder}
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!domain.trim() || queryTypes.length === 0}
        >
          {t.scan.analyze}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* AI Engine */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t.scan.aiEngine}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {AI_ENGINES.map((e) => (
              <label
                key={e.id}
                className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition-colors ${
                  engine === e.id
                    ? "border-primary bg-primary/5"
                    : e.available
                      ? "border-border hover:border-primary/50"
                      : "cursor-not-allowed border-border opacity-50"
                }`}
              >
                <input
                  type="radio"
                  name="engine"
                  value={e.id}
                  checked={engine === e.id}
                  onChange={() => e.available && setEngine(e.id)}
                  disabled={!e.available}
                  className="sr-only"
                />
                <span className="font-medium">{e.label}</span>
                {!e.available && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Soon
                  </Badge>
                )}
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Query Types */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t.scan.queryTypes}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {QUERY_TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm transition-colors hover:border-primary/50"
              >
                <Checkbox
                  checked={queryTypes.includes(type)}
                  onCheckedChange={() => toggleQueryType(type)}
                />
                <div>
                  <span className="font-medium">{t.scan[type]}</span>
                  <p className="text-xs text-muted-foreground">
                    {t.scan[`${type}Desc`]}
                  </p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Depth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {t.scan.depth}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {SCAN_DEPTHS.map((d) => (
              <label
                key={d}
                className={`flex cursor-pointer items-center justify-between rounded-md border p-2 text-sm transition-colors ${
                  depth === d
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio"
                  name="depth"
                  value={d}
                  checked={depth === d}
                  onChange={() => setDepth(d)}
                  className="sr-only"
                />
                <span className="font-medium">{t.scan[d]}</span>
                <span className="text-xs text-muted-foreground">
                  {t.scan[`${d}Desc`]}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
