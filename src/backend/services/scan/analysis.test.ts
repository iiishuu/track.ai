import { describe, it, expect, vi } from "vitest";
import type { AIProvider } from "@/shared/types";
import { analyzeResponse, parseAnalysisResponse, extractBrandName, isIgnorantResponse, detectBrandInText, isOffTopicResponse, computeMentionOrderRank } from "./analysis";

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

const VALID_ANALYSIS = JSON.stringify({
  isPresent: true,
  rank: 2,
  sentiment: "positive",
  competitors: ["rival.com", "other.com"],
  context: "Example.com is a great tool for...",
});

// ----- extractBrandName -----

describe("extractBrandName", () => {
  it("extracts brand from .com domain", () => {
    expect(extractBrandName("supabase.com")).toBe("supabase");
  });

  it("extracts brand from .io domain", () => {
    expect(extractBrandName("mysite.io")).toBe("mysite");
  });

  it("extracts brand from .ai domain", () => {
    expect(extractBrandName("perplexity.ai")).toBe("perplexity");
  });

  it("extracts brand from .tv domain", () => {
    expect(extractBrandName("twitch.tv")).toBe("twitch");
  });

  it("extracts brand from .gg domain", () => {
    expect(extractBrandName("discord.gg")).toBe("discord");
  });

  it("extracts brand from .live domain", () => {
    expect(extractBrandName("trovo.live")).toBe("trovo");
  });

  it("handles hyphenated domains", () => {
    expect(extractBrandName("my-cool-app.dev")).toBe("my-cool-app");
  });

  it("handles unknown TLD by keeping full string", () => {
    expect(extractBrandName("example.unknown")).toBe("example.unknown");
  });
});

// ----- parseAnalysisResponse -----

describe("parseAnalysisResponse", () => {
  it("parses valid analysis response", () => {
    const result = parseAnalysisResponse(
      VALID_ANALYSIS,
      "test query",
      "raw response text",
      ["https://source.com"]
    );

    expect(result.isPresent).toBe(true);
    expect(result.rank).toBe(2);
    expect(result.sentiment).toBe("positive");
    expect(result.competitors).toEqual(["rival.com", "other.com"]);
    expect(result.context).toBe("Example.com is a great tool for...");
    expect(result.query).toBe("test query");
    expect(result.response).toBe("raw response text");
    expect(result.sources).toEqual(["https://source.com"]);
  });

  it("handles not-present domain", () => {
    const response = JSON.stringify({
      isPresent: false,
      rank: null,
      sentiment: "neutral",
      competitors: ["other.com"],
      context: "",
    });
    const result = parseAnalysisResponse(response, "q", "resp", []);
    expect(result.isPresent).toBe(false);
    expect(result.rank).toBeNull();
    expect(result.context).toBe("");
  });

  it("defaults invalid sentiment to neutral", () => {
    const response = JSON.stringify({
      isPresent: true,
      rank: 1,
      sentiment: "invalid_value",
      competitors: [],
      context: "test",
    });
    const result = parseAnalysisResponse(response, "q", "resp", []);
    expect(result.sentiment).toBe("neutral");
  });

  it("caps competitors at 5", () => {
    const response = JSON.stringify({
      isPresent: true,
      rank: 1,
      sentiment: "positive",
      competitors: ["a", "b", "c", "d", "e", "f", "g"],
      context: "test",
    });
    const result = parseAnalysisResponse(response, "q", "resp", []);
    expect(result.competitors).toHaveLength(5);
  });

  it("handles missing competitors array", () => {
    const response = JSON.stringify({
      isPresent: true,
      rank: 1,
      sentiment: "positive",
      context: "test",
    });
    const result = parseAnalysisResponse(response, "q", "resp", []);
    expect(result.competitors).toEqual([]);
  });

  it("returns safe defaults on non-JSON response", () => {
    const result = parseAnalysisResponse("not json", "q", "resp", []);
    expect(result.isPresent).toBe(false);
    expect(result.sentiment).toBe("neutral");
    expect(result.rank).toBeNull();
    expect(result.competitors).toEqual([]);
  });

  it("extracts JSON from markdown-wrapped response", () => {
    const wrapped = `\`\`\`json\n${VALID_ANALYSIS}\n\`\`\``;
    const result = parseAnalysisResponse(wrapped, "q", "resp", []);
    expect(result.isPresent).toBe(true);
  });
});

// ----- analyzeResponse -----

describe("analyzeResponse", () => {
  it("calls provider and returns parsed result", async () => {
    const provider = mockProvider(VALID_ANALYSIS);
    const result = await analyzeResponse(
      "example.com",
      "what is example.com?",
      "Example.com is a platform...",
      ["https://wiki.com"],
      provider
    );

    expect(provider.query).toHaveBeenCalledOnce();
    expect(result.isPresent).toBe(true);
    expect(result.query).toBe("what is example.com?");
    expect(result.response).toBe("Example.com is a platform...");
    expect(result.sources).toEqual(["https://wiki.com"]);
  });

  it("includes domain in the analysis prompt", async () => {
    const provider = mockProvider(VALID_ANALYSIS);
    await analyzeResponse("mysite.io", "q", "resp", [], provider);

    const call = vi.mocked(provider.query).mock.calls[0][0];
    expect(call.query).toContain("mysite.io");
  });
});

// ----- isIgnorantResponse -----

describe("isIgnorantResponse", () => {
  it("detects English 'cannot find information'", () => {
    expect(isIgnorantResponse("I cannot find information about hedarp.fr")).toBe(true);
  });

  it("detects English 'no relevant information'", () => {
    expect(isIgnorantResponse("No relevant information is available in the provided search results.")).toBe(true);
  });

  it("detects French 'aucune information'", () => {
    expect(isIgnorantResponse("Aucune information spécifique sur hedarp.fr n'est disponible.")).toBe(true);
  });

  it("detects French 'n'existe pas'", () => {
    expect(isIgnorantResponse("Il n'existe pas de site officiel nommé hedarp.fr.")).toBe(true);
  });

  it("detects French 'pas d'informations suffisantes'", () => {
    expect(isIgnorantResponse("Je n'ai pas d'informations suffisantes pour répondre.")).toBe(true);
  });

  it("detects 'I don't have sufficient information'", () => {
    expect(isIgnorantResponse("I don't have sufficient information in my search results.")).toBe(true);
  });

  it("detects 'n'apparaît pas parmi'", () => {
    expect(isIgnorantResponse("ce site n'apparaît pas parmi les comparateurs populaires.")).toBe(true);
  });

  it("detects 'may be a smaller'", () => {
    expect(isIgnorantResponse("This may be a smaller community site or private project.")).toBe(true);
  });

  it("returns false for substantive responses", () => {
    expect(isIgnorantResponse("Netflix is the world's leading streaming platform with over 200M subscribers.")).toBe(false);
  });

  it("returns false for responses with real comparisons", () => {
    expect(isIgnorantResponse("Netflix offers a larger catalog than Disney+, with original series like Stranger Things.")).toBe(false);
  });

  it("returns false for factual responses about pricing", () => {
    expect(isIgnorantResponse("The standard plan costs 13.99€/month and includes HD streaming.")).toBe(false);
  });
});

// ----- analyzeResponse with ignorant response -----

describe("analyzeResponse with ignorant responses", () => {
  it("marks ignorant response as not present and not substantive", async () => {
    const provider = mockProvider(JSON.stringify({
      isPresent: true,
      rank: null,
      sentiment: "neutral",
      competitors: [],
      context: "hedarp",
    }));
    const result = await analyzeResponse(
      "hedarp.fr",
      "est-ce que hedarp est fiable?",
      "Je n'ai pas d'informations sur hedarp. Ce site ne semble pas être référencé.",
      [],
      provider
    );

    expect(result.isPresent).toBe(false);
    expect(result.isSubstantive).toBe(false);
    expect(result.sentiment).toBe("neutral");
  });

  it("keeps substantive response as present", async () => {
    const provider = mockProvider(JSON.stringify({
      isPresent: true,
      rank: 2,
      sentiment: "positive",
      competitors: ["disneyplus.com"],
      context: "Netflix is the leading streaming platform",
    }));
    const result = await analyzeResponse(
      "netflix.com",
      "best streaming platforms",
      "Netflix is the leading streaming platform with vast content library. Disney+ comes second.",
      ["source.com"],
      provider
    );

    expect(result.isPresent).toBe(true);
    expect(result.isSubstantive).toBe(true);
  });
});

// ----- isOffTopicResponse -----

describe("isOffTopicResponse", () => {
  it("detects Avis car rental confusion in YouTube query", () => {
    const response = "Avis car rental company reviews and comparisons for 2026 are available in several YouTube videos, primarily focusing on head-to-head matchups with competitors like National, Enterprise, Budget, and Thrifty.";
    expect(isOffTopicResponse("youtube.com", "youtube.com avis 2026", response)).toBe(true);
  });

  it("detects car rental content when domain is not a car brand", () => {
    const response = "Location de voiture comparatif 2026: Avis rental company vs Enterprise vs Budget. Les véhicules disponibles incluent...";
    expect(isOffTopicResponse("stripe.com", "stripe.com avis", response)).toBe(true);
  });

  it("returns false for legitimate brand reviews", () => {
    const response = "YouTube Premium is worth it in 2026. Users report better experience without ads. The platform continues to dominate video sharing.";
    expect(isOffTopicResponse("youtube.com", "youtube.com avis 2026", response)).toBe(false);
  });

  it("returns false for normal responses without ambiguity", () => {
    const response = "Stripe is a payment processing platform used by millions of businesses worldwide.";
    expect(isOffTopicResponse("stripe.com", "what is stripe.com?", response)).toBe(false);
  });

  it("detects movie/car reviews when query is about domain reviews", () => {
    const response = "Here are the top 2026 movie reviews and car reviews available on various platforms.";
    expect(isOffTopicResponse("youtube.com", "youtube.com reviews 2026", response)).toBe(true);
  });

  it("returns false when review response is actually about the brand", () => {
    const response = "YouTube review of its 2026 features: the platform added AI-powered recommendations and better creator tools.";
    expect(isOffTopicResponse("youtube.com", "youtube.com reviews 2026", response)).toBe(false);
  });
});

// ----- computeMentionOrderRank -----

describe("computeMentionOrderRank", () => {
  it("returns rank 1 when brand is mentioned first", () => {
    const response = "YouTube is the leading platform. Vimeo offers professional tools. TikTok focuses on short-form.";
    const rank = computeMentionOrderRank("youtube.com", response, ["vimeo.com", "tiktok.com"]);
    expect(rank).toBe(1);
  });

  it("returns rank 2 when brand is mentioned second", () => {
    const response = "Vimeo offers premium quality. YouTube has the largest audience. TikTok is growing fast.";
    const rank = computeMentionOrderRank("youtube.com", response, ["vimeo.com", "tiktok.com"]);
    expect(rank).toBe(2);
  });

  it("returns rank 3 when mentioned third", () => {
    const response = "PayPal dominates online payments. Square is great for POS. Stripe offers developer-friendly APIs.";
    const rank = computeMentionOrderRank("stripe.com", response, ["paypal.com", "square.com"]);
    expect(rank).toBe(3);
  });

  it("returns null when brand is not in response", () => {
    const response = "Vimeo and TikTok are popular platforms for video.";
    const rank = computeMentionOrderRank("youtube.com", response, ["vimeo.com", "tiktok.com"]);
    expect(rank).toBeNull();
  });

  it("returns null when brand is the only one mentioned (no competition context)", () => {
    const response = "YouTube is a great platform for sharing videos with the world.";
    const rank = computeMentionOrderRank("youtube.com", response, ["vimeo.com"]);
    expect(rank).toBeNull();
  });

  it("handles case-insensitive matching", () => {
    const response = "STRIPE is used by millions. PAYPAL is the largest.";
    const rank = computeMentionOrderRank("stripe.com", response, ["paypal.com"]);
    expect(rank).toBe(1);
  });

  it("handles empty competitors list", () => {
    const response = "YouTube is a video platform.";
    const rank = computeMentionOrderRank("youtube.com", response, []);
    expect(rank).toBeNull();
  });
});
