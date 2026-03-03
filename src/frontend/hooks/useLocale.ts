"use client";

import { useState, useCallback } from "react";
import type { Locale } from "@/shared/i18n/types";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale } from "@/shared/i18n";

function getLocaleFromCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.split("=")[1];
  return value && isValidLocale(value) ? value : DEFAULT_LOCALE;
}

export function useLocale(): {
  locale: Locale;
  setLocale: (newLocale: Locale) => void;
} {
  const [locale, setLocaleState] = useState<Locale>(getLocaleFromCookie);

  const setLocale = useCallback((newLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    setLocaleState(newLocale);
    window.location.reload();
  }, []);

  return { locale, setLocale };
}
