"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Calendar, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/frontend/components/ui/tabs";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import type { HistoryEntry } from "@/shared/types";
import type { QueryType, ScanDepth } from "@/shared/i18n/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type SlotMode = "existing" | "new";

export interface SlotState {
  mode: SlotMode;
  selectedEntry: HistoryEntry | null;
  domain: string;
  depth: ScanDepth;
  queryTypes: QueryType[];
}

export type SlotConfig =
  | { mode: "existing"; reportId: string; domain: string }
  | { mode: "new"; domain: string; depth: ScanDepth; queryTypes: QueryType[] };

export const DEFAULT_SLOT: SlotState = {
  mode: "new",
  selectedEntry: null,
  domain: "",
  depth: "standard",
  queryTypes: ["commercial", "comparative", "reputation", "informational"],
};

export function slotToConfig(slot: SlotState): SlotConfig | null {
  if (slot.mode === "existing") {
    if (!slot.selectedEntry) return null;
    return {
      mode: "existing",
      reportId: slot.selectedEntry.reportId,
      domain: slot.selectedEntry.domain,
    };
  }
  if (!slot.domain.trim()) return null;
  if (slot.queryTypes.length === 0) return null;
  return {
    mode: "new",
    domain: slot.domain.trim(),
    depth: slot.depth,
    queryTypes: slot.queryTypes,
  };
}

// ── Constants ────────────────────────────────────────────────────────────────

const QUERY_TYPES: QueryType[] = [
  "commercial",
  "comparative",
  "reputation",
  "informational",
];

const SCAN_DEPTHS: ScanDepth[] = ["quick", "standard", "deep"];

// ── HistorySearch ────────────────────────────────────────────────────────────

function HistorySearch({
  onSelect,
  selectedEntry,
}: {
  onSelect: (entry: HistoryEntry) => void;
  selectedEntry: HistoryEntry | null;
}) {
  const { t, locale } = useDictionary();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const url = query
          ? `/api/history?domain=${encodeURIComponent(query)}`
          : "/api/history";
        const res = await fetch(url);
        if (res.ok) {
          const data: HistoryEntry[] = await res.json();
          setResults(data);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function scoreColor(score: number): string {
    if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 40) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-600 border-red-200";
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      { day: "numeric", month: "short", year: "numeric" }
    );
  }

  // If an entry is selected, show it as a compact selected card
  if (selectedEntry) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">
            {selectedEntry.domain}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-bold ${scoreColor(selectedEntry.score)}`}
          >
            {selectedEntry.score}/100
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {formatDate(selectedEntry.createdAt)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelect(null as unknown as HistoryEntry)}
          className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t.compare.searchHistory}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 placeholder:text-gray-400"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.length === 0 && !loading && (
            <p className="px-3 py-4 text-center text-xs text-gray-400">
              {t.compare.noHistory}
            </p>
          )}
          {results.map((entry) => (
            <button
              key={entry.reportId}
              type="button"
              onClick={() => {
                onSelect(entry);
                setOpen(false);
                setQuery("");
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {entry.domain}
                </span>
                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${scoreColor(entry.score)}`}
                >
                  {entry.score}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {formatDate(entry.createdAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ScanParamsSelector ───────────────────────────────────────────────────────

function ScanParamsSelector({
  depth,
  onDepthChange,
  queryTypes,
  onQueryTypesChange,
}: {
  depth: ScanDepth;
  onDepthChange: (d: ScanDepth) => void;
  queryTypes: QueryType[];
  onQueryTypesChange: (types: QueryType[]) => void;
}) {
  const { t } = useDictionary();

  function toggleQueryType(type: QueryType) {
    const next = queryTypes.includes(type)
      ? queryTypes.filter((q) => q !== type)
      : [...queryTypes, type];
    onQueryTypesChange(next);
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Depth */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t.scan.depth}
        </p>
        <div className="flex gap-1.5">
          {SCAN_DEPTHS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDepthChange(d)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                depth === d
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {t.scan[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Query types */}
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t.scan.queryTypes}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {QUERY_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1.5 text-xs transition-colors hover:border-gray-300"
            >
              <Checkbox
                checked={queryTypes.includes(type)}
                onCheckedChange={() => toggleQueryType(type)}
              />
              <span className="font-medium text-gray-700">{t.scan[type]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DomainSlot ───────────────────────────────────────────────────────────────

export function DomainSlot({
  label,
  config,
  onChange,
}: {
  label: string;
  config: SlotState;
  onChange: (update: Partial<SlotState>) => void;
}) {
  const { t } = useDictionary();

  return (
    <div className="flex-1 space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </label>

      <Tabs
        value={config.mode}
        onValueChange={(v) => onChange({ mode: v as SlotMode })}
      >
        <TabsList className="w-full">
          <TabsTrigger value="existing" className="text-xs">
            <BarChart3 className="mr-1 h-3 w-3" />
            {t.compare.existingScan}
          </TabsTrigger>
          <TabsTrigger value="new" className="text-xs">
            {t.compare.newScan}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing">
          <HistorySearch
            onSelect={(entry) => onChange({ selectedEntry: entry })}
            selectedEntry={config.selectedEntry}
          />
        </TabsContent>

        <TabsContent value="new">
          <input
            value={config.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
            placeholder={t.compare.placeholder}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition-colors focus:border-gray-400 placeholder:font-normal placeholder:text-gray-400"
          />
          <ScanParamsSelector
            depth={config.depth}
            onDepthChange={(d) => onChange({ depth: d })}
            queryTypes={config.queryTypes}
            onQueryTypesChange={(types) => onChange({ queryTypes: types })}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
