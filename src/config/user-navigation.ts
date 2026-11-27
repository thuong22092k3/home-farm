import {
  Bell,
  Droplets,
  Gift,
  Home,
  PackageCheck,
  Search,
  Sprout,
  Store,
  Truck,
  User,
  UserRound,
  Video,
} from "lucide-react";

export const userDrawerItems = [
  { href: "/login", label: "Đăng nhập", group: "Bắt đầu", icon: User },
  { href: "/account", label: "Tài khoản của tôi", group: "Bắt đầu", icon: UserRound },
  { href: "/orders", label: "Đơn hàng", group: "Bắt đầu", icon: Truck },
  { href: "/plans", label: "Chọn gói", group: "Nhận nuôi", icon: Gift },
  { href: "/livestream", label: "Livestream", group: "Nhận nuôi", icon: Video },
  {
    href: "/confirmation",
    label: "Xác nhận hợp đồng",
    group: "Nhận nuôi",
    icon: PackageCheck,
  },
  {
    href: "/journal",
    label: "Nhật ký & IoT",
    group: "Chăm sóc",
    icon: Droplets,
  },
  { href: "/notifications", label: "Thông báo", group: "Chăm sóc", icon: Bell },
  {
    href: "/harvest",
    label: "Nhận thu hoạch",
    group: "Thu hoạch",
    icon: PackageCheck,
  },
] as const;

export const userBottomTabs = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Home,
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/explore",
    label: "Khám phá",
    icon: Search,
    match: (pathname: string) =>
      pathname.startsWith("/explore") || pathname.startsWith("/trees/"),
  },
  {
    href: "/my-garden",
    label: "Vườn",
    icon: Sprout,
    match: (pathname: string) =>
      pathname.startsWith("/my-garden") ||
      pathname.startsWith("/journal") ||
      pathname.startsWith("/harvest"),
  },
  {
    href: "/marketplace",
    label: "OCOP",
    icon: Store,
    match: (pathname: string) =>
      pathname.startsWith("/marketplace") || pathname.startsWith("/products/"),
  },
  {
    href: "/account",
    label: "Tài khoản",
    icon: UserRound,
    match: (pathname: string) =>
      pathname.startsWith("/account") || pathname.startsWith("/orders"),
  },
] as const;

export const userHeaderLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/explore", label: "Khám phá" },
  { href: "/my-garden", label: "Vườn của tôi" },
  { href: "/marketplace", label: "Chợ OCOP" },
] as const;
