import { redirect } from "next/navigation";

export const instant = false;

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/user`);
}
