import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardClient } from "@/frontend/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — TrackAI",
  description:
    "Track your brand's AI visibility over time. Monitor citation rate, average position, sentiment, and competitor share of voice across AI search engines.",
};

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
