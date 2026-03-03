"use client";

import {
  Search,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  LineChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  LineChart,
};

export function Features() {
  const { t } = useDictionary();

  return (
    <section className="bg-gray-50/60 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t.features.title}
            </h2>
            <p className="mt-4 text-base text-gray-500 md:text-lg">
              {t.features.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, index) => {
            const Icon = ICON_MAP[item.icon] ?? Search;
            return (
              <ScrollReveal key={index} delay={0.07 * index}>
                <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-sm">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-gray-200">
                    <Icon className="h-4.5 w-4.5 text-gray-700" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
