import { notFound } from "next/navigation";
import { AppI18nProvider } from "@/components/i18n-provider";
import { locales, type Locale } from "@/i18n/resources";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return <AppI18nProvider locale={lang as Locale}>{children}</AppI18nProvider>;
}
