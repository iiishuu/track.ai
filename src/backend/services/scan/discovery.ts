import type { AIProvider, DiscoveryResult } from "@/shared/types";
import type { Locale, QueryType } from "@/shared/i18n/types";

const LOCALE_INSTRUCTION: Record<Locale, string> = {
  en: "",
  fr: '\nIMPORTANT: The "sector" value and the "queries" array must be written in French.',
};

const QUERY_TYPE_INSTRUCTIONS: Record<QueryType, string> = {
  commercial: `Commercial/transactional queries: queries a user would ask when looking for a product or service in this sector. The brand name or domain MUST appear naturally in at least half of these queries. Examples: "best [specific product/service the brand offers]", "should I use {domain}?", "{domain} pricing", "where to [action related to brand's core service]"`,
  comparative: `Comparison queries: head-to-head comparisons and alternative searches. ALWAYS include the domain. Examples: "{domain} vs [specific real competitor]", "best alternatives to {domain}", "[competitor] vs {domain} comparison"`,
  reputation: `Reputation queries: what users ask to evaluate the brand. ALWAYS include the domain or brand name. Examples: "what do people think of {domain}?", "{domain} reviews [current year]", "is {domain} good?", "problems with {domain}". IMPORTANT: Never use the standalone word "avis" in French queries — use "opinions sur", "retours sur", or "que pensez-vous de" instead, to avoid confusion with the car rental brand Avis.`,
  informational: `Informational queries: general knowledge questions about the brand or its sector where the brand could naturally be mentioned. Examples: "what is {domain}?", "how does {domain} work?", "who owns {domain}?", "history of [brand]"`,
};

function buildDiscoveryPrompt(
  domain: string,
  locale: Locale,
  queryCount: number,
  queryTypes: QueryType[]
): string {
  const typeInstructions = queryTypes
    .map((type) =>
      QUERY_TYPE_INSTRUCTIONS[type].replaceAll("{domain}", domain)
    )
    .join("\n  - ");

  const brand = domain.replace(/\.(com|io|org|net|co|ai|dev|app|xyz|me|fr|de|uk|us|tech|tv|gg|live|stream|video|media|online|site|info|biz|co\.uk|com\.br|com\.au|ca|nl|be|ch|it|es|pt|jp|kr|in|ru|pl|se|no|fi|dk|at|cz|ro)$/i, "").toLowerCase();

  return `Analyze the website "${domain}" (brand name: "${brand}") and provide the following information in JSON format only (no markdown, no explanation):

{
  "sector": "the specific business sector/industry of this website (e.g. 'e-commerce', 'SaaS', 'video sharing platform', 'fintech', 'social media')",
  "competitors": ["competitor1.com", "competitor2.com", "competitor3.com"],
  "queries": [
    "strategic question 1",
    "strategic question 2",
    "..."
  ]
}

Rules:
- "sector" must be a specific, accurate label describing what "${domain}" actually does (NOT a broader industry it's tangentially related to)
- "competitors" must be 3-5 real DIRECT competitor domain names (companies offering the same core service/product as "${domain}")
- "queries" must be exactly ${queryCount} diverse questions that a real user might ask an AI assistant (like ChatGPT, Perplexity, or Gemini). The goal is to test whether AI engines mention "${brand}" / "${domain}" in their answers.

CRITICAL QUERY RULES:
- At least 40% of queries MUST explicitly contain "${domain}" or "${brand}" (e.g. "${domain} vs [competitor]", "is ${brand} good?")
- The remaining queries should be sector-specific questions where "${brand}" would naturally be expected in the answer
- Queries must be realistic — things actual humans type into AI assistants
- Do NOT generate overly generic queries that could apply to any industry
- Each query must be specific enough that the AI response would meaningfully test whether "${brand}" is visible

Distribute queries across these types:
  - ${typeInstructions}

Respond ONLY with valid JSON, nothing else.${LOCALE_INSTRUCTION[locale]}`;
}

export function parseDiscoveryResponse(
  content: string,
  queryCount: number
): DiscoveryResult {
  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `Discovery: no JSON found in response. Raw content (first 500 chars): ${content.slice(0, 500)}`
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    // Try to fix common JSON issues: trailing commas
    const fixedJson = jsonMatch[0]
      .replace(/,\s*([}\]])/g, "$1")
      .replace(/([\[{])\s*,/g, "$1");
    parsed = JSON.parse(fixedJson);
  }

  if (
    !parsed.sector ||
    !Array.isArray(parsed.competitors) ||
    !Array.isArray(parsed.queries)
  ) {
    throw new Error("Discovery: invalid JSON structure");
  }

  return {
    sector: String(parsed.sector),
    competitors: parsed.competitors.map(String).slice(0, 5),
    queries: parsed.queries.map(String).slice(0, queryCount),
  };
}

const DISCOVERY_MAX_RETRIES = 2;

export async function discoverDomain(
  domain: string,
  provider: AIProvider,
  locale: Locale = "en",
  queryCount: number = 10,
  queryTypes: QueryType[] = [
    "commercial",
    "comparative",
    "reputation",
    "informational",
  ]
): Promise<DiscoveryResult> {
  const prompt = buildDiscoveryPrompt(domain, locale, queryCount, queryTypes);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= DISCOVERY_MAX_RETRIES; attempt++) {
    try {
      const response = await provider.query({ query: prompt, domain });
      return parseDiscoveryResponse(response.content, queryCount);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < DISCOVERY_MAX_RETRIES) {
        // Wait before retry (1s, 2s)
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError ?? new Error("Discovery failed after retries");
}
