import { describe, it, expect } from "vitest";
import type { QueryResult } from "@/shared/types";
import { parseAuditResponse, applyAuditCorrections } from "./scoringAudit";

function makeResult(overrides: Partial<QueryResult> = {}): QueryResult {
  return {
    query: "test query",
    response: "test response",
    isPresent: true,
    rank: 1,
    sentiment: "positive",
    competitors: [],
    sources: ["https://source.com"],
    context: "mentioned in context",
    ...overrides,
  };
}

// ----- parseAuditResponse -----

describe("parseAuditResponse", () => {
  it("parses valid audit response with corrections", () => {
    const content = JSON.stringify({
      corrections: [
        {
          queryIndex: 3,
          isPresent: false,
          sentiment: "neutral",
          reason: "AI says no info",
        },
        {
          queryIndex: 7,
          isPresent: false,
          sentiment: "negative",
          reason: "Brand doesn't exist",
        },
      ],
    });
    const result = parseAuditResponse(content);
    expect(result.corrections).toHaveLength(2);
    expect(result.corrections[0].queryIndex).toBe(3);
    expect(result.corrections[0].isPresent).toBe(false);
    expect(result.corrections[1].sentiment).toBe("negative");
  });

  it("parses empty corrections", () => {
    const content = JSON.stringify({ corrections: [] });
    const result = parseAuditResponse(content);
    expect(result.corrections).toHaveLength(0);
  });

  it("returns empty corrections on invalid JSON", () => {
    const result = parseAuditResponse("not json at all");
    expect(result.corrections).toHaveLength(0);
  });

  it("returns empty corrections on missing corrections field", () => {
    const content = JSON.stringify({ something: "else" });
    const result = parseAuditResponse(content);
    expect(result.corrections).toHaveLength(0);
  });

  it("handles markdown-wrapped response", () => {
    const content = `\`\`\`json\n${JSON.stringify({
      corrections: [
        { queryIndex: 0, isPresent: false, sentiment: "neutral", reason: "test" },
      ],
    })}\n\`\`\``;
    const result = parseAuditResponse(content);
    expect(result.corrections).toHaveLength(1);
  });

  it("filters out invalid correction entries", () => {
    const content = JSON.stringify({
      corrections: [
        { queryIndex: 0, isPresent: false, sentiment: "neutral", reason: "ok" },
        { queryIndex: "not a number", isPresent: true, sentiment: "positive" },
        { queryIndex: 1, isPresent: "not bool", sentiment: "positive" },
      ],
    });
    const result = parseAuditResponse(content);
    expect(result.corrections).toHaveLength(1);
  });

  it("defaults invalid sentiment to neutral", () => {
    const content = JSON.stringify({
      corrections: [
        { queryIndex: 0, isPresent: false, sentiment: "angry", reason: "test" },
      ],
    });
    const result = parseAuditResponse(content);
    expect(result.corrections[0].sentiment).toBe("neutral");
  });
});

// ----- applyAuditCorrections -----

describe("applyAuditCorrections", () => {
  it("applies corrections to matching indices", () => {
    const results = [
      makeResult({ isPresent: true, sentiment: "positive" }),
      makeResult({ isPresent: true, sentiment: "positive" }),
      makeResult({ isPresent: true, sentiment: "neutral" }),
    ];
    const audit = {
      corrections: [
        { queryIndex: 0, isPresent: false, sentiment: "neutral" as const, reason: "no info" },
        { queryIndex: 2, isPresent: false, sentiment: "negative" as const, reason: "site doesn't exist" },
      ],
    };

    const corrected = applyAuditCorrections(results, audit);
    expect(corrected[0].isPresent).toBe(false);
    expect(corrected[0].sentiment).toBe("neutral");
    expect(corrected[0].isSubstantive).toBe(false);
    expect(corrected[0].rank).toBeNull();
    expect(corrected[1].isPresent).toBe(true); // unchanged
    expect(corrected[2].isPresent).toBe(false);
    expect(corrected[2].sentiment).toBe("negative");
  });

  it("does not mutate original results", () => {
    const results = [makeResult({ isPresent: true, sentiment: "positive" })];
    const audit = {
      corrections: [
        { queryIndex: 0, isPresent: false, sentiment: "neutral" as const, reason: "no info" },
      ],
    };

    const corrected = applyAuditCorrections(results, audit);
    expect(results[0].isPresent).toBe(true); // original unchanged
    expect(corrected[0].isPresent).toBe(false);
  });

  it("returns original results when no corrections", () => {
    const results = [makeResult(), makeResult()];
    const audit = { corrections: [] };

    const corrected = applyAuditCorrections(results, audit);
    expect(corrected).toBe(results); // same reference
  });

  it("ignores out-of-bounds indices", () => {
    const results = [makeResult()];
    const audit = {
      corrections: [
        { queryIndex: 5, isPresent: false, sentiment: "neutral" as const, reason: "oob" },
        { queryIndex: -1, isPresent: false, sentiment: "neutral" as const, reason: "negative" },
      ],
    };

    const corrected = applyAuditCorrections(results, audit);
    expect(corrected[0].isPresent).toBe(true); // unchanged
  });
});
