import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAndSanitizeDomain } from "@/backend/validation/domain";
import { createAIProvider } from "@/backend/lib/ai/provider";
import { runScanPipeline } from "@/backend/services/scan/pipeline";
import { LOCALE_COOKIE, DEFAULT_LOCALE, isValidLocale } from "@/shared/i18n";
import type { QueryType, ScanDepth } from "@/shared/i18n/types";

const VALID_DEPTHS: ScanDepth[] = ["quick", "standard", "deep"];
const VALID_QUERY_TYPES: QueryType[] = [
  "commercial",
  "comparative",
  "reputation",
  "informational",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, depth, queryTypes } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'domain' field" },
        { status: 400 }
      );
    }

    // Validate domain before starting pipeline
    try {
      validateAndSanitizeDomain(domain);
    } catch {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Read locale from cookie
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
    const locale =
      localeCookie && isValidLocale(localeCookie)
        ? localeCookie
        : DEFAULT_LOCALE;

    // Parse scan options
    const scanDepth: ScanDepth =
      depth && VALID_DEPTHS.includes(depth) ? depth : "standard";

    const scanQueryTypes: QueryType[] =
      Array.isArray(queryTypes) && queryTypes.length > 0
        ? queryTypes.filter((t: string) =>
            VALID_QUERY_TYPES.includes(t as QueryType)
          )
        : VALID_QUERY_TYPES;

    const provider = createAIProvider();
    const result = await runScanPipeline(domain, provider, locale, {
      depth: scanDepth,
      queryTypes: scanQueryTypes as QueryType[],
    });

    return NextResponse.json({
      scanId: result.scanId,
      reportId: result.reportId,
    });
  } catch (error) {
    console.error("Scan pipeline error:", error);
    return NextResponse.json(
      { error: "Scan failed. Please try again later." },
      { status: 500 }
    );
  }
}
