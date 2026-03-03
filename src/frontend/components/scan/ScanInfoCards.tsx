import { Card, CardContent } from "@/frontend/components/ui/card";
import { getServerDictionary } from "@/shared/i18n/server";

export async function ScanInfoCards() {
  const t = await getServerDictionary();

  return (
    <section className="w-full">
      <h2 className="mb-4 text-center text-xl font-semibold">
        {t.scan.whatWeAnalyze}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {t.scan.infoCards.map((card, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {i + 1}
              </div>
              <h3 className="mb-1 font-semibold">{card.title}</h3>
              <p className="text-sm text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
