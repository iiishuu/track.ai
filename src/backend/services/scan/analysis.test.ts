import { describe, it, expect, vi } from "vitest";
import type { AIProvider } from "@/shared/types";
import { analyzeResponse, parseAnalysisResponse, extractBrandName } from "./analysis";

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
