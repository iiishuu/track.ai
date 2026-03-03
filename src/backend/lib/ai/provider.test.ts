import { describe, it, expect, vi, beforeEach } from "vitest";
import { PerplexityProvider, createAIProvider } from "./provider";

describe("PerplexityProvider", () => {
  const provider = new PerplexityProvider();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("has correct name", () => {
    expect(provider.name).toBe("perplexity");
  });

  it("sends correct request format", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "Test response about example.com" } }],
        citations: ["https://source1.com", "https://source2.com"],
      }),
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    const result = await provider.query({
      query: "What is example.com?",
      domain: "example.com",
    });

    expect(fetch).toHaveBeenCalledOnce();
    const call = vi.mocked(fetch).mock.calls[0];
    expect(call[0]).toBe("https://api.perplexity.ai/chat/completions");

    const body = JSON.parse((call[1] as RequestInit).body as string);
    expect(body.model).toBe("sonar");
    expect(body.messages[0].content).toBe("What is example.com?");

    expect(result.content).toBe("Test response about example.com");
    expect(result.sources).toEqual([
      "https://source1.com",
      "https://source2.com",
    ]);
    expect(result.provider).toBe("perplexity");
  });

  it("throws on non-retryable API error", async () => {
    const mockResponse = {
      ok: false,
      status: 403,
      statusText: "Forbidden",
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    await expect(
      provider.query({ query: "test", domain: "example.com" })
    ).rejects.toThrow("Perplexity API error: 403 Forbidden");
  });

  it("handles missing fields gracefully", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [], citations: undefined }),
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    const result = await provider.query({
      query: "test",
      domain: "example.com",
    });

    expect(result.content).toBe("");
    expect(result.sources).toEqual([]);
  });
});

describe("createAIProvider", () => {
  it("creates perplexity provider by default", () => {
    const provider = createAIProvider();
    expect(provider.name).toBe("perplexity");
  });

  it("creates perplexity provider explicitly", () => {
    const provider = createAIProvider("perplexity");
    expect(provider.name).toBe("perplexity");
  });

  it("throws for unknown provider", () => {
    expect(() => createAIProvider("unknown")).toThrow(
      "Unknown AI provider: unknown"
    );
  });
});
