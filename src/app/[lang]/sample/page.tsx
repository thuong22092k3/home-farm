import { redirect } from "next/navigation";

export const instant = false;

export default async function SamplePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirect(`/${lang}/sample/farmer`);
}
