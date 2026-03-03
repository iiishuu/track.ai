import type { Metadata } from "next";
import { CompareClient } from "@/frontend/components/compare/CompareClient";

export const metadata: Metadata = {
  title: "Compare Domains — TrackAI",
  description:
    "Run parallel AI scans on two domains and compare visibility, citations, sentiment, and competitors side by side.",
};

export default function ComparePage() {
  return <CompareClient />;
}
