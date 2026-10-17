import { notFound } from "next/navigation";
import { VuonNhaWorkspace } from "@/components/vuon-nha-workspace";
import { locales, type Locale } from "@/i18n/resources";

export const instant = false;

export default async function UserPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  return <VuonNhaWorkspace role="user" locale={lang as Locale} />;
}
