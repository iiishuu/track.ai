"use client";

import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";
import { LogoLoop } from "@/frontend/components/LogoLoop";
import type { LogoItem } from "@/frontend/components/LogoLoop";

export function AILogos() {
  const { t } = useDictionary();

  const logos: LogoItem[] = t.aiLogos.engines.map((engine) => ({
    node: (
      <span className="text-sm font-medium text-gray-400 tracking-wide">
        {engine}
      </span>
    ),
    title: engine,
  }));

  return (
    <section className="border-y border-gray-100 bg-gray-50/50 py-10">
      <ScrollReveal duration={0.4}>
        <p className="mb-6 text-center text-sm font-medium text-gray-400 uppercase tracking-widest">
          {t.aiLogos.title}
        </p>
      </ScrollReveal>
      <LogoLoop
        logos={logos}
        speed={60}
        direction="left"
        gap={72}
        logoHeight={24}
        pauseOnHover
        fadeOut
      />
    </section>
  );
}
