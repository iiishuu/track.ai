import Link from "next/link";
import { getServerDictionary } from "@/shared/i18n/server";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Navbar() {
  const t = await getServerDictionary();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 glass">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-base font-bold tracking-tight text-gray-900">
          TrackAI
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/scan"
            className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            {t.nav.scan}
          </Link>
          <Link
            href="/dashboard"
            className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            {t.nav.dashboard}
          </Link>
          <Link
            href="/compare"
            className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            {t.nav.compare}
          </Link>
          <Link
            href="/history"
            className="hidden text-sm text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            {t.nav.history}
          </Link>
          <LocaleSwitcher />
          <Link
            href="/scan"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  );
}
