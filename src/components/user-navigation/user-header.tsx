"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ShoppingBag } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Logo } from "./shared-ui";
import { userHeaderLinks } from "@/config/user-navigation";

export function UserHeader() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const activeHref = pathname.startsWith("/trees/")
    ? "/explore"
    : pathname.startsWith("/products/")
      ? "/marketplace"
      : pathname;

  return (
    <header className="vn-top">
      <div className="vn-top-logo"><Logo /></div>
      <nav aria-label="Điều hướng chính">
        <LayoutGroup id="user-header-navigation">
        {userHeaderLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : activeHref === href ? "location" : undefined}
            className={`relative isolate rounded-full px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none ${activeHref === href ? "text-[#143f30]!" : "hover:text-[#143f30]!"}`}
          >
            {activeHref === href && (
              <motion.span
                aria-hidden="true"
                layoutId={reduceMotion ? undefined : "active-background"}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36, mass: 0.75 }}
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#e8efce]"
              />
            )}
            {label}
          </Link>
        ))}
        </LayoutGroup>
      </nav>
      <div>
        <Link href="/notifications"><Bell /><i>3</i></Link>
        <Link href="/products/mat-ong-hoa-ca-phe"><ShoppingBag /><i>2</i></Link>
        <Link className="vn-avatar" href="/account">MA</Link>
      </div>
    </header>
  );
}
