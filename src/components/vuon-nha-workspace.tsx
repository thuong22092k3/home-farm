"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileText,
  Heart,
  Home,
  Plus,
  Search,
  Settings2,
  Sprout,
  Star,
  UploadCloud,
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
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/resources";

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

const userNav = [
  [Sprout, "Chọn cây", "Choose a tree"],
  [CircleHelp, "Cách hoạt động", "How it works"],
  [Heart, "Niềm tin", "Our promise"],
  [Bell, "Livestream", "Livestream"],
] as const;

export function VuonNhaWorkspace() {
  const locale: Locale = "vi";
  const c = copy[locale];
  const [view, setView] = useState("overview");
  return (
    <div className="min-h-screen bg-[#f8f7f0]">
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
          <ComponentGuide locale={locale} />
        )}
      </main>
    </div>
  );
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 text-xl font-black tracking-[-.04em] ${inverse ? "text-white" : "text-[#143f30]"}`}
    >
      <Image
        src="/avt.png"
        alt="Logo Vườn Nhà"
        width={40}
        height={40}
        className="size-10 rounded-xl object-cover"
      />
      Vườn Nhà
    </div>
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

function UserOverview({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const trees = siteConfig.seededCatalog.trees.map((tree, index) => ({
    id: tree.id,
    kind: tree.variety.replace("Sầu riêng ", ""),
    kg: tree.yield.replace(" kg", ""),
    days: tree.daysToHarvest,
    price: tree.price.toLocaleString("vi-VN"),
    emoji: ["🌳", "🌿", "🌳", "🌱"][index] ?? "🌳",
  }));
  return (
    <div className="mx-auto max-w-[1480px]">
      <section className="vn-rise grid min-h-[430px] items-stretch gap-10 border-b border-[#cfd6c7] py-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-extrabold tracking-[.18em] text-[#347858]">
            {locale === "vi"
              ? "THUÊ MỘT CÂY · NHẬN TRÁI CẢ MÙA"
              : "RENT A TREE · RECEIVE A SEASON"}
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[.94] tracking-[-.07em] sm:text-7xl">
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
        <div className="group relative flex min-h-[320px] items-end overflow-hidden bg-[#173f31] p-7 text-[#f8f7f0] sm:p-10">
          <div className="absolute -right-16 -top-20 size-72 rounded-full border border-[#cde49f]/20 transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute right-5 top-4 size-52 rounded-full border border-[#cde49f]/20 sm:right-12 sm:top-8" />
          <div className="absolute right-16 top-14 size-36 rounded-full bg-[#d4e89f] sm:right-20 sm:top-16" />
          <span className="absolute right-20 top-20 text-[84px] drop-shadow-xl transition duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:right-24 sm:top-24">
            🥭
          </span>
          <div className="relative z-10 max-w-sm">
            <span className="inline-flex items-center gap-2 border border-[#f7e2d4]/30 bg-[#f7e2d4] px-3 py-2 text-[10px] font-black tracking-[.14em] text-[#a44f3e]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#c45445]" />
              {locale === "vi" ? "ĐANG PHÁT SÓNG" : "LIVE NOW"}
            </span>
            <p className="mt-10 text-[10px] font-bold tracking-[.18em] text-[#cde49f]">
              VƯỜN BẮC · LÔ A03
            </p>
            <h2 className="mt-2 max-w-xs text-3xl font-black leading-tight tracking-[-.04em]">
              {locale === "vi"
                ? "Đi thăm vườn cùng cô Hương"
                : "Visit the farm with Ms. Huong"}
            </h2>
            <p className="mt-3 text-sm text-white/65">
              1.2K {locale === "vi" ? "người đang xem · 18 phút" : "watching · 18 minutes"}
            </p>
          </div>
          <span className="absolute bottom-7 right-7 text-xs font-bold tracking-[.14em] text-white/50">
            08:32 AM
          </span>
        </div>
      </section>
      <div className="mb-5 mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        {trees.map((tree, index) => (
          <article
            key={tree.id}
            className="group overflow-hidden border-t-2 border-[#173f31] bg-[#fffefa] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(20,63,48,.12)]"
          >
            <div className="relative grid h-44 place-items-center overflow-hidden bg-[#dce8bc]">
              <span className="absolute -bottom-8 -right-5 text-[120px] font-black leading-none text-[#173f31]/[.06]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute left-4 top-4 border border-[#347858]/20 bg-[#f8f7f0]/90 px-3 py-1 text-[10px] font-black tracking-[.1em] text-[#347858]">
                {locale === "vi" ? "CÒN TRỐNG" : "AVAILABLE"}
              </span>
              <button className="absolute right-4 top-3 grid size-9 place-items-center border border-[#173f31]/10 bg-[#f8f7f0]/90 transition hover:bg-white">
                <Heart className="size-4" />
              </button>
              <span className="relative text-6xl transition duration-500 group-hover:-translate-y-1 group-hover:scale-110">
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

function ComponentGuide({ locale }: { locale: Locale }) {
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
          {c.user} · DESIGN SYSTEM
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
