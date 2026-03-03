import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/backend/lib/supabase/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("reports")
      .select("id, scan_id, domain, score, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (domain) {
      query = query.ilike("domain", `%${domain.toLowerCase()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("History fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch history" },
        { status: 500 }
      );
    }

    const history = (data ?? []).map((row) => ({
      scanId: row.scan_id,
      reportId: row.id,
      domain: row.domain,
      score: row.score,
      createdAt: row.created_at,
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
