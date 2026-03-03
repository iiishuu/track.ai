import type { Metadata } from "next";
import { HistoryList } from "@/frontend/components/history/HistoryList";
import { getServerDictionary } from "@/shared/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.meta.historyTitle,
    description: t.meta.historyDescription,
  };
}

export default async function HistoryPage() {
  const t = await getServerDictionary();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t.history.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.history.description}
        </p>
      </div>
      <HistoryList />
    </main>
  );
}
