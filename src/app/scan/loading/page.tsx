import type { Metadata } from "next";
import { Suspense } from "react";
import { ScanLoading } from "@/frontend/components/scan/ScanLoading";
import { getServerDictionary } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.meta.loadingTitle,
  };
}

export default function LoadingPage() {
  return (
    <Suspense>
      <ScanLoading />
    </Suspense>
  );
}
