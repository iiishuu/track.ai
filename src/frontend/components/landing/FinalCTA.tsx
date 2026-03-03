"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";

export function FinalCTA() {
  const [domain, setDomain] = useState("");
  const router = useRouter();
  const { t } = useDictionary();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    router.push(`/scan?domain=${encodeURIComponent(domain.trim())}`);
  }

  return (
    <section className="bg-gray-50 px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {t.finalCta.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-5 text-base text-gray-500">
            {t.finalCta.description}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md gap-2"
          >
            <Input
              type="text"
              placeholder={t.finalCta.placeholder}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="h-11 flex-1 rounded-lg border-gray-200 text-sm"
            />
            <Button
              type="submit"
              disabled={!domain.trim()}
              className="h-11 gap-1.5 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
            >
              {t.finalCta.analyze}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </form>
          <p className="mt-3 text-xs text-gray-400">{t.finalCta.ctaSubtext}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
