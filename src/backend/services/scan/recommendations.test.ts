import { describe, it, expect, vi } from "vitest";
import type { AIProvider, Metrics, QueryResult } from "@/shared/types";
import type { RecommendationContext } from "./recommendations";
import {
  generateRecommendations,
  parseRecommendationsResponse,
} from "./recommendations";

function mockProvider(content: string): AIProvider {
  return {
    name: "mock",
    query: vi.fn().mockResolvedValue({
      content,
      sources: [],
      provider: "mock",
    }),
  };
}

const VALID_RECOMMENDATIONS = JSON.stringify([
  {
    title: "Improve content authority",
    description: "Create detailed, factual content that AI models can reference.",
    priority: "high",
  },
  {
    title: "Get listed on comparison sites",
    description: "Submit your product to review aggregators.",
    priority: "medium",
  },
  {
    title: "Monitor competitor mentions",
    description: "Track how competitors appear in AI responses.",
    priority: "low",
  },
]);

const SAMPLE_METRICS: Metrics = {
  visibilityScore: 45,
  citationRate: 0.3,
  averagePosition: 4,
  overallSentiment: "neutral",
  shareOfVoice: { "example.com": 30, "rival.com": 70 },
  influenceSources: ["wikipedia.org", "techcrunch.com"],
};

const SAMPLE_QUERY_RESULTS: QueryResult[] = [
  {
    query: "what is example.com?",
    response: "Example.com is a platform.",
    isPresent: true,
    rank: 2,
    sentiment: "positive",
    competitors: ["rival.com"],
    sources: ["https://wiki.com"],
    context: "Example.com is a platform",
  },
  {
    query: "best tools in SaaS",
    response: "The best tools are...",
    isPresent: false,
    rank: null,
    sentiment: "neutral",
    competitors: ["rival.com", "other.com"],
    sources: [],
    context: "",
  },
];

const SAMPLE_CONTEXT: RecommendationContext = {
  domain: "example.com",
  sector: "SaaS",
  competitors: ["rival.com", "other.com"],
  metrics: SAMPLE_METRICS,
  queryResults: SAMPLE_QUERY_RESULTS,
};

// ----- parseRecommendationsResponse -----

describe("parseRecommendationsResponse", () => {
  it("parses valid recommendations", () => {
    const result = parseRecommendationsResponse(VALID_RECOMMENDATIONS);
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Improve content authority");
    expect(result[0].priority).toBe("high");
  });

  it("extracts JSON from markdown-wrapped response", () => {
    const wrapped = `Here are the recommendations:\n\`\`\`json\n${VALID_RECOMMENDATIONS}\n\`\`\``;
    const result = parseRecommendationsResponse(wrapped);
    expect(result).toHaveLength(3);
  });

  it("caps at 5 recommendations", () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      title: `Rec ${i}`,
      description: `Desc ${i}`,
      priority: "medium",
    }));
    const result = parseRecommendationsResponse(JSON.stringify(many));
    expect(result).toHaveLength(5);
  });

  it("defaults invalid priority to medium", () => {
    const recs = JSON.stringify([
      { title: "Test", description: "Desc", priority: "critical" },
    ]);
    const result = parseRecommendationsResponse(recs);
    expect(result[0].priority).toBe("medium");
  });

  it("filters out entries without title or description", () => {
    const recs = JSON.stringify([
      { title: "Valid", description: "Has both" },
      { title: "No desc" },
      { description: "No title" },
    ]);
    const result = parseRecommendationsResponse(recs);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Valid");
  });

  it("returns fallback on non-array response", () => {
    const result = parseRecommendationsResponse('{"not": "array"}');
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("high");
  });

  it("returns fallback on plain text", () => {
    const result = parseRecommendationsResponse("no json here");
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("high");
  });
});

// ----- generateRecommendations -----

describe("generateRecommendations", () => {
  it("calls provider and returns parsed recommendations", async () => {
    const provider = mockProvider(VALID_RECOMMENDATIONS);
    const result = await generateRecommendations(
      SAMPLE_CONTEXT,
      provider
    );

    expect(provider.query).toHaveBeenCalledOnce();
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe("Improve content authority");
  });

  it("includes domain, sector, and metrics in the prompt", async () => {
    const provider = mockProvider(VALID_RECOMMENDATIONS);
    const ctx: RecommendationContext = {
      ...SAMPLE_CONTEXT,
      domain: "mysite.io",
      sector: "E-commerce",
    };
    await generateRecommendations(ctx, provider);

    const call = vi.mocked(provider.query).mock.calls[0][0];
    expect(call.query).toContain("mysite.io");
    expect(call.query).toContain("45/100");
    expect(call.query).toContain("E-commerce");
    expect(call.query).toContain("rival.com");
  });
});
