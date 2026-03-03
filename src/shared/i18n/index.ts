import type { Locale, Dictionary } from "./types";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";

export type { Locale, Dictionary };

export const LOCALES: Locale[] = ["en", "fr"];
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "trackai-locale";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
