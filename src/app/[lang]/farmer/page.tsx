import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sprout } from "lucide-react";
import { locales, type Locale } from "@/i18n/resources";

export const instant = false;

export default async function FarmerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;
  return (
    <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-5xl place-items-center px-5 py-16 text-center">
      <div className="vn-rise">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#e8f2d8] text-[#347858]">
          <Sprout className="size-8" />
        </span>
        <p className="mt-7 text-xs font-extrabold tracking-[.18em] text-[#347858]">
          FARMER WORKSPACE
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">
          {locale === "vi"
            ? "Trang nhà vườn đang được xây dựng"
            : "The farmer workspace is being built"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#718078]">
          {locale === "vi"
            ? "Navbar đã được tách riêng. Bạn có thể mở trang sample để xem toàn bộ dashboard và bộ component."
            : "The navbar is now independent. Open the sample page to view the full dashboard and component kit."}
        </p>
        <Link
          href={`/${locale}/sample/farmer`}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#143f30] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#205740]"
        >
          {locale === "vi" ? "Mở Farmer sample" : "Open Farmer sample"}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
