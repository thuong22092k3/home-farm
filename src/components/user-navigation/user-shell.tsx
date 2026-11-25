"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { MobileBottomNavigation } from "./mobile-bottom-navigation";
import { UserHeader } from "./user-header";
import { UserSidebar } from "./user-sidebar";
import { userDrawerItems } from "@/config/user-navigation";

export function UserShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const isSidebarScreen =
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    userDrawerItems.some((item) =>
      !item.href.startsWith("/trees/") &&
      (item.href === pathname ||
        (item.href.startsWith("/products/") && pathname.startsWith("/products/"))),
    );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(media.matches);

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  return (
    <div className="vn-app">
      {isSidebarScreen && (
        <UserSidebar
          pathname={pathname}
          open={menuOpen || isDesktop}
          onClose={() => setMenuOpen(false)}
        />
      )}
      <div className="vn-shell !relative !ml-0 !w-full">
        <UserHeader />
        {isSidebarScreen && (
          <button
            className="absolute right-[5vw] top-[106px] z-[80] grid size-8 place-items-center rounded-full border border-[#dce2d5] bg-white  max-md:right-7 max-md:top-[80px] max-md:size-10 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
          >
            <Menu className="size-5 stroke-[1.5]" />
          </button>
        )}
        <main className={isSidebarScreen ? "vn-my-page" : undefined}>{children}</main>
        <MobileBottomNavigation />
      </div>
    </div>
  );
}
