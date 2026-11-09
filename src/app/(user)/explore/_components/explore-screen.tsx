import { Leaf, Search } from "lucide-react";
import { Title } from "@/components/user-navigation/shared-ui";
import { TreeGrid } from "@/components/user-navigation/tree-grid";

export function ExploreScreen() {
  return <section className="vn-section"><Title eyebrow="BẢN ĐỒ NÔNG TRẠI" title="Tìm một góc vườn dành cho bạn" sub="12 nhà vườn · 48 cây đang mở nhận nuôi" /><div className="vn-search"><Search /><input placeholder="Tìm cây, nhà vườn hoặc vùng trồng..." /><button>Tìm kiếm</button></div><div className="vn-chips">{["Tất cả", "Trái cây", "Rau củ", "Miền Tây", "Dưới 2 triệu", "Bộ lọc"].map((item) => <button key={item}>{item}</button>)}</div><div className="vn-explore"><div><b>48 kết quả</b><TreeGrid repeat /></div><div className="vn-map"><span className="p1">4</span><span className="p2">7</span><span className="p3">12</span><article><Leaf/><b>Vườn chú Bảy</b><small>4 cây đang trống</small></article></div></div></section>;
}
