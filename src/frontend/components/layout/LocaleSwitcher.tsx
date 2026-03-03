"use client";

import { useLocale } from "@/frontend/hooks/useLocale";
import { Button } from "@/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { LOCALES } from "@/shared/i18n";
import type { Locale } from "@/shared/i18n/types";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
          {LOCALE_FLAGS[locale]} — {LOCALE_LABELS[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={l === locale ? "font-semibold bg-accent" : ""}
          >
            {LOCALE_FLAGS[l]} — {LOCALE_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
