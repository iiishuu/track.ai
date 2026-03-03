import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AIProvider } from "@/shared/types";
import { runScanPipeline } from "./pipeline";

// Mock Supabase
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock("@/backend/lib/supabase/client", () => ({
  getSupabaseAdmin: () => ({
    from: (table: string) => {
      if (table === "scans") {
        return {
          insert: (data: Record<string, unknown>) => {
            mockInsert(table, data);
            return {
              select: () => ({
                single: () =>
                  Promise.resolve({
                    data: { id: "scan-uuid-123" },
                    error: null,
                  }),
              }),
            };
          },
          update: (data: Record<string, unknown>) => {
            mockUpdate(table, data);
            return {
              eq: (_col: string, _val: string) => {
                mockEq(table, _col, _val);
                return Promise.resolve({ error: null });
              },
            };
          },
        };
      }
      // reports table
      return {
        insert: (data: Record<string, unknown>) => {
          mockInsert(table, data);
          return {
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: { id: "report-uuid-456" },
                  error: null,
                }),
            }),
          };
        },
      };
    },
  }),
}));

// Mock validation
vi.mock("@/backend/validation/domain", () => ({
  validateAndSanitizeDomain: (d: string) => {
    if (d === "invalid") return { valid: false, error: "Invalid domain" };
    return { valid: true, domain: d.toLowerCase() };
  },
}));

function createMockProvider(): AIProvider {
  return {
    name: "mock",
    query: vi.fn().mockImplementation(({ query }: { query: string }) => {
      // Analysis prompt — contains "Analyze the following AI response"
      if (query.includes("Analyze the following AI response")) {
        return Promise.resolve({
          content: JSON.stringify({
            isPresent: true,
            rank: 1,
            sentiment: "positive",
            competitors: ["rival.com"],
            context: "Example.com is a great platform",
          }),
          sources: [],
          provider: "mock",
        });
      }

      // Recommendations prompt (check before discovery — both contain "sector")
      if (query.includes("AI visibility strategist")) {
        return Promise.resolve({
          content: JSON.stringify([
            {
              title: "Improve content",
              description: "Create authoritative content.",
              priority: "high",
            },
          ]),
          sources: [],
          provider: "mock",
        });
      }

      // Discovery prompt — asks to identify sector/competitors/queries
      if (query.includes("sector") && query.includes("competitors")) {
        return Promise.resolve({
          content: JSON.stringify({
            sector: "SaaS",
            competitors: ["rival.com"],
            queries: ["What is example.com?", "example.com reviews"],
          }),
          sources: [],
          provider: "mock",
        });
      }

      // Default: raw query response (query execution step)
      return Promise.resolve({
        content: "Example.com is a great platform for building websites.",
        sources: ["https://wiki.com"],
        provider: "mock",
      });
    }),
  };
}

describe("runScanPipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs the full pipeline and returns report", async () => {
    const provider = createMockProvider();
    const result = await runScanPipeline("example.com", provider);

    expect(result.scanId).toBe("scan-uuid-123");
    expect(result.reportId).toBe("report-uuid-456");
    expect(result.report.domain).toBe("example.com");
    expect(result.report.sector).toBe("SaaS");
    expect(result.report.metrics.visibilityScore).toBeGreaterThanOrEqual(0);
    expect(result.report.queryResults).toHaveLength(2);
    expect(result.report.recommendations).toHaveLength(1);
  });

  it("creates scan with running status", async () => {
    const provider = createMockProvider();
    await runScanPipeline("example.com", provider);

    expect(mockInsert).toHaveBeenCalledWith("scans", {
      domain: "example.com",
      status: "running",
    });
  });

  it("updates scan to completed on success", async () => {
    const provider = createMockProvider();
    await runScanPipeline("example.com", provider);

    expect(mockUpdate).toHaveBeenCalledWith("scans", { status: "completed" });
  });

  it("saves report in database", async () => {
    const provider = createMockProvider();
    await runScanPipeline("example.com", provider);

    expect(mockInsert).toHaveBeenCalledWith(
      "reports",
      expect.objectContaining({
        scan_id: "scan-uuid-123",
        domain: "example.com",
        sector: "SaaS",
      })
    );
  });

  it("marks scan as failed on error", async () => {
    const provider: AIProvider = {
      name: "mock",
      query: vi.fn().mockRejectedValue(new Error("API down")),
    };

    // Discovery will fail since provider throws
    await expect(runScanPipeline("example.com", provider)).rejects.toThrow("API down");

    expect(mockUpdate).toHaveBeenCalledWith("scans", { status: "failed" });
  });

  it("throws on invalid domain", async () => {
    const provider = createMockProvider();
    await expect(runScanPipeline("invalid", provider)).rejects.toThrow("Invalid domain");
  });
});
