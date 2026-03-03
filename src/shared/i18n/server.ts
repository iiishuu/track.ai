import { cookies } from "next/headers";
import type { Locale, Dictionary } from "./types";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale, getDictionary } from ".";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isValidLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getServerDictionary(): Promise<Dictionary> {
  const locale = await getServerLocale();
  return getDictionary(locale);
}
