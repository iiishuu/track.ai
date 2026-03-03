import type { Metadata } from "next";
import { Suspense } from "react";
import { ScanForm } from "@/frontend/components/scan/ScanForm";
import { ScanInfoCards } from "@/frontend/components/scan/ScanInfoCards";
import { getServerDictionary } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.meta.scanTitle,
    description: t.meta.scanDescription,
  };
}

export default async function ScanPage() {
  const t = await getServerDictionary();

  return (
    <main className="mx-auto flex max-w-4xl flex-col items-center gap-12 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t.scan.title}</h1>
        <p className="mt-2 text-muted-foreground">{t.scan.description}</p>
      </div>

      <Suspense>
        <ScanForm />
      </Suspense>

      <ScanInfoCards />
    </main>
  );
}
