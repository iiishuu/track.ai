import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/backend/lib/supabase/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing report ID" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: report.id,
      scanId: report.scan_id,
      domain: report.domain,
      sector: report.sector,
      metrics: report.metrics,
      queryResults: report.query_results,
      recommendations: report.recommendations,
      createdAt: report.created_at,
    });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
