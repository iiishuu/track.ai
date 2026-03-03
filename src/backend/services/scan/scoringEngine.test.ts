import { describe, it, expect } from "vitest";
import type { QueryResult } from "@/shared/types";
import {
  computeCitationRate,
  computeAveragePosition,
  computeSentimentScore,
  computeOverallSentiment,
  computePositionScore,
  computeSourcesDiversityScore,
  computeShareOfVoice,
  collectInfluenceSources,
  computeVisibilityScore,
  computeMetrics,
} from "./scoringEngine";

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

// ----- Citation Rate -----

describe("computeCitationRate", () => {
  it("returns 0 for empty results", () => {
    expect(computeCitationRate([])).toBe(0);
  });

  it("returns 1 when all queries cite the brand", () => {
    const results = [makeResult(), makeResult(), makeResult()];
    expect(computeCitationRate(results)).toBe(1);
  });

  it("returns 0 when no query cites the brand", () => {
    const results = [
      makeResult({ isPresent: false }),
      makeResult({ isPresent: false }),
    ];
    expect(computeCitationRate(results)).toBe(0);
  });

  it("returns correct ratio for partial citations", () => {
    const results = [
      makeResult({ isPresent: true }),
      makeResult({ isPresent: false }),
      makeResult({ isPresent: true }),
      makeResult({ isPresent: false }),
    ];
    expect(computeCitationRate(results)).toBe(0.5);
  });
});

// ----- Average Position -----

describe("computeAveragePosition", () => {
  it("returns null for empty results", () => {
    expect(computeAveragePosition([])).toBeNull();
  });

  it("returns null when no results have a rank", () => {
    const results = [
      makeResult({ isPresent: false, rank: null }),
      makeResult({ isPresent: true, rank: null }),
    ];
    expect(computeAveragePosition(results)).toBeNull();
  });

  it("computes average of ranked results only", () => {
    const results = [
      makeResult({ rank: 1 }),
      makeResult({ rank: 3 }),
      makeResult({ isPresent: false, rank: null }),
    ];
    expect(computeAveragePosition(results)).toBe(2);
  });

  it("returns exact position for single result", () => {
    expect(computeAveragePosition([makeResult({ rank: 5 })])).toBe(5);
  });
});

// ----- Sentiment -----

describe("computeSentimentScore", () => {
  it("returns 0.5 when no results are cited", () => {
    const results = [makeResult({ isPresent: false })];
    expect(computeSentimentScore(results)).toBe(0.5);
  });

  it("returns 1 for all positive", () => {
    const results = [
      makeResult({ sentiment: "positive" }),
      makeResult({ sentiment: "positive" }),
    ];
    expect(computeSentimentScore(results)).toBe(1);
  });

  it("returns 0 for all negative", () => {
    const results = [
      makeResult({ sentiment: "negative" }),
      makeResult({ sentiment: "negative" }),
    ];
    expect(computeSentimentScore(results)).toBe(0);
  });

  it("averages mixed sentiments correctly", () => {
    const results = [
      makeResult({ sentiment: "positive" }),
      makeResult({ sentiment: "negative" }),
    ];
    expect(computeSentimentScore(results)).toBe(0.5);
  });

  it("ignores non-cited results", () => {
    const results = [
      makeResult({ sentiment: "positive", isPresent: true }),
      makeResult({ sentiment: "negative", isPresent: false }),
    ];
    expect(computeSentimentScore(results)).toBe(1);
  });
});

describe("computeOverallSentiment", () => {
  it("returns positive for score >= 0.7", () => {
    const results = [
      makeResult({ sentiment: "positive" }),
      makeResult({ sentiment: "positive" }),
      makeResult({ sentiment: "neutral" }),
    ];
    expect(computeOverallSentiment(results)).toBe("positive");
  });

  it("returns neutral for score between 0.4 and 0.7", () => {
    const results = [
      makeResult({ sentiment: "positive" }),
      makeResult({ sentiment: "negative" }),
    ];
    expect(computeOverallSentiment(results)).toBe("neutral");
  });

  it("returns negative for score < 0.4", () => {
    const results = [
      makeResult({ sentiment: "negative" }),
      makeResult({ sentiment: "negative" }),
      makeResult({ sentiment: "neutral" }),
    ];
    expect(computeOverallSentiment(results)).toBe("negative");
  });
});

// ----- Position Score -----

describe("computePositionScore", () => {
  it("returns 0 for null position", () => {
    expect(computePositionScore(null)).toBe(0);
  });

  it("returns 1 for position 1 (best)", () => {
    expect(computePositionScore(1)).toBe(1);
  });

  it("returns 0 for position 10 (worst)", () => {
    expect(computePositionScore(10)).toBe(0);
  });

  it("returns ~0.5 for position 5.5", () => {
    expect(computePositionScore(5.5)).toBeCloseTo(0.5);
  });

  it("clamps to 0 for positions beyond 10", () => {
    expect(computePositionScore(20)).toBe(0);
  });
});

// ----- Sources Diversity -----

describe("computeSourcesDiversityScore", () => {
  it("returns 0 for no sources", () => {
    const results = [makeResult({ sources: [] })];
    expect(computeSourcesDiversityScore(results)).toBe(0);
  });

  it("returns 1 when all sources are unique", () => {
    const results = [
      makeResult({ sources: ["a.com"] }),
      makeResult({ sources: ["b.com"] }),
    ];
    expect(computeSourcesDiversityScore(results)).toBe(1);
  });

  it("returns 0.5 when half the sources are duplicates", () => {
    const results = [
      makeResult({ sources: ["a.com", "b.com"] }),
      makeResult({ sources: ["a.com", "b.com"] }),
    ];
    expect(computeSourcesDiversityScore(results)).toBe(0.5);
  });
});

// ----- Share of Voice -----

describe("computeShareOfVoice", () => {
  it("returns empty for no results", () => {
    expect(computeShareOfVoice([], "example.com")).toEqual({});
  });

  it("gives 100% to domain when no competitors", () => {
    const results = [makeResult({ competitors: [] })];
    expect(computeShareOfVoice(results, "example.com")).toEqual({
      "example.com": 100,
    });
  });

  it("splits voice between domain and competitors", () => {
    const results = [
      makeResult({ competitors: ["competitor.com"] }),
      makeResult({ competitors: ["competitor.com"] }),
    ];
    const sov = computeShareOfVoice(results, "example.com");
    expect(sov["example.com"]).toBe(50);
    expect(sov["competitor.com"]).toBe(50);
  });

  it("handles non-cited results (no domain mention)", () => {
    const results = [
      makeResult({ isPresent: false, competitors: ["rival.com"] }),
    ];
    const sov = computeShareOfVoice(results, "example.com");
    expect(sov["example.com"]).toBeUndefined();
    expect(sov["rival.com"]).toBe(100);
  });
});

// ----- Influence Sources -----

describe("collectInfluenceSources", () => {
  it("returns empty for no sources", () => {
    expect(collectInfluenceSources([makeResult({ sources: [] })])).toEqual([]);
  });

  it("returns sources sorted by frequency", () => {
    const results = [
      makeResult({ sources: ["a.com", "b.com"] }),
      makeResult({ sources: ["a.com", "c.com"] }),
      makeResult({ sources: ["a.com"] }),
    ];
    const sources = collectInfluenceSources(results);
    expect(sources[0]).toBe("a.com");
    expect(sources).toContain("b.com");
    expect(sources).toContain("c.com");
  });
});

// ----- Visibility Score -----

describe("computeVisibilityScore", () => {
  it("returns 0 for empty results", () => {
    expect(computeVisibilityScore([])).toBe(0);
  });

  it("returns 100 for perfect results", () => {
    const results = [
      makeResult({ isPresent: true, rank: 1, sentiment: "positive", sources: ["a.com"] }),
      makeResult({ isPresent: true, rank: 1, sentiment: "positive", sources: ["b.com"] }),
    ];
    expect(computeVisibilityScore(results)).toBe(100);
  });

  it("returns low score for poor results", () => {
    const results = [
      makeResult({ isPresent: false, rank: null, sentiment: "negative", sources: [] }),
      makeResult({ isPresent: false, rank: null, sentiment: "negative", sources: [] }),
    ];
    expect(computeVisibilityScore(results)).toBeLessThan(20);
  });

  it("returns score between 0 and 100", () => {
    const results = [
      makeResult({ isPresent: true, rank: 3, sentiment: "neutral" }),
      makeResult({ isPresent: false, rank: null, sentiment: "negative" }),
      makeResult({ isPresent: true, rank: 5, sentiment: "positive" }),
    ];
    const score = computeVisibilityScore(results);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("is deterministic", () => {
    const results = [
      makeResult({ rank: 2, sentiment: "neutral" }),
      makeResult({ rank: 4, sentiment: "positive" }),
    ];
    const score1 = computeVisibilityScore(results);
    const score2 = computeVisibilityScore(results);
    expect(score1).toBe(score2);
  });

  it("gives moderate score when position is N/A but brand is cited", () => {
    // Brand cited in all responses, positive sentiment, but no ranked lists
    const results = [
      makeResult({ isPresent: true, rank: null, sentiment: "positive", sources: ["a.com"] }),
      makeResult({ isPresent: true, rank: null, sentiment: "positive", sources: ["b.com"] }),
    ];
    const score = computeVisibilityScore(results);
    // With 100% citation + positive sentiment but neutral position => moderate-high
    // citationRate=1*0.4 + positionNeutral=0.3*0.3 + sentiment=1*0.2 + diversity=1*0.1 = 0.79 => 79
    expect(score).toBeGreaterThanOrEqual(60);
    expect(score).toBeLessThanOrEqual(85);
  });

  it("scores higher with position data than without when all else equal", () => {
    const withRank = [
      makeResult({ isPresent: true, rank: 1, sentiment: "positive", sources: ["a.com"] }),
      makeResult({ isPresent: true, rank: 1, sentiment: "positive", sources: ["b.com"] }),
    ];
    const withoutRank = [
      makeResult({ isPresent: true, rank: null, sentiment: "positive", sources: ["a.com"] }),
      makeResult({ isPresent: true, rank: null, sentiment: "positive", sources: ["b.com"] }),
    ];
    // Perfect rank should still score >= no rank
    expect(computeVisibilityScore(withRank)).toBeGreaterThanOrEqual(
      computeVisibilityScore(withoutRank)
    );
  });
});

// ----- computeMetrics (integration) -----

describe("computeMetrics", () => {
  it("returns complete metrics object", () => {
    const results = [
      makeResult({
        isPresent: true,
        rank: 2,
        sentiment: "positive",
        competitors: ["rival.com"],
        sources: ["wiki.com", "blog.com"],
      }),
      makeResult({
        isPresent: false,
        rank: null,
        sentiment: "neutral",
        competitors: ["rival.com", "other.com"],
        sources: [],
      }),
    ];

    const metrics = computeMetrics(results, "example.com");

    expect(metrics.visibilityScore).toBeGreaterThanOrEqual(0);
    expect(metrics.visibilityScore).toBeLessThanOrEqual(100);
    expect(metrics.citationRate).toBe(0.5);
    expect(metrics.averagePosition).toBe(2);
    expect(metrics.overallSentiment).toBeDefined();
    expect(metrics.shareOfVoice).toHaveProperty("example.com");
    expect(metrics.shareOfVoice).toHaveProperty("rival.com");
    expect(metrics.influenceSources).toContain("wiki.com");
    expect(metrics.influenceSources).toContain("blog.com");
  });

  it("handles all-empty gracefully", () => {
    const metrics = computeMetrics([], "example.com");
    expect(metrics.visibilityScore).toBe(0);
    expect(metrics.citationRate).toBe(0);
    expect(metrics.averagePosition).toBeNull();
    expect(metrics.shareOfVoice).toEqual({});
    expect(metrics.influenceSources).toEqual([]);
  });
});

// ----- isSubstantive filtering -----

describe("isSubstantive filtering in citation rate", () => {
  it("excludes non-substantive results from citation rate", () => {
    const results = [
      makeResult({ isPresent: true, isSubstantive: true }),
      makeResult({ isPresent: true, isSubstantive: false }),
      makeResult({ isPresent: true, isSubstantive: false }),
      makeResult({ isPresent: false }),
    ];
    // Only 1 out of 4 is genuinely present (isPresent=true AND isSubstantive!=false)
    expect(computeCitationRate(results)).toBe(0.25);
  });

  it("counts results without isSubstantive field as substantive (backward compat)", () => {
    const results = [
      makeResult({ isPresent: true }), // no isSubstantive field => treated as substantive
      makeResult({ isPresent: true }),
    ];
    expect(computeCitationRate(results)).toBe(1);
  });

  it("gives low score for brand with many non-substantive results", () => {
    // Simulates hedarp.fr case: 9/10 present but 8 are non-substantive
    const results = [
      makeResult({ isPresent: true, isSubstantive: true, rank: null, sentiment: "positive", sources: ["a.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["b.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["c.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["d.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["e.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["f.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["g.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["h.com"] }),
      makeResult({ isPresent: false, rank: null, sentiment: "neutral", sources: ["i.com"] }),
      makeResult({ isPresent: true, isSubstantive: false, rank: null, sentiment: "neutral", sources: ["j.com"] }),
    ];
    const score = computeVisibilityScore(results);
    // Only 1/10 substantive citation => very low score
    expect(score).toBeLessThan(30);
  });
});
