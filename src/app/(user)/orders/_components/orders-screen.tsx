"use client";

import { useState } from "react";
import { PackageCheck, Sprout, Truck } from "lucide-react";
import { Title } from "@/components/user-navigation/shared-ui";
import { useOrdersQuery } from "@/data/api/order/order.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import type { Order } from "@/data/api/order/order.res";
import { formatVnd } from "@/lib/helpers/customer-catalog.helper";
import { useAuthStore } from "@/stores/auth-store";

const filters = [
  { id: "all", label: "Tất cả" },
  { id: "shipping", label: "Đang giao" },
  { id: "completed", label: "Hoàn tất" },
] as const;

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CONFIRMED: "Đã xác nhận",
  GROWING: "Đang chăm sóc",
  READY_TO_HARVEST: "Sắp thu hoạch",
  HARVESTED: "Đã thu hoạch",
  FULFILLING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  REFUNDED: "Đã hoàn tiền",
};

export function OrdersScreen() {
  const id = useAuthStore((state) => state.user?.userId);
  const orders = useOrdersQuery(typeof id === "string" ? id : undefined);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const visibleOrders = orders.data?.data?.filter(({ status }) =>
    filter === "all" || status === (filter === "shipping" ? "FULFILLING" : "COMPLETED"),
  );

  return (
    <section className="vn-narrow">
      <Title eyebrow="THEO DÕI GIAO NHẬN" title="Đơn hàng của tôi" sub="Quản lý đơn OCOP và các đợt giao mùa vụ." />
      <div className="vn-tabs flex-wrap" role="group" aria-label="Lọc đơn hàng">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className="rounded-full border border-[#d8e1d3] bg-white px-4 py-2 text-xs font-bold transition-colors aria-pressed:bg-[#143f30] aria-pressed:text-white"
          >
            {label}{id === "all" && orders.data?.data ? ` ${orders.data?.data.length}` : ""}
          </button>
        ))}
      </div>
      {typeof id !== "string" ? <p>Vui lòng đăng nhập để xem đơn hàng.</p> :
        orders.isPending ? <p role="status">Đang tải đơn hàng…</p> :
        orders.isError ? <p role="alert">Không tải được đơn hàng.</p> :
        !visibleOrders?.length ? <p>Bạn chưa có đơn hàng trong mục này.</p> :
        <div className="vn-orders">{visibleOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
    </section>
  );
}

function OrderCard({ order }: { order: Order }) {
  const plot = usePlotQuery(order.plotId);
  const Icon = order.status === "FULFILLING" ? Truck : Sprout;
  const harvestDate = Date.parse(order.harvestDate);

  return (
    <article>
      <header className="gap-2">
        <b className="uppercase">{statusLabels[order.status] ?? "Đang cập nhật"}</b>
        <small title={order.id}>#{order.id.slice(0, 8).toUpperCase()}</small>
      </header>
      <div>
        <i className="shrink-0"><Icon aria-hidden="true" /></i>
        <span className="min-w-0">
          <b className="break-words">{plot.data?.cropType ?? "Đơn mùa vụ"}</b>
          <small>{formatVnd(order.total)}</small>
          {Number.isFinite(harvestDate) && (
            <em>Dự kiến thu hoạch {new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).format(harvestDate)}</em>
          )}
        </span>
        <PackageCheck className="shrink-0" aria-hidden="true" />
      </div>
    </article>
  );
}
