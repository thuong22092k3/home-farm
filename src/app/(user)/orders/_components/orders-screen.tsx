"use client";

import { PackageCheck, Sprout, Truck } from "lucide-react";
import { Title } from "@/components/user-navigation/shared-ui";

export function OrdersScreen() {
  const orders = [{ icon: Truck, status: "ĐANG GIAO", title: "Mật ong hoa cà phê", detail: "Dự kiến giao hôm nay" }, { icon: Sprout, status: "ĐÃ XÁC NHẬN", title: "Mùa quả cây Xoài A12", detail: "Thu hoạch 12–15.06.2027" }];
  return <section className="vn-narrow"><Title eyebrow="THEO DÕI GIAO NHẬN" title="Đơn hàng của tôi" sub="Quản lý đơn OCOP và các đợt giao mùa vụ." /><div className="vn-tabs"><button>Tất cả 3</button><button>Đang giao</button><button>Hoàn tất</button></div><div className="vn-orders">{orders.map((order) => <article key={order.title}><header><b>{order.status}</b><small>#OCOP-261108</small></header><div><i><order.icon /></i><span><b>{order.title}</b><small>Vườn Nhà · Đã xác minh</small><em>{order.detail}</em></span><PackageCheck /></div></article>)}</div></section>;
}
