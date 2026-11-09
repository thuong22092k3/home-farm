"use client";

import { useState } from "react";
import Image from "next/image";
import { QrCode, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import { BackLink, Button } from "@/components/user-navigation/shared-ui";

export function ProductScreen() {
  const [qty, setQty] = useState(1);
  return <section className="vn-section"><BackLink href="/marketplace">Chợ OCOP / Mật ong hoa cà phê</BackLink><div className="vn-product"><div><Image src="/images/honey-flowers.jpg" alt="Mật ong hoa cà phê" fill sizes="50vw" /><em>OCOP<br /><b>4 SAO</b></em></div><section><p>ĐẮK LẮK · TRUY XUẤT NGUỒN GỐC</p><h1>Mật ong hoa cà phê nguyên chất</h1><span><Star />4.9 · 126 đánh giá · Đã bán 1.2k</span><p>Thu hoạch đúng mùa hoa cà phê. Không pha đường, không chất bảo quản.</p><h2>180.000đ <small>/ chai 500ml</small></h2><article><ShieldCheck /><span><b>Sản phẩm đã xác minh</b><small>Lô MH-1126 · HTX Ong Rừng Tây Nguyên</small></span><QrCode /></article><label>Số lượng <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b>{qty}</b><button onClick={() => setQty(qty + 1)}>+</button></label><div><Button href="/marketplace" light><ShoppingCart />Thêm vào giỏ</Button><Button href="/checkout">Mua ngay · {(180000 * qty).toLocaleString("vi-VN")}đ</Button></div></section></div></section>;
}
