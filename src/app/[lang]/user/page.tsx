import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Flower2, UserRound } from "lucide-react";
import { locales, type Locale } from "@/i18n/resources";

export const instant = false;

export default async function UserPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;
  return (
    <div className="min-h-screen bg-[#f8f7f0]">
      <header className="border-b bg-[#fffefa]">
        <div className="mx-auto flex h-18 max-w-[1480px] items-center px-5 sm:px-8 lg:px-12">
          <Link
            href={`/${locale}/user`}
            className="flex items-center gap-3 text-xl font-black tracking-[-.04em]"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#cde49f]">
              <Flower2 className="size-5 fill-current" />
            </span>
            Vườn Nhà
          </Link>
          <Link
            href={`/${locale === "vi" ? "en" : "vi"}/user`}
            className="ml-auto text-sm font-bold text-[#718078]"
          >
            {locale.toUpperCase()}
          </Link>
        </div>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-5xl place-items-center px-5 py-16 text-center">
        <div className="vn-rise">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f1e7cd] text-[#8b6f37]">
            <UserRound className="size-8" />
          </span>
          <p className="mt-7 text-xs font-extrabold tracking-[.18em] text-[#347858]">
            CUSTOMER EXPERIENCE
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">
            {locale === "vi"
              ? "Trang khách thuê đang được xây dựng"
              : "The customer experience is being built"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#718078]">
            {locale === "vi"
              ? "Trang marketplace hoàn chỉnh đã được chuyển vào khu vực sample để tiếp tục phát triển độc lập."
              : "The complete marketplace has moved to the sample area for independent iteration."}
          </p>
          <Link
            href={`/${locale}/sample/user`}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#143f30] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#205740]"
          >
            {locale === "vi" ? "Mở User sample" : "Open User sample"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
