"use client";

import { useEffect, useRef, useState } from "react";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";
import Counter from "@/frontend/components/Counter";

export function Stats() {
  const { t } = useDictionary();
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-y border-gray-100 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t.stats.title}
            </h2>
            <p className="mt-3 text-base text-gray-500">
              {t.stats.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {t.stats.items.map((stat, index) => (
            <ScrollReveal key={index} delay={0.08 * index}>
              <div className="text-center">
                <div className="flex items-center justify-center text-4xl font-bold text-gray-900 md:text-5xl">
                  <Counter
                    value={inView ? stat.value : 0}
                    fontSize={48}
                    gap={2}
                    horizontalPadding={0}
                    gradientHeight={0}
                    gradientFrom="transparent"
                    gradientTo="transparent"
                    textColor="currentColor"
                    fontWeight="bold"
                  />
                  {stat.suffix && (
                    <span className="ml-0.5">{stat.suffix}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
