import { notFound } from "next/navigation";
import { VuonNhaWorkspace } from "@/app/[lang]/sample/component/vuon-nha-workspace";
import { locales, type Locale } from "@/i18n/resources";

export const instant = false;

export function generateStaticParams() {
  return [{ role: "farmer" }, { role: "user" }];
}

export default async function RoleSamplePage({
  params,
}: {
  params: Promise<{ lang: string; role: string }>;
}) {
  const { lang, role } = await params;
  if (
    !locales.includes(lang as Locale) ||
    (role !== "farmer" && role !== "user")
  )
    notFound();
  return <VuonNhaWorkspace role={role} locale={lang as Locale} />;
}
