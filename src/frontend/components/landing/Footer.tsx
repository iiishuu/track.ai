"use client";

import Link from "next/link";
import { useDictionary } from "@/frontend/components/providers/DictionaryProvider";

export function Footer() {
  const { t } = useDictionary();

  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="text-base font-bold text-gray-900">{t.footer.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t.footer.description}
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.footer.product}
          </h4>
          <ul className="space-y-3">
            {t.footer.productLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.footer.resources}
          </h4>
          <ul className="space-y-3">
            {t.footer.resourceLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t.footer.legal}
          </h4>
          <ul className="space-y-3">
            {t.footer.legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-gray-100 pt-8">
        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} TrackAI. {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
