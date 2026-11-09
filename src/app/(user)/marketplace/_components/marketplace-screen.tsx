"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { products } from "@/data/user-catalog";
import { Title } from "@/components/user-navigation/shared-ui";

export function MarketScreen() {
  return <><section className="vn-market-hero"><div><Title eyebrow="ĐẶC SẢN TỪ NHỮNG VÙNG ĐẤT THẬT" title="Chợ nông sản minh bạch OCOP." sub="Mua trực tiếp từ hợp tác xã và nhà vườn đã xác minh." /><div className="vn-search"><Search /><input placeholder="Bạn đang tìm đặc sản gì?" /><button>Tìm kiếm</button></div></div><div className="vn-market-photo"><Image src="/images/family-harvest.jpg" alt="Gia đình thu hoạch tại vườn" fill sizes="40vw" /></div></section><section className="vn-section"><Title eyebrow="NHÀ VƯỜN ĐỀ XUẤT" title="Đặc sản được yêu thích" /><div className="vn-products">{products.map((product) => <Link key={product.slug} href={`/products/${product.slug}`}><div style={{ background: product.color }}><Image src={product.image} alt={product.name} fill sizes="(max-width:720px) 50vw, 22vw" /><em>OCOP</em></div><small>{product.meta}</small><h3>{product.name}</h3><footer><b>{product.price}</b><span><Star />4.9</span></footer></Link>)}</div></section></>;
}
