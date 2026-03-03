"use client";

import { Globe, Brain, BarChart3 } from "lucide-react";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";

const STEP_ICONS = [Globe, Brain, BarChart3] as const;

export function HowItWorks() {
  const { t } = useDictionary();

  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t.howItWorks.title}
            </h2>
            <p className="mt-4 text-base text-gray-500 md:text-lg">
              {t.howItWorks.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.howItWorks.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <ScrollReveal key={index} delay={0.1 * index}>
                <div className="group rounded-xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-md">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {t.howItWorks.stepLabel} {index + 1}
                  </span>
                  <h3 className="mb-3 text-base font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
