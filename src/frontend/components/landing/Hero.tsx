"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, BarChart2, MessageSquare } from "lucide-react";
import { Input } from "@/frontend/components/ui/input";
import { Button } from "@/frontend/components/ui/button";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";
import { ScrollReveal } from "@/frontend/components/animations/ScrollReveal";
import { DashboardMockup } from "@/frontend/components/landing/DashboardMockup";
import { InlineBadge } from "@/frontend/components/landing/InlineBadge";

export function Hero() {
  const [domain, setDomain] = useState("");
  const router = useRouter();
  const { t } = useDictionary();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    router.push(`/scan?domain=${encodeURIComponent(domain.trim())}`);
  }

  return (
    <section className="flex flex-col items-center px-4 pb-0 pt-20 text-center">
      <div className="mx-auto w-full max-w-4xl">
        {/* Top badge */}
        <ScrollReveal duration={0.5}>
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t.hero.badge}
            </span>
          </div>
        </ScrollReveal>

        {/* Title — two-tone heading */}
        <ScrollReveal duration={0.6} delay={0.05}>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-[72px]">
            <span className="block text-gray-900">{t.hero.titleBefore}</span>
            <span className="block font-light text-gray-400">{t.hero.titleHighlight}</span>
          </h1>
        </ScrollReveal>

        {/* Description with inline metric badges */}
        <ScrollReveal duration={0.5} delay={0.1}>
          <p className="mx-auto mb-3 max-w-[600px] text-base leading-relaxed text-gray-500 sm:text-lg">
            {t.hero.descPrefix}{" "}
            <InlineBadge icon={<Eye className="h-3.5 w-3.5" />}>{t.hero.badgeVisibility}</InlineBadge>
            {", "}
            <InlineBadge icon={<BarChart2 className="h-3.5 w-3.5" />}>{t.hero.badgeRanking}</InlineBadge>
            {", & "}
            <InlineBadge icon={<MessageSquare className="h-3.5 w-3.5" />}>{t.hero.badgeSentiment}</InlineBadge>
            .
          </p>
        </ScrollReveal>

        {/* Dual CTA */}
        <ScrollReveal duration={0.5} delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 sm:w-auto">
              <Input
                type="text"
                placeholder={t.hero.placeholder}
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="h-11 flex-1 rounded-lg border-gray-200 text-sm sm:w-56"
              />
              <Button
                type="submit"
                className="h-11 gap-1.5 rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                {t.hero.analyze}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            {t.hero.ctaSubtext}
          </p>
        </ScrollReveal>

        {/* Dashboard mockup — the product screenshot */}
        <ScrollReveal duration={0.7} delay={0.2}>
          <div className="relative mx-auto mt-16 w-full max-w-5xl">
            {/* Fade overlay at bottom so it blends into next section */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-white to-transparent" />
            <DashboardMockup />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
