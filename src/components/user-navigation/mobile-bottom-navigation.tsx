"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { userBottomTabs } from "@/config/user-navigation";

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-3 z-[160] hidden justify-center px-3 max-md:flex"
      aria-label="Điều hướng chính"
    >
      <div className="flex h-[62px] w-full max-w-lg items-center rounded-full border border-white/70 bg-white/45 px-1.5 py-1 shadow-[0_20px_44px_rgba(10,10,10,0.14),0_4px_14px_rgba(255,255,255,0.24),inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-14px_26px_rgba(255,255,255,0.18),inset_0_0_18px_rgba(255,255,255,0.16)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/38">
        {userBottomTabs.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              className="flex h-full min-w-0 flex-1"
              whileTap={{ scale: 1.03, y: -1 }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 24,
                mass: 0.72,
              }}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex h-full w-full min-w-0 items-center justify-center rounded-full px-0.5 text-[10px] font-bold leading-none text-[#0a0a0a] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#2f6f23]/60 focus-visible:ring-offset-2",
                  active && "text-[#2f6f23]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="user-bottom-tab-active-pill"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 22,
                      mass: 0.84,
                    }}
                    className="absolute inset-0 overflow-hidden rounded-full bg-[#ddd8cf]/60 shadow-[inset_0_1px_10px_rgba(255,255,255,0.42)]"
                  >
                    <span className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.26)_0%,rgba(255,255,255,0.08)_48%,rgba(255,255,255,0)_100%)]" />
                    <span className="pointer-events-none absolute inset-x-[8%] top-[5%] h-[34%] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.24)_70%,rgba(255,255,255,0)_100%)] blur-[1px]" />
                  </motion.span>
                )}

                <motion.span
                  initial={false}
                  animate={{ y: active ? -1.5 : 0, scale: active ? 1 : 0.972 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    mass: 0.78,
                  }}
                  className="relative z-10 flex min-w-0 flex-col items-center justify-center gap-0.5"
                >
                  <Icon
                    aria-hidden
                    className={cn(
                      "size-6 transition-colors duration-300",
                      active
                        ? "stroke-[1.75] text-[#3b6f26]"
                        : "stroke-[1.5] text-[#0a0a0a]",
                    )}
                  />
                  <span
                    className={cn(
                      "max-w-full truncate text-[10px] leading-4.5  tracking-normal transition-opacity duration-300",
                      active
                        ? "opacity-100 font-bold"
                        : "opacity-90 font-semibold",
                    )}
                  >
                    {item.label}
                  </span>
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
