import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono } from "next/font/google";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { DictionaryProvider } from "@/frontend/components/providers/DictionaryProvider";
import { ThemeProvider } from "@/frontend/components/providers/ThemeProvider";
import {
  getServerLocale,
  getServerDictionary,
} from "@/shared/i18n/server";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trackai.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "TrackAI",
      url: BASE_URL,
      description:
        "Track your brand visibility across AI search engines like ChatGPT, Gemini, and Perplexity.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
    {
      "@type": "Organization",
      name: "TrackAI",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Scan", item: `${BASE_URL}/scan` },
        { "@type": "ListItem", position: 3, name: "Dashboard", item: `${BASE_URL}/dashboard` },
        { "@type": "ListItem", position: 4, name: "Compare", item: `${BASE_URL}/compare` },
      ],
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.meta.siteTitle,
    description: t.meta.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const dictionary = await getServerDictionary();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <DictionaryProvider dictionary={dictionary} locale={locale}>
            <Navbar />
            <div className="pt-[4.5rem]">
              {children}
            </div>
          </DictionaryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
