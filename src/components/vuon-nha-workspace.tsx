"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Flower2,
  Grid2X2,
  Heart,
  Home,
  Languages,
  Plus,
  Search,
  Settings2,
  Sprout,
  Star,
  Trees,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { AppButton } from "@/components/app-button";
import { AppCard } from "@/components/app-card";
import { AppIconButton } from "@/components/app-icon-button";
import { AppTabs, AppTabsContent } from "@/components/app-tabs";
import { AppAccordion } from "@/components/app-accordion";
import { AppStepper } from "@/components/app-stepper/app-stepper";
import { AppSelect } from "@/components/app-select";
import { AppInfiniteScrollSelect } from "@/components/app-infinite-select/app-infinite-select";
import {
  AppDatePicker,
  AppDateRangePicker,
  type DateRangeValue,
} from "@/components/app-date-picker";
import { AppBarChart, AppLineChart, AppPieChart } from "@/components/app-chart";
import { AppUploader, type UploadedFile } from "@/components/app-uploader";
import {
  AppRichTextContent,
  AppRichTextEditor,
} from "@/components/app-rich-text-editor";
import { AppSkeleton, SkeletonText } from "@/components/app-skeleton";
import { AppPagination } from "@/components/app-table/app-pagination";
import { AppStickyActions } from "@/components/app-sticky-actions";
import type { Locale } from "@/i18n/resources";

type Role = "farmer" | "user";

const copy = {
  vi: {
    farmer: "Nhà vườn",
    user: "Khách thuê",
    overview: "Tổng quan",
    guide: "UI Guide",
    season: "VỤ THU HOẠCH 2026",
    farmerTitle: "Chào buổi sáng, Út Hương",
    farmerSub: "Theo dõi từng cây, từng khách thuê và mùa trái sắp tới.",
    addTree: "Thêm cây",
    userTitle: "Chọn một cây. Chờ mùa trái.",
    userSub:
      "Theo dõi cây của bạn qua ảnh, video và nhật ký chăm sóc. Khi tới vụ, vườn thu hoạch và gửi trái đến tận nhà.",
    explore: "Khám phá cây đang trống",
    live: "Xem livestream",
    available: "Cây còn trống",
    guideTitle: "Bộ component Vườn Nhà",
    guideSub: "Mẫu sử dụng thực tế cho form, dữ liệu, phản hồi và nội dung.",
    inputs: "Nhập liệu & lựa chọn",
    insights: "Dữ liệu & trạng thái",
    content: "Nội dung & tệp",
    publish: "Lưu bản nháp",
    submit: "Xuất bản cập nhật",
    notes: "Ghi chú chăm sóc hôm nay…",
  },
  en: {
    farmer: "Farmer",
    user: "Customer",
    overview: "Overview",
    guide: "UI Guide",
    season: "HARVEST SEASON 2026",
    farmerTitle: "Good morning, Ut Huong",
    farmerSub: "Track every tree, renter, and the harvest ahead.",
    addTree: "Add tree",
    userTitle: "Choose a tree. Await the harvest.",
    userSub:
      "Follow your tree through photos, videos, and care logs. At harvest, the farm ships the fruit to your door.",
    explore: "Explore available trees",
    live: "Watch livestream",
    available: "Available trees",
    guideTitle: "Vuon Nha component kit",
    guideSub: "Working examples for input, data, feedback, and content.",
    inputs: "Input & selection",
    insights: "Data & status",
    content: "Content & files",
    publish: "Save draft",
    submit: "Publish update",
    notes: "Today’s care notes…",
  },
} as const;

const farmerNav = [
  [Grid2X2, "Tổng quan", "Overview"],
  [Trees, "Sơ đồ cây", "Tree map"],
  [ClipboardList, "Đơn thuê", "Rentals"],
  [CalendarDays, "Nhật ký vườn", "Farm journal"],
  [BarChart3, "Báo cáo", "Reports"],
] as const;
const userNav = [
  [Sprout, "Chọn cây", "Choose a tree"],
  [CircleHelp, "Cách hoạt động", "How it works"],
  [Heart, "Niềm tin", "Our promise"],
  [Bell, "Livestream", "Livestream"],
] as const;

export function VuonNhaWorkspace({
  role,
  locale,
}: {
  role: Role;
  locale: Locale;
}) {
  const c = copy[locale];
  const [view, setView] = useState("overview");
  return (
    <div className="min-h-screen bg-[#f8f7f0]">
      <RoleRail role={role} locale={locale} />
      {role === "farmer" ? (
        <div className="lg:grid lg:grid-cols-[280px_1fr]">
          <FarmerSidebar locale={locale} />
          <main className="min-w-0 px-5 pb-24 pt-7 sm:px-8 lg:px-12">
            <Suspense
              fallback={
                <div className="mb-7 h-8 w-56 animate-pulse rounded-full bg-[#e7eadf]" />
              }
            >
              <WorkspaceTabs value={view} onChange={setView} c={c} />
            </Suspense>
            {view === "overview" ? (
              <FarmerOverview locale={locale} />
            ) : (
              <ComponentGuide role={role} locale={locale} />
            )}
          </main>
        </div>
      ) : (
        <div>
          <UserHeader locale={locale} />
          <main className="px-5 pb-24 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1480px] pt-6">
              <Suspense
                fallback={
                  <div className="mb-7 h-8 w-56 animate-pulse rounded-full bg-[#e7eadf]" />
                }
              >
                <WorkspaceTabs value={view} onChange={setView} c={c} />
              </Suspense>
            </div>
            {view === "overview" ? (
              <UserOverview locale={locale} />
            ) : (
              <ComponentGuide role={role} locale={locale} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function RoleRail({ role, locale }: { role: Role; locale: Locale }) {
  const pathname = usePathname();
  const otherLocale = locale === "vi" ? "en" : "vi";
  const localeHref = pathname.replace(`/${locale}/`, `/${otherLocale}/`);
  return (
    <div className="sticky top-0 z-50 grid h-11 grid-cols-[1fr_auto_1fr] border-b border-[#dfe2d4] bg-[#fffefa]/95 text-xs font-semibold backdrop-blur">
      <Link
        href={`/${locale}/farmer`}
        className={`flex items-center justify-center gap-2 transition ${role === "farmer" ? "bg-[#143f30] text-white" : "text-[#597064] hover:bg-[#eef2e6]"}`}
      >
        <Trees className="size-4" /> {copy[locale].farmer}
      </Link>
      <Link
        href={localeHref}
        className="flex items-center gap-1 border-x px-4 text-[#143f30] hover:bg-[#eef2e6]"
        aria-label="Switch language"
      >
        <Languages className="size-4" />
        {locale.toUpperCase()}
      </Link>
      <Link
        href={`/${locale}/user`}
        className={`flex items-center justify-center gap-2 transition ${role === "user" ? "bg-[#143f30] text-white" : "text-[#597064] hover:bg-[#eef2e6]"}`}
      >
        <UserRound className="size-4" /> {copy[locale].user}
      </Link>
    </div>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 text-xl font-black tracking-[-.04em] ${inverse ? "text-white" : "text-[#143f30]"}`}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-[#cde49f] text-[#143f30]">
        <Flower2 className="size-5 fill-current" />
      </span>
      Vườn Nhà
    </div>
  );
}

function FarmerSidebar({ locale }: { locale: Locale }) {
  return (
    <aside className="hidden min-h-[calc(100vh-44px)] bg-[#143f30] px-5 py-7 text-white lg:block">
      <Logo inverse />
      <p className="mb-4 mt-14 px-3 text-[11px] font-bold tracking-[.16em] text-white/45">
        {locale === "vi" ? "QUẢN LÝ VƯỜN" : "FARM MANAGEMENT"}
      </p>
      <nav className="space-y-2">
        {farmerNav.map(([Icon, vi, en], i) => (
          <button
            key={vi}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${i === 0 ? "bg-white/12 text-white" : "text-white/68 hover:bg-white/8 hover:text-white"}`}
          >
            <Icon className="size-4 text-[#cde49f]" />
            {locale === "vi" ? vi : en}
          </button>
        ))}
      </nav>
      <div className="mt-14 rounded-2xl border border-white/10 bg-white/6 p-4">
        <p className="text-xs text-white/55">
          {locale === "vi" ? "Vụ sắp tới" : "Next harvest"}
        </p>
        <p className="mt-1 text-2xl font-bold">
          42 {locale === "vi" ? "ngày" : "days"}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[63%] rounded-full bg-[#cde49f]" />
        </div>
      </div>
    </aside>
  );
}

function UserHeader({ locale }: { locale: Locale }) {
  return (
    <header className="border-b bg-[#fffefa]">
      <div className="mx-auto flex h-20 max-w-[1480px] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="mx-auto hidden gap-8 lg:flex">
          {userNav.map(([Icon, vi, en], i) => (
            <button
              key={vi}
              className={`flex items-center gap-2 text-sm font-semibold ${i === 0 ? "text-[#143f30]" : "text-[#718078] hover:text-[#143f30]"}`}
            >
              <Icon className="size-4" />
              {locale === "vi" ? vi : en}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <AppIconButton icon={<Search />} tooltip="Search" />
          <div className="grid size-10 place-items-center rounded-full bg-[#eadfc7] text-sm font-bold text-[#745f38]">
            MA
          </div>
        </div>
      </div>
    </header>
  );
}

function WorkspaceTabs({
  value,
  onChange,
  c,
}: {
  value: string;
  onChange: (v: string) => void;
  c: typeof copy.vi | typeof copy.en;
}) {
  return (
    <div className="mb-7 flex items-center justify-between gap-4">
      <AppTabs
        value={value}
        onChange={onChange}
        variant="pill"
        size="sm"
        items={[
          { id: "overview", label: c.overview, icon: <Home /> },
          { id: "guide", label: c.guide, icon: <BookOpen />, badge: "20+" },
        ]}
      />
      <div className="hidden items-center gap-2 text-xs text-[#708078] sm:flex">
        <span className="size-2 rounded-full bg-[#6fa166]" />
        Live prototype
      </div>
    </div>
  );
}

function FarmerOverview({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const stats =
    locale === "vi"
      ? [
          ["Tổng số cây", "24", "18 cây đang cho trái", "🌳"],
          ["Cây đã thuê", "16", "8 cây còn sẵn sàng", "🤝"],
          ["Sản lượng dự kiến", "~ 1,2 tấn", "Ước tính cho vụ này", "⚖️"],
          ["Doanh thu dự kiến", "48,5 tr", "Trước chi phí vận hành", "₫"],
        ]
      : [
          ["Total trees", "24", "18 fruiting now", "🌳"],
          ["Rented trees", "16", "8 still available", "🤝"],
          ["Expected yield", "~ 1.2 t", "This season estimate", "⚖️"],
          ["Expected revenue", "48.5m", "Before operating costs", "₫"],
        ];
  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="vn-rise flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-extrabold tracking-[.18em] text-[#347858]">
            {c.season}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-[-.055em] sm:text-5xl">
            {c.farmerTitle} <span className="inline-block">🌿</span>
          </h1>
          <p className="mt-2 text-[#708078]">{c.farmerSub}</p>
        </div>
        <AppButton
          variant="primary"
          size="lg"
          leftIcon={<Plus className="size-4" />}
        >
          {c.addTree}
        </AppButton>
      </div>
      <div className="vn-rise vn-rise-delay mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, note, icon]) => (
          <AppCard key={label} className="shadow-none">
            <div className="flex justify-between text-sm text-[#718078]">
              <span>{label}</span>
              <span>{icon}</span>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-[#859188]">{note}</p>
          </AppCard>
        ))}
      </div>
      <section className="mt-5 grid gap-5 rounded-3xl border bg-gradient-to-r from-[#edf5dc] to-[#fbf7e9] p-7 md:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-bold tracking-[.14em] text-[#347858]">
            {locale === "vi" ? "MÙA TRÁI ĐANG ĐẾN" : "HARVEST APPROACHING"}
          </p>
          <h2 className="mt-3 text-2xl font-black">
            {locale === "vi"
              ? "Thu hoạch dự kiến trong 42 ngày"
              : "Harvest expected in 42 days"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
            {locale === "vi"
              ? "Cập nhật nhật ký chăm sóc để khách thuê yên tâm theo dõi cây của mình."
              : "Keep care journals up to date so renters can follow their trees with confidence."}
          </p>
        </div>
        <div className="border-[#d9e2c7] md:border-l md:pl-8">
          <p className="text-4xl font-black">63%</p>
          <p className="text-sm text-[#718078]">
            {locale === "vi"
              ? "Tiến độ chăm sóc mùa vụ"
              : "Season care progress"}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dbe5d2]">
            <div className="h-full w-[63%] rounded-full bg-[#347858]" />
          </div>
          <p className="mt-2 text-xs text-[#718078]">
            12/19{" "}
            {locale === "vi" ? "công việc đã hoàn thành" : "tasks completed"}
          </p>
        </div>
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <AppLineChart
          title={locale === "vi" ? "Sản lượng theo tuần" : "Weekly yield"}
          description={
            locale === "vi"
              ? "Ước tính kg trái đạt chuẩn"
              : "Estimated grade-A fruit in kg"
          }
          data={[
            { name: "T1", value: 120 },
            { name: "T2", value: 178 },
            { name: "T3", value: 205 },
            { name: "T4", value: 248 },
            { name: "T5", value: 310 },
          ]}
          lines={[
            { dataKey: "value", name: locale === "vi" ? "Sản lượng" : "Yield" },
          ]}
          height={220}
        />
        <AppBarChart
          title={locale === "vi" ? "Công việc trong tuần" : "Work this week"}
          data={[
            { name: "T2", value: 8 },
            { name: "T3", value: 12 },
            { name: "T4", value: 7 },
            { name: "T5", value: 15 },
            { name: "T6", value: 10 },
          ]}
          height={220}
          color="success"
        />
      </div>
    </div>
  );
}

function UserOverview({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const trees = [
    {
      id: "SR-03",
      kind: "Ri6",
      kg: "25–40",
      days: 46,
      price: "2.200.000",
      emoji: "🌳",
    },
    {
      id: "SR-05",
      kind: "Ri6",
      kg: "30–45",
      days: 53,
      price: "2.400.000",
      emoji: "🌿",
    },
    {
      id: "SR-07",
      kind: "Monthong",
      kg: "35–50",
      days: 41,
      price: "2.900.000",
      emoji: "🌳",
    },
    {
      id: "SR-08",
      kind: "Ri6",
      kg: "30–45",
      days: 42,
      price: "2.400.000",
      emoji: "🌱",
    },
  ];
  return (
    <div className="mx-auto max-w-[1480px]">
      <section className="vn-rise grid min-h-[390px] items-center gap-10 py-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="text-xs font-extrabold tracking-[.18em] text-[#347858]">
            {locale === "vi"
              ? "THUÊ MỘT CÂY · NHẬN TRÁI CẢ MÙA"
              : "RENT A TREE · RECEIVE A SEASON"}
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[.98] tracking-[-.065em] sm:text-6xl">
            {c.userTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#718078]">
            {c.userSub}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <AppButton
              variant="primary"
              size="lg"
              rightIcon={<ChevronRight className="size-4" />}
            >
              {c.explore}
            </AppButton>
            <AppButton variant="outline" size="lg">
              ▶ {c.live}
            </AppButton>
          </div>
        </div>
        <div className="relative flex min-h-[280px] items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#dcecd2] via-[#edf1d7] to-[#f8ecc9] p-8">
          <div>
            <span className="rounded-full bg-white/85 px-3 py-2 text-xs font-bold text-[#d1684e]">
              ● {locale === "vi" ? "ĐANG PHÁT SÓNG" : "LIVE NOW"}
            </span>
            <h2 className="mt-8 max-w-xs text-2xl font-black">
              {locale === "vi"
                ? "Đi thăm vườn cùng cô Hương"
                : "Visit the farm with Ms. Huong"}
            </h2>
            <p className="mt-2 text-sm text-[#718078]">
              1.2K {locale === "vi" ? "người đang xem" : "watching"}
            </p>
          </div>
          <div className="absolute right-8 text-[110px] drop-shadow-xl sm:right-16">
            🥭
          </div>
        </div>
      </section>
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-black">{c.available}</h2>
          <p className="text-sm text-[#718078]">
            {locale === "vi"
              ? "Chỉ những cây còn trống mới có thể đặt thuê"
              : "Only trees currently available can be rented"}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-[#879188]" />
          <input
            className="h-10 rounded-xl border bg-white pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#9abe76]"
            placeholder={
              locale === "vi"
                ? "Tìm mã cây hoặc giống…"
                : "Search tree ID or variety…"
            }
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trees.map((tree) => (
          <article
            key={tree.id}
            className="group overflow-hidden rounded-2xl border bg-[#fffefa] transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative grid h-44 place-items-center bg-gradient-to-br from-[#8caf7d] to-[#dcedad]">
              <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold text-[#347858]">
                {locale === "vi" ? "CÒN TRỐNG" : "AVAILABLE"}
              </span>
              <button className="absolute right-4 top-3 grid size-9 place-items-center rounded-full bg-white/85">
                <Heart className="size-4" />
              </button>
              <span className="text-6xl transition group-hover:scale-110">
                {tree.emoji}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-black">{tree.id}</h3>
                  <p className="text-xs text-[#718078]">
                    {locale === "vi" ? "Sầu riêng" : "Durian"} {tree.kind}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#b47a2a]">
                  <Star className="inline size-3 fill-current" /> 4.9
                </span>
              </div>
              <div className="my-4 grid grid-cols-2 border-y py-3 text-xs text-[#718078]">
                <div>
                  {locale === "vi" ? "Dự kiến nhận" : "Expected"}
                  <strong className="mt-1 block text-sm text-[#143f30]">
                    {tree.kg} kg
                  </strong>
                </div>
                <div className="text-right">
                  {locale === "vi" ? "Còn khoảng" : "About"}
                  <strong className="mt-1 block text-sm text-[#143f30]">
                    {tree.days} {locale === "vi" ? "ngày" : "days"}
                  </strong>
                </div>
              </div>
              <p className="mb-3 text-xl font-black">
                {tree.price} ₫{" "}
                <span className="text-xs font-normal text-[#718078]">
                  / {locale === "vi" ? "vụ" : "season"}
                </span>
              </p>
              <AppButton variant="primary" className="w-full">
                {locale === "vi" ? "Xem cây & thuê" : "View & rent"}
              </AppButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ComponentGuide({ role, locale }: { role: Role; locale: Locale }) {
  const c = copy[locale];
  const [selected, setSelected] = useState("durian");
  const [orchard, setOrchard] = useState("north");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 17));
  const [range, setRange] = useState<DateRangeValue | undefined>({
    from: new Date(2026, 10, 17),
    to: new Date(2026, 11, 8),
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [note, setNote] = useState(
    locale === "vi"
      ? "<h3>Nhật ký hôm nay</h3><p>Cây phát triển tốt, độ ẩm ổn định 🌱</p>"
      : "<h3>Today’s journal</h3><p>The tree is growing well and moisture is stable 🌱</p>",
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(2);
  const chartData = useMemo(
    () => [
      { name: "T1", value: 12 },
      { name: "T2", value: 18 },
      { name: "T3", value: 14 },
      { name: "T4", value: 24 },
    ],
    [],
  );
  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="vn-rise mb-8">
        <p className="text-xs font-bold tracking-[.16em] text-[#347858]">
          {role === "farmer" ? c.farmer : c.user} · DESIGN SYSTEM
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-[-.05em]">
          {c.guideTitle}
        </h1>
        <p className="mt-2 text-[#718078]">{c.guideSub}</p>
      </div>
      <AppStepper
        steps={
          locale === "vi"
            ? ["Chọn cây", "Xác nhận", "Theo dõi", "Thu hoạch"]
            : ["Choose", "Confirm", "Track", "Harvest"]
        }
        currentStep={2}
      />
      <AppTabsContent className="mt-6 grid gap-6 xl:grid-cols-2">
        <AppCard className="shadow-none">
          <SectionTitle icon={<Settings2 />} title={c.inputs} />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Labeled label={locale === "vi" ? "Giống cây" : "Variety"}>
              <AppSelect
                value={selected}
                onChange={setSelected}
                options={[
                  {
                    value: "durian",
                    label: locale === "vi" ? "Sầu riêng Ri6" : "Ri6 durian",
                  },
                  {
                    value: "mango",
                    label: locale === "vi" ? "Xoài cát" : "Mango",
                  },
                ]}
              />
            </Labeled>
            <Labeled label={locale === "vi" ? "Khu vườn" : "Orchard"}>
              <AppInfiniteScrollSelect
                value={orchard}
                onChange={setOrchard}
                data={[
                  {
                    value: "north",
                    label:
                      locale === "vi" ? "Vườn Bắc · Lô A" : "North · Plot A",
                  },
                  {
                    value: "south",
                    label:
                      locale === "vi" ? "Vườn Nam · Lô C" : "South · Plot C",
                  },
                ]}
              />
            </Labeled>
            <Labeled label={locale === "vi" ? "Ngày chăm sóc" : "Care date"}>
              <AppDatePicker value={date} onChange={setDate} />
            </Labeled>
            <Labeled label={locale === "vi" ? "Khoảng mùa vụ" : "Season range"}>
              <AppDateRangePicker value={range} onChange={setRange} />
            </Labeled>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <AppButton variant="primary" leftIcon={<Plus className="size-4" />}>
              {locale === "vi" ? "Thêm mới" : "Create"}
            </AppButton>
            <AppButton variant="outline">
              {locale === "vi" ? "Xem trước" : "Preview"}
            </AppButton>
            <AppButton variant="success">
              {locale === "vi" ? "Hoàn tất" : "Complete"}
            </AppButton>
            <AppIconButton
              icon={<Bell />}
              tooltip="Notifications"
              variant="outline"
            />
          </div>
        </AppCard>
        <AppCard className="shadow-none">
          <SectionTitle icon={<BarChart3 />} title={c.insights} />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric
              label={locale === "vi" ? "Độ ẩm" : "Moisture"}
              value="68%"
            />
            <Metric
              label={locale === "vi" ? "Công việc" : "Tasks"}
              value="12/19"
            />
            <Metric
              label={locale === "vi" ? "Sức khoẻ" : "Health"}
              value="Tốt"
            />
          </div>
          <AppLineChart
            data={chartData}
            lines={[
              {
                dataKey: "value",
                name: locale === "vi" ? "Tăng trưởng" : "Growth",
              },
            ]}
            height={180}
          />
          <div className="grid sm:grid-cols-2">
            <AppPieChart
              data={[
                { name: "Tốt", value: 72 },
                { name: "Theo dõi", value: 20 },
                { name: "Cần xử lý", value: 8 },
              ]}
              innerRadius={38}
              height={170}
            />
            <AppBarChart data={chartData} height={170} color="warning" />
          </div>
          <div className="mt-3 flex justify-center">
            <AppPagination page={page} pageCount={5} onPageChange={setPage} />
          </div>
        </AppCard>
        <AppCard className="shadow-none xl:col-span-2">
          <SectionTitle icon={<FileText />} title={c.content} />
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <AppRichTextEditor
                value={note}
                onChange={setNote}
                placeholder={c.notes}
              />
              <div className="mt-3 rounded-xl bg-[#eef3e7] p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#718078]">
                  Preview
                </p>
                <AppRichTextContent html={note} />
              </div>
            </div>
            <AppUploader
              value={files}
              onFilesSelected={setFiles}
              accept="image/*,.pdf"
              maxFiles={4}
              maxSize={5 * 1024 * 1024}
            />
          </div>
        </AppCard>
        <AppCard className="shadow-none xl:col-span-2">
          <SectionTitle
            icon={<CircleHelp />}
            title={locale === "vi" ? "Phản hồi & trợ giúp" : "Feedback & help"}
          />
          <AppAccordion
            className="mt-4"
            defaultValue="a"
            items={[
              {
                id: "a",
                title:
                  locale === "vi"
                    ? "Khi nào dùng AppCard?"
                    : "When should I use AppCard?",
                content:
                  locale === "vi"
                    ? "Dùng khi toàn bộ vùng là một đơn vị tương tác hoặc dữ liệu độc lập."
                    : "Use it when the whole region is one interaction or independent data unit.",
              },
              {
                id: "b",
                title:
                  locale === "vi"
                    ? "Component có hỗ trợ bàn phím?"
                    : "Do components support keyboard navigation?",
                content:
                  locale === "vi"
                    ? "Có. Tabs, select, accordion và date picker đều có thao tác bàn phím."
                    : "Yes. Tabs, selects, accordions, and date pickers support keyboard use.",
              },
            ]}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <AppSkeleton loading={loading}>
              <div className="rounded-xl border bg-[#fffefa] p-4">
                <SkeletonText lines={2} />
                <p className="mt-3 text-sm">
                  {locale === "vi"
                    ? "Bấm để thử trạng thái loading."
                    : "Toggle the loading state."}
                </p>
              </div>
            </AppSkeleton>
            <button
              onClick={() => setLoading((v) => !v)}
              className="rounded-xl border border-dashed p-4 text-sm font-semibold hover:bg-[#eef3e7]"
            >
              {locale === "vi" ? "Bật / tắt skeleton" : "Toggle skeleton"}
            </button>
          </div>
        </AppCard>
      </AppTabsContent>
      <AppStickyActions>
        <AppButton variant="outline">{c.publish}</AppButton>
        <AppButton
          variant="primary"
          leftIcon={<UploadCloud className="size-4" />}
        >
          {c.submit}
        </AppButton>
      </AppStickyActions>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-xl bg-[#edf5dc] text-[#347858]">
        {icon}
      </span>
      <h2 className="text-lg font-black">{title}</h2>
    </div>
  );
}
function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-[#9abe76] pl-3">
      <p className="text-xs text-[#718078]">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
