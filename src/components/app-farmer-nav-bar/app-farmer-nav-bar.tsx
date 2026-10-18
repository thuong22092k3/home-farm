"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import {
  ChevronUp,
  CircleUserRound,
  Flower2,
  Languages,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/i18n/resources";
import { farmer_navigation } from "@/data/navigation/farmer-nav-item";

export function AppFarmerNavigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const copy = farmer_navigation[locale];
  const otherLocale = locale === "vi" ? "en" : "vi";
  const localeHref = pathname.replace(`/${locale}/`, `/${otherLocale}/`);

  return (
    <Sidebar
      collapsible="icon"
      className="border-[#315a49] bg-[#143f30] text-white"
      style={
        {
          "--sidebar": "#143f30",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-accent": "rgba(255,255,255,.12)",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,.12)",
        } as CSSProperties
      }
    >
      <SidebarHeader className="border-b border-white/10 p-3">
        <Link
          href={`/${locale}/farmer`}
          className="flex h-12 items-center gap-3 overflow-hidden px-1 group-data-[collapsible=icon]:justify-center"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#cde49f] text-[#143f30]">
            <Flower2 className="size-5 fill-current" />
          </span>
          <span className="whitespace-nowrap text-xl font-black tracking-[-.04em] group-data-[collapsible=icon]:hidden">
            Vườn Nhà
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-[.15em] text-white/45 group-data-[collapsible=icon]:hidden">
            {copy.management.toUpperCase()}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {copy.items.map(([label, suffix, Icon]) => {
                const href = `/${locale}/farmer${suffix}`;
                const isActive = suffix
                  ? pathname.startsWith(href)
                  : pathname === href;
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      tooltip={label}
                      isActive={isActive}
                      className="h-11 text-white/70 hover:bg-white/10 hover:text-white data-active:bg-white/12 data-active:text-white"
                    >
                      <Icon className="text-[#cde49f]" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href={localeHref} />}
              tooltip={otherLocale.toUpperCase()}
              className="h-10 text-white/65 hover:bg-white/10 hover:text-white"
            >
              <Languages className="text-[#cde49f]" />
              <span>{locale === "vi" ? "English" : "Tiếng Việt"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-13 text-white hover:bg-white/10"
                  />
                }
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eadfc7] text-xs font-black text-[#745f38]">
                  UH
                </span>
                <span className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-sm font-bold">
                    Út Hương
                  </span>
                  <span className="block truncate text-[11px] text-white/50">
                    {copy.role}
                  </span>
                </span>
                <ChevronUp className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-52">
                <DropdownMenuItem>
                  <CircleUserRound />
                  {copy.profile}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  {copy.settings}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  {copy.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppFarmerNavigation as AppFarmerNavBar };
