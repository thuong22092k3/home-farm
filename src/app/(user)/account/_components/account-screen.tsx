"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Gift,
  Leaf,
  MapPin,
  PackageCheck,
  Sprout,
  Truck,
  UserRound,
} from "lucide-react";

const orderStatuses = [
  { label: "Chờ thanh toán", value: 0, icon: Clock3 },
  { label: "Đã xác nhận", value: 1, icon: CheckCircle2 },
  { label: "Đang chuẩn bị", value: 2, icon: PackageCheck },
  { label: "Đang giao", value: 1, icon: Truck },
] as const;

const rentalCode = "TREE-A12-261109";

export function AccountScreen() {
  async function copyRentalCode() {
    try {
      await navigator.clipboard.writeText(rentalCode);
      toast.success("Đã sao chép mã cây.");
    } catch {
      toast.error("Không thể sao chép mã cây.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8 lg:mx-0 lg:mr-[4vw] lg:max-w-none lg:px-0">
      <p className="mb-6 text-xl font-black text-[#397958]">
        TÀI KHOẢN CỦA TÔI
      </p>
      <article className="mb-6 flex items-center gap-4 rounded-lg border border-[#dce2d5] bg-white p-5 shadow-sm">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#eaf1d0] text-xl font-black text-[#123f2e]">
          MA
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-black">Xin chào, Mai Anh! 👋</p>
          <p className="truncate text-sm text-[#718077]">mai.anh@email.com</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-[#397958]">
            <Leaf className="size-4" />
            Mầm Xanh · Việt Nam
          </p>
        </div>
        <Link
          href="/account/profile"
          aria-label="Xem thông tin cá nhân"
          className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f3f5ee]"
        >
          <ArrowRight className="size-4" />
        </Link>
      </article>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Trạng thái đơn hàng</h2>
        <Link href="/orders" className="text-xs font-bold text-[#397958]">
          Xem tất cả
        </Link>
      </div>
      <div className="mb-6 grid grid-cols-4 rounded-lg border border-[#dce2d5] bg-white p-2 md:p-4">
        {orderStatuses.map(({ label, value, icon: Icon }) => (
          <Link
            href="/orders"
            key={label}
            className="flex min-w-0 flex-col items-center px-1 py-3 text-center transition-colors hover:bg-[#f7f4e9]"
          >
            <span className="mb-2 grid size-10 place-items-center rounded-full bg-[#eef5df] text-[#397958]">
              <Icon className="size-5" />
            </span>
            <small className="min-h-8 text-[10px] leading-4 text-[#718077] md:text-xs">
              {label}
            </small>
            <b className="mt-1 text-xl">{value}</b>
          </Link>
        ))}
      </div>
      <section className="mb-6 rounded-lg bg-gradient-to-br from-[#3f9f4d] via-[#7f9b32] to-[#e68b17] p-5 text-white">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Quyền lợi Mầm Xanh</h2>
          <Gift />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <small>Phiếu ưu đãi</small>
            <b className="mt-1 block text-2xl">3</b>
          </div>
          <div>
            <small>Điểm xanh</small>
            <b className="mt-1 block text-2xl">280</b>
          </div>
          <div>
            <small>Cây đang nuôi</small>
            <b className="mt-1 block text-2xl">1</b>
          </div>
        </div>
      </section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">Cây đang thuê</h2>
        <Link
          href="/my-garden"
          className="flex items-center gap-1 text-xs font-bold text-[#397958]"
        >
          Xem tất cả <ArrowRight className="size-4" />
        </Link>
      </div>
      <article className="mb-6 rounded-lg border border-[#dce2d5] bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#e5e9e1] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <b className="text-sm">{rentalCode}</b>
              <button
                type="button"
                aria-label="Sao chép mã cây"
                onClick={copyRentalCode}
                className="inline-flex size-6 shrink-0 items-center justify-center gap-1 rounded-md border border-[#dce2d5] text-xs! text-[#597266] hover:bg-[#f3f5ee] sm:w-auto sm:px-1.5"
              >
                <Copy className="size-3" aria-hidden="true" />
                <span className="hidden sm:inline">Sao chép</span>
              </button>
            </div>
            <small className="mt-1 block text-[#718077]">
              Bắt đầu 09.11.2026
            </small>
          </div>
          <span className="inline-flex rounded-full border border-[#c4d6a4] bg-[#eaf1d0] px-3 py-1.5 text-[10px] font-black text-[#397958]">
            ĐANG CHĂM SÓC
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <div className="relative h-32 overflow-hidden bg-[#eef5df]">
            <Image
              src="/images/orchard-farmer.jpg"
              alt="Cây xoài Cát Hòa Lộc A12"
              fill
              sizes="140px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-1 text-[10px] font-black tracking-[0.12em] text-[#397958]">
              XOÀI CÁT HÒA LỘC
            </p>
            <h3 className="text-lg font-black">Cây A12 · Gói cam kết</h3>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#718077]">
              <MapPin className="size-4" />
              Vườn chú Bảy, Tiền Giang
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 bg-[#f3f5ee] px-2.5 py-1.5 text-[10px]">
                <CalendarDays className="size-3.5" />
                Thu hoạch 12–15.06.2027
              </span>
              <span className="flex items-center gap-1 bg-[#f3f5ee] px-2.5 py-1.5 text-[10px]">
                <Leaf className="size-3.5" />
                Cam kết tối thiểu 18kg
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 border-t border-dashed border-[#dce2d5] pt-4">
          <div className="mb-2 flex justify-between text-xs">
            <span>Tiến độ mùa vụ · Ngày 42/180</span>
            <b>23%</b>
          </div>
          <div className="h-2 overflow-hidden bg-[#e7ebe4]">
            <div className="h-full w-[23%] bg-[#397958]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span>
              <small className="block text-[#718077]">Giá thuê trọn vụ</small>
              <b className="text-xl">2.290.000đ</b>
            </span>
            <Link href="/my-garden" className="vn-btn min-h-10 px-4">
              Xem cây <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </article>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/my-garden"
          className="flex items-center justify-between rounded-md border border-[#dce2d5] bg-white p-4 text-sm font-bold"
        >
          <span className="flex items-center gap-2">
            <Sprout className="size-5" />
            Vườn
          </span>
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/account/profile"
          className="flex items-center justify-between rounded-md border border-[#dce2d5] bg-white p-4 text-sm font-bold"
        >
          <span className="flex items-center gap-2">
            <UserRound className="size-5" />
            Thông tin
          </span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
