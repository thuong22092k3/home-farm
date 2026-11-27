import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { userDrawerItems } from "@/config/user-navigation";
import { useAuthStore } from "@/stores/auth-store";

const groupLabels: Record<string, string> = {
  "Bắt đầu": "Tài khoản",
  "Nhận nuôi": "Nhận nuôi cây",
  "Chăm sóc": "Chăm sóc",
  "Thu hoạch": "Thu hoạch",
  "Mua sắm": "Mua sắm",
  "Tài khoản": "Hỗ trợ tài khoản",
};

export function UserSidebar({
  pathname,
  open,
  onClose,
}: {
  pathname: string;
  open: boolean;
  onClose: () => void;
}) {
  const isAuthenticated = useAuthStore((state) =>
    Boolean(state.user && state.isAuthenticated),
  );
  const logout = useAuthStore((state) => state.logout);
  const visibleItems = userDrawerItems.filter(
    (item) => !isAuthenticated || item.href !== "/login",
  );
  const groups = [...new Set(visibleItems.map((item) => item.group))];

  return (
    <>
      <aside
        className="!fixed !inset-y-0 !left-0 !z-[220] !flex !w-[min(82vw,320px)] !flex-col !overflow-y-auto !border-0 !bg-[#f7f4e9] !px-4 !pb-6 !pt-8 [scrollbar-color:#b9c4ba_transparent] [scrollbar-width:thin] shadow-[18px_0_48px_rgba(0,0,0,0.16)] transition-transform duration-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#b9c4ba] [&::-webkit-scrollbar-track]:bg-transparent lg:!bottom-0 lg:!left-[var(--my-page-gutter)] lg:!top-[74px] lg:!w-[var(--my-page-sidebar)] lg:!pt-7 lg:!shadow-none"
        style={{
          transform: open ? "translate3d(0, 0, 0)" : "translate3d(-105%, 0, 0)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <button
          className="!absolute !right-5 !top-5 !grid !size-12 !place-items-center !rounded-full !border !border-[#dedede] !bg-white lg:!hidden"
          onClick={onClose}
          aria-label="Đóng menu"
        >
          <X className="size-6 stroke-[1.5]" />
        </button>
        <h2 className="!mb-7 !ml-2 !mt-16 !text-2xl !font-black !tracking-[-0.04em] !text-black lg:!mt-3">
          MY PAGE
        </h2>
        <nav className="!overflow-visible !p-0">
          {groups.map((group) => (
            <section className="!mx-2 !mb-6" key={group}>
              <p className="!mb-2.5 !ml-0 !text-base !font-black !tracking-normal !text-black">
                {groupLabels[group] ?? group}
              </p>
              <div className="grid gap-0.5 rounded-lg border border-[#ddd] bg-white px-2.5 py-2">
                {visibleItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Link
                      className={`!grid !min-h-9 !w-full !grid-cols-[18px_minmax(0,1fr)_auto] !items-center !justify-start !gap-x-2.5 !rounded-md !px-2 !text-left !text-[13px] !font-bold !text-[#1d1d1d] transition-colors motion-reduce:transition-none ${pathname === item.href ? "!bg-[#eaf1df]" : "hover:!bg-[#f6f7f4]"}`}
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      key={item.href}
                      onClick={onClose}
                    >
                      <span className="relative flex size-[18px] items-center justify-start self-center text-[#397958]">
                        <item.icon
                          aria-hidden
                          className="absolute left-0 top-1/2 !size-[18px] -translate-y-1/2 fill-current stroke-none opacity-20"
                        />
                        <item.icon
                          aria-hidden
                          className="relative !size-[18px] fill-none stroke-current stroke-[1.35]"
                        />
                      </span>
                      <span className="min-w-0 text-left leading-snug">
                        {item.label}
                      </span>
                      {item.label === "Đơn hàng" && (
                        <b className="ml-auto min-w-5 rounded-full bg-[#f0443c] px-2 py-0.5 text-center text-xs text-white">
                          3
                        </b>
                      )}
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </nav>
        {isAuthenticated && (
          <Link
            className="!mx-2 !flex !min-h-[54px] !items-center !gap-3 !whitespace-nowrap !rounded-lg !border !border-[#ddd] !bg-white !px-4 !text-sm !font-bold !text-[#e64d45]"
            href="/login"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            <LogOut className="size-[18px] shrink-0 stroke-[1.5]" />
            <span className="whitespace-nowrap">Đăng xuất</span>
          </Link>
        )}
      </aside>
      {open && (
        <button
          className="fixed inset-0 z-[210] bg-black/55 lg:hidden"
          onClick={onClose}
          aria-label="Đóng menu"
        />
      )}
    </>
  );
}
