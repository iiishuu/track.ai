import type { AIProvider, Metrics, QueryResult, Recommendation } from "@/shared/types";
import type { Locale } from "@/shared/i18n/types";

const LOCALE_INSTRUCTION: Record<Locale, string> = {
  en: "",
  fr: '\nIMPORTANT: Write the "title" and "description" values in French.',
};

export interface RecommendationContext {
  domain: string;
  sector: string;
  competitors: string[];
  metrics: Metrics;
  queryResults: QueryResult[];
}

function buildQuerySummary(results: QueryResult[]): string {
  const present = results.filter((r) => r.isPresent);
  const absent = results.filter((r) => !r.isPresent);

  const lines: string[] = [];

  if (absent.length > 0) {
    lines.push(`Queries where the brand is NOT mentioned (${absent.length}/${results.length}):`);
    for (const r of absent) {
      lines.push(`  - "${r.query}"`);
    }
  }

  if (present.length > 0) {
    const negative = present.filter((r) => r.sentiment === "negative");
    if (negative.length > 0) {
      lines.push(`Queries with negative sentiment:`);
      for (const r of negative) {
        lines.push(`  - "${r.query}" → ${r.context.slice(0, 120)}`);
      }
    }

    const lowRank = present.filter((r) => r.rank !== null && r.rank > 3);
    if (lowRank.length > 0) {
      lines.push(`Queries where brand ranks below #3:`);
      for (const r of lowRank) {
        lines.push(`  - "${r.query}" → rank #${r.rank}`);
      }
    }
  }

  if (lines.length === 0) {
    lines.push("Brand is mentioned in all queries with good position and positive/neutral sentiment.");
  }

  return lines.join("\n");
}

const RECOMMENDATIONS_PROMPT = (ctx: RecommendationContext, locale: Locale = "en") => `
You are an AI visibility strategist. You help brands improve how AI search engines (ChatGPT, Perplexity, Gemini) talk about them.

Brand: "${ctx.domain}"
Sector: ${ctx.sector}
Top competitors: ${ctx.competitors.join(", ") || "none identified"}

Metrics:
- Visibility Score: ${ctx.metrics.visibilityScore}/100
- Citation Rate: ${Math.round(ctx.metrics.citationRate * 100)}% (mentioned in ${Math.round(ctx.metrics.citationRate * ctx.queryResults.length)}/${ctx.queryResults.length} AI responses)
- Average Position: ${ctx.metrics.averagePosition ?? "not ranked"} (when mentioned in a list)
- Overall Sentiment: ${ctx.metrics.overallSentiment}
- Share of Voice vs competitors: ${JSON.stringify(ctx.metrics.shareOfVoice)}

Analysis of weak points:
${buildQuerySummary(ctx.queryResults)}

Provide 3 to 5 actionable recommendations in JSON format only.

[
  {
    "title": "Short action title (5-10 words)",
    "description": "What to do concretely and why it will improve AI visibility. Be specific to this brand and sector.",
    "priority": "high" | "medium" | "low"
  }
]

Rules:
- Sort by priority (high first)
- Focus ONLY on improving AI visibility (how LLMs like ChatGPT/Perplexity/Gemini reference and recommend this brand)
- Do NOT recommend traditional SEO tactics (backlinks, meta tags, keyword density)
- Do NOT recommend things the brand clearly already does well (based on the metrics above)
- Each recommendation must be specific to "${ctx.domain}" in the "${ctx.sector}" sector — no generic advice
- If the score is already very high (>85), focus on maintaining leadership and addressing the few remaining weak points
- Fewer strong recommendations are better than many weak ones

Respond ONLY with valid JSON array, nothing else.${LOCALE_INSTRUCTION[locale]}
`;

export function parseRecommendationsResponse(content: string): Recommendation[] {
  // Strip markdown code fences if present
  let cleaned = content.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");

  const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return [
      {
        title: "Improve brand visibility on AI engines",
        description: "Create structured, authoritative content that AI models can easily reference when answering questions about your sector.",
        priority: "high",
      },
    ];
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
      return [
        {
          title: "Improve brand visibility on AI engines",
          description: "Create structured, authoritative content that AI models can easily reference when answering questions about your sector.",
          priority: "high",
        },
      ];
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Recommendations: response is not an array");
  }

  const validPriorities = ["high", "medium", "low"] as const;

  return parsed
    .filter(
      (r: Record<string, unknown>) =>
        typeof r.title === "string" && typeof r.description === "string"
    )
    .slice(0, 5)
    .map((r: Record<string, unknown>) => ({
      title: String(r.title),
      description: String(r.description),
      priority: validPriorities.includes(r.priority as "high" | "medium" | "low")
        ? (r.priority as "high" | "medium" | "low")
        : "medium",
    }));
}

export async function generateRecommendations(
  ctx: RecommendationContext,
  provider: AIProvider,
  locale: Locale = "en"
): Promise<Recommendation[]> {
  const response = await provider.query({
    query: RECOMMENDATIONS_PROMPT(ctx, locale),
    domain: ctx.domain,
  });

  return parseRecommendationsResponse(response.content);
}
