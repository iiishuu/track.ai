import { describe, it, expect, vi } from "vitest";
import type { AIProvider } from "@/shared/types";
import { discoverDomain, parseDiscoveryResponse } from "./discovery";

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

const VALID_RESPONSE = JSON.stringify({
  sector: "SaaS",
  competitors: ["competitor1.com", "competitor2.com", "competitor3.com"],
  queries: [
    "What is example.com?",
    "Is example.com reliable?",
    "example.com vs competitor1.com",
    "best SaaS tools",
    "example.com reviews",
    "top SaaS companies",
    "example.com pricing",
    "alternatives to example.com",
    "is example.com worth it",
    "example.com features",
  ],
});

// ----- parseDiscoveryResponse -----

describe("parseDiscoveryResponse", () => {
  it("parses valid JSON response", () => {
    const result = parseDiscoveryResponse(VALID_RESPONSE, 10);
    expect(result.sector).toBe("SaaS");
    expect(result.competitors).toHaveLength(3);
    expect(result.queries).toHaveLength(10);
  });

  it("extracts JSON from markdown-wrapped response", () => {
    const wrapped = `Here is the analysis:\n\`\`\`json\n${VALID_RESPONSE}\n\`\`\``;
    const result = parseDiscoveryResponse(wrapped, 10);
    expect(result.sector).toBe("SaaS");
  });

  it("caps competitors at 5", () => {
    const response = JSON.stringify({
      sector: "Tech",
      competitors: ["a.com", "b.com", "c.com", "d.com", "e.com", "f.com", "g.com"],
      queries: ["q1"],
    });
    const result = parseDiscoveryResponse(response, 10);
    expect(result.competitors).toHaveLength(5);
  });

  it("caps queries at requested count", () => {
    const queries = Array.from({ length: 15 }, (_, i) => `query ${i}`);
    const response = JSON.stringify({
      sector: "Tech",
      competitors: ["a.com"],
      queries,
    });
    const result = parseDiscoveryResponse(response, 10);
    expect(result.queries).toHaveLength(10);

    const resultDeep = parseDiscoveryResponse(response, 15);
    expect(resultDeep.queries).toHaveLength(15);
  });

  it("throws on non-JSON response", () => {
    expect(() => parseDiscoveryResponse("no json here", 10)).toThrow(
      "Discovery: no JSON found in response"
    );
  });

  it("throws on invalid JSON structure", () => {
    expect(() => parseDiscoveryResponse('{"foo": "bar"}', 10)).toThrow(
      "Discovery: invalid JSON structure"
    );
  });
});

// ----- discoverDomain -----

describe("discoverDomain", () => {
  it("calls provider and returns parsed result", async () => {
    const provider = mockProvider(VALID_RESPONSE);
    const result = await discoverDomain("example.com", provider);

    expect(provider.query).toHaveBeenCalledOnce();
    expect(result.sector).toBe("SaaS");
    expect(result.competitors.length).toBeGreaterThan(0);
    expect(result.queries.length).toBeGreaterThan(0);
  });

  it("passes domain in the query request", async () => {
    const provider = mockProvider(VALID_RESPONSE);
    await discoverDomain("mysite.io", provider);

    const call = vi.mocked(provider.query).mock.calls[0][0];
    expect(call.domain).toBe("mysite.io");
    expect(call.query).toContain("mysite.io");
  });

  it("throws when provider returns invalid content", async () => {
    const provider = mockProvider("not json");
    await expect(discoverDomain("example.com", provider)).rejects.toThrow();
  });
});
