import type { AIProvider, QueryResult, Sentiment } from "@/shared/types";
import type { Locale } from "@/shared/i18n/types";

const LOCALE_INSTRUCTION: Record<Locale, string> = {
  en: "",
  fr: '\nIMPORTANT: The "context" value must be written in French.',
};

/** Common TLDs to strip when extracting brand name from domain */
const TLD_PATTERN = /\.(com|io|org|net|co|ai|dev|app|xyz|me|fr|de|uk|us|tech|tv|gg|live|stream|video|media|online|site|info|biz|co\.uk|com\.br|com\.au|ca|nl|be|ch|it|es|pt|jp|kr|in|ru|pl|se|no|fi|dk|at|cz|ro)$/i;

export function extractBrandName(domain: string): string {
  // "supabase.com" → "supabase", "twitch.tv" → "twitch", "my-app.io" → "my-app"
  return domain.replace(TLD_PATTERN, "").toLowerCase();
}

/** Patterns that indicate the AI doesn't actually know the brand */
const IGNORANT_PATTERNS = [
  /(?:i )?cannot find (?:any |sufficient )?information/i,
  /no (?:relevant |specific )?information (?:is )?(?:available|found)/i,
  /aucune information/i,
  /pas d'informations? (?:suffisantes?|spécifiques?|disponibles?)/i,
  /je n'ai pas d'informations?/i,
  /n'(?:existe|apparaît) pas/i,
  /doesn'?t (?:appear|exist|seem to exist)/i,
  /i don'?t have (?:sufficient |enough )?information/i,
  /n'apparaît pas parmi/i,
  /may be a (?:smaller|private|misspelling)/i,
  /could not (?:find|locate)/i,
  /no (?:results?|data|details?) (?:about|for|on|mentioning)/i,
  /il n'existe pas de site/i,
  /ne mentionne (?:pas|aucun)/i,
  /ce site n'apparaît pas/i,
  /I cannot find information about/i,
];

/**
 * Detects if an AI response is "ignorant" — the AI doesn't actually know the brand
 * and is just echoing the query name or saying it has no info.
 */
export function isIgnorantResponse(response: string): boolean {
  return IGNORANT_PATTERNS.some((pattern) => pattern.test(response));
}

/**
 * Local brand detection: checks if the brand or domain appears in the text.
 * This is a deterministic check that doesn't rely on the AI analysis.
 */
export function detectBrandInText(domain: string, text: string): boolean {
  const brand = extractBrandName(domain);
  const lower = text.toLowerCase();

  // Check for exact domain match
  if (lower.includes(domain.toLowerCase())) return true;

  // Check for brand name (with word boundary awareness)
  // For short brands (<=3 chars), require more context to avoid false positives
  if (brand.length <= 3) {
    const patterns = [
      domain.toLowerCase(),
      `${brand}.`,
      ` ${brand} `,
      `**${brand}**`,
      `"${brand}"`,
    ];
    return patterns.some((p) => lower.includes(p));
  }

  // For longer brand names, a simple includes is reliable
  if (lower.includes(brand)) return true;

  // Fallback: also check domain without dots as it might appear as a word
  // e.g. for "twitch.tv", also check for "twitch" in case TLD wasn't stripped
  const domainParts = domain.toLowerCase().split(".");
  if (domainParts.length > 0 && domainParts[0].length > 3) {
    return lower.includes(domainParts[0]);
  }

  return false;
}

const ANALYSIS_PROMPT = (domain: string, query: string, response: string, locale: Locale = "en") => {
  const brand = extractBrandName(domain);
  const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
  return `
You are analyzing whether the brand "${brand}" (domain: "${domain}") is mentioned in an AI-generated response.

The user query was: "${query}"

AI Response to analyze:
"""
${response}
"""

Provide your analysis in JSON format only (no markdown, no explanation):

{
  "isPresent": true/false,
  "rank": number or null,
  "sentiment": "positive" | "neutral" | "negative",
  "competitors": ["competitor1.com", "competitor2.com"],
  "context": "the exact sentence or phrase where the brand is mentioned, or empty string if not present"
}

Rules:
- "isPresent": true ONLY if the response demonstrates genuine knowledge about "${brand}" — actual facts, features, pricing, reviews, comparisons, or recommendations. If the response merely echoes the query term "${brand}" while saying it has no information, cannot find the brand, or the brand doesn't exist, then isPresent must be FALSE. The key question is: does the AI actually KNOW this brand?
- "rank": if the response contains a numbered list or ranking, what position is "${brand}" at? (1 = first, 2 = second, etc.). null if not ranked or not present.
- "sentiment": about "${brand}" specifically — "positive" if recommending/praising, "negative" if criticizing/warning, "neutral" if just factual/mentioned.
- "competitors": other brands/domains mentioned that compete with "${brand}" in the same space (max 5). Use domain format when possible.
- "context": copy the FIRST exact sentence containing "${brand}" or "${domain}". Empty string if not present.

IMPORTANT: Focus ONLY on whether "${brand}" / "${domain}" appears in the text. Do not get confused by other words that look similar.

Respond ONLY with valid JSON, nothing else.${LOCALE_INSTRUCTION[locale]}
`;
};

const VALID_SENTIMENTS: Sentiment[] = ["positive", "neutral", "negative"];

export function parseAnalysisResponse(
  content: string,
  query: string,
  rawResponse: string,
  sources: string[]
): QueryResult {
  // Strip markdown code fences if present
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Return a safe default instead of crashing the whole pipeline
    return {
      query,
      response: rawResponse,
      isPresent: false,
      rank: null,
      sentiment: "neutral",
      competitors: [],
      sources,
      context: "",
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    // Try to fix trailing commas
    const fixedJson = jsonMatch[0]
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([[\{])\s*,/g, "$1");
    try {
      parsed = JSON.parse(fixedJson);
    } catch {
      return {
        query,
        response: rawResponse,
        isPresent: false,
        rank: null,
        sentiment: "neutral",
        competitors: [],
        sources,
        context: "",
      };
    }
  }

  const sentiment: Sentiment = VALID_SENTIMENTS.includes(parsed.sentiment)
    ? parsed.sentiment
    : "neutral";

  return {
    query,
    response: rawResponse,
    isPresent: Boolean(parsed.isPresent),
    rank: typeof parsed.rank === "number" ? parsed.rank : null,
    sentiment,
    competitors: Array.isArray(parsed.competitors)
      ? parsed.competitors.map(String).slice(0, 5)
      : [],
    sources,
    context: String(parsed.context ?? ""),
  };
}

export async function analyzeResponse(
  domain: string,
  query: string,
  rawResponse: string,
  sources: string[],
  provider: AIProvider,
  locale: Locale = "en"
): Promise<QueryResult> {
  const analysis = await provider.query({
    query: ANALYSIS_PROMPT(domain, query, rawResponse, locale),
    domain,
  });

  const result = parseAnalysisResponse(analysis.content, query, rawResponse, sources);

  // Detect ignorant responses — AI doesn't actually know the brand
  const ignorant = isIgnorantResponse(rawResponse);

  if (ignorant) {
    // Force absent + neutral for responses where the AI clearly doesn't know the brand
    result.isPresent = false;
    result.isSubstantive = false;
    result.sentiment = "neutral";
    result.rank = null;
  } else {
    result.isSubstantive = result.isPresent ? true : undefined;

    // Safety net: if local detection finds the brand but the AI said absent, override
    // ONLY when the response is NOT ignorant (has real content about the brand)
    const locallyDetected = detectBrandInText(domain, rawResponse);
    if (locallyDetected && !result.isPresent) {
      result.isPresent = true;
      result.isSubstantive = true;
      if (!result.context) {
        // Extract first sentence containing the brand
        const brand = extractBrandName(domain);
        const sentences = rawResponse.split(/[.!?\n]+/);
        const match = sentences.find((s) =>
          s.toLowerCase().includes(brand) || s.toLowerCase().includes(domain.toLowerCase())
        );
        result.context = match?.trim() ?? "";
      }
    }
  }

  return result;
}
