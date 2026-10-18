import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Bell } from "lucide-react";
import { AppFarmerNavigation } from "@/components/app-farmer-nav-bar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { locales, type Locale } from "@/i18n/resources";

export const instant = false;

export default async function FarmerLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  return (
    <SidebarProvider>
      <AppFarmerNavigation locale={lang as Locale} />
      <SidebarInset className="min-w-0 bg-[#f8f7f0]">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-[#dfe2d4] bg-[#fffefa]/95 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger className="text-[#143f30]" />
          <div className="ml-3 h-5 w-px bg-[#dfe2d4]" />
          <p className="ml-3 text-sm font-semibold text-[#52665c]">
            {lang === "vi" ? "Không gian nhà vườn" : "Farmer workspace"}
          </p>
          <Bell className="ml-auto size-4 text-[#718078]" />
        </header>
        <main className="min-h-[calc(100vh-56px)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
