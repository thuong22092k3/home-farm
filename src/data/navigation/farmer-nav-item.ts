import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  Map as MapIcon,
  Trees,
  type LucideIcon,
} from "lucide-react";

type FarmerNavigationItem = readonly [
  label: string,
  suffix: string,
  icon: LucideIcon,
];

type FarmerNavigationCopy = {
  management: string;
  account: string;
  items: readonly FarmerNavigationItem[];
  profile: string;
  settings: string;
  logout: string;
  role: string;
};

export const farmer_navigation: Record<"vi" | "en", FarmerNavigationCopy> = {
  vi: {
    management: "Quản lý vườn",
    account: "Tài khoản",
    items: [
      ["Tổng quan", "", LayoutDashboard],
      ["Sơ đồ cây", "/trees", MapIcon],
      ["Đơn thuê", "/rentals", Trees],
      ["Nhật ký vườn", "/journal", CalendarDays],
      ["Báo cáo", "/reports", BarChart3],
    ],
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    role: "Chủ vườn",
  },
  en: {
    management: "Farm management",
    account: "Account",
    items: [
      ["Overview", "", LayoutDashboard],
      ["Tree map", "/trees", MapIcon],
      ["Rentals", "/rentals", Trees],
      ["Farm journal", "/journal", CalendarDays],
      ["Reports", "/reports", BarChart3],
    ],
    profile: "Profile",
    settings: "Settings",
    logout: "Log out",
    role: "Farm owner",
  },
};
