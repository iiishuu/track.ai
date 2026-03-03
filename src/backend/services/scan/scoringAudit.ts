import type { AIProvider, QueryResult, Sentiment } from "@/shared/types";

interface AuditCorrection {
  queryIndex: number;
  isPresent: boolean;
  sentiment: Sentiment;
  reason: string;
}

interface AuditResult {
  corrections: AuditCorrection[];
}

const VALID_SENTIMENTS: Sentiment[] = ["positive", "neutral", "negative"];

function buildAuditPrompt(
  domain: string,
  sector: string,
  deterministicScore: number,
  results: QueryResult[]
): string {
  const summary = results.map((r, i) => ({
    index: i,
    query: r.query,
    isPresent: r.isPresent,
    isSubstantive: r.isSubstantive ?? null,
    sentiment: r.sentiment,
    rank: r.rank,
    context: r.context?.slice(0, 200) || "",
    responsePreview: r.response?.slice(0, 300) || "",
  }));

  return `You are a quality auditor for an AI brand visibility analysis tool. Your job is to review the algorithm's output and find errors.

Domain analyzed: "${domain}"
Sector: "${sector}"
Algorithm's score: ${deterministicScore}/100

Here are the ${results.length} query results the algorithm produced:
${JSON.stringify(summary, null, 2)}

Your task: Review each query result and identify CORRECTIONS needed. The algorithm sometimes makes these mistakes:

1. **False present**: The AI response says "I don't know this brand", "no information found", "this site doesn't exist", or just echoes the brand name without any real knowledge — but isPresent is marked true. This is WRONG. If the AI clearly doesn't know the brand, isPresent must be false.

2. **Wrong sentiment**: A response saying "I have no information about this brand" should be "neutral", not "positive". A response warning about problems should be "negative", not "neutral".

3. **Brand confusion**: The AI confuses the brand with a completely different product/company (e.g. confusing "bloomrp.fr" with "BloomRPC", a gRPC tool). If the AI is talking about a DIFFERENT entity, isPresent should be false.

Return ONLY corrections needed (don't list queries that are already correct).

Response format — valid JSON only, no markdown:

{
  "corrections": [
    {
      "queryIndex": 3,
      "isPresent": false,
      "sentiment": "neutral",
      "reason": "AI says it has no information about this brand"
    }
  ]
}

If all results look correct, return: {"corrections": []}

Respond ONLY with valid JSON, nothing else.`;
}

export function parseAuditResponse(content: string): AuditResult {
  let cleaned = content.trim();
  cleaned = cleaned
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "");

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { corrections: [] };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    const fixedJson = jsonMatch[0]
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([[\{])\s*,/g, "$1");
    try {
      parsed = JSON.parse(fixedJson);
    } catch {
      return { corrections: [] };
    }
  }

  if (!Array.isArray(parsed.corrections)) {
    return { corrections: [] };
  }

  const corrections: AuditCorrection[] = parsed.corrections
    .filter(
      (c: Record<string, unknown>) =>
        typeof c.queryIndex === "number" &&
        typeof c.isPresent === "boolean" &&
        typeof c.sentiment === "string"
    )
    .map((c: Record<string, unknown>) => ({
      queryIndex: c.queryIndex as number,
      isPresent: c.isPresent as boolean,
      sentiment: VALID_SENTIMENTS.includes(c.sentiment as Sentiment)
        ? (c.sentiment as Sentiment)
        : "neutral",
      reason: String(c.reason ?? ""),
    }));

  return { corrections };
}

/**
 * Apply audit corrections to query results.
 * Returns a new array with corrections applied (does not mutate).
 */
export function applyAuditCorrections(
  results: QueryResult[],
  audit: AuditResult
): QueryResult[] {
  if (audit.corrections.length === 0) return results;

  const corrected = results.map((r) => ({ ...r }));

  for (const correction of audit.corrections) {
    const idx = correction.queryIndex;
    if (idx >= 0 && idx < corrected.length) {
      corrected[idx].isPresent = correction.isPresent;
      corrected[idx].sentiment = correction.sentiment;
      if (!correction.isPresent) {
        corrected[idx].isSubstantive = false;
        corrected[idx].rank = null;
      }
    }
  }

  return corrected;
}

/**
 * Run AI audit on the analysis results.
 * The AI acts as a quality auditor: it reviews the algorithm's output
 * and identifies false positives, wrong sentiments, brand confusion.
 * Returns corrected results. Falls back to original if audit fails.
 */
export async function auditResults(
  domain: string,
  sector: string,
  deterministicScore: number,
  results: QueryResult[],
  provider: AIProvider
): Promise<QueryResult[]> {
  try {
    const prompt = buildAuditPrompt(domain, sector, deterministicScore, results);
    const response = await provider.query({ query: prompt, domain });
    const audit = parseAuditResponse(response.content);
    return applyAuditCorrections(results, audit);
  } catch (error) {
    console.error("Scoring audit failed, using original results:", error);
    return results;
  }
}
