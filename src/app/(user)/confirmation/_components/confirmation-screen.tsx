"use client";
import { ArrowRight, Printer, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/user-navigation/shared-ui";

export function SuccessScreen() {
  return (
    <div className="vn-success">
      <p>BẢN MẪU</p>
      <h1>Hợp đồng đồng hành mùa vụ</h1>
      <span>Xem thông tin mùa vụ và in bản mẫu để lưu hoặc xem trước.</span>
      <section className="mt-5 flex justify-center sm:justify-end" aria-label="Thao tác hợp đồng">
        <button type="button" className="vn-btn" onClick={() => window.print()}>
          <Printer aria-hidden="true" /> In hợp đồng
        </button>
      </section>
      <article className="vn-contract-paper">
        <ShieldCheck aria-hidden="true" />
        <small>VƯỜN NHÀ · HỢP ĐỒNG MÙA VỤ MẪU</small>
        <h2>Xoài Cát Hòa Lộc · A12</h2>
        <p>Mã tham chiếu mẫu: <b>TTTN-A12-261109</b></p>
        <dl className="mt-6 grid gap-4 border-t pt-5 text-left text-sm sm:grid-cols-2">
          {[
            ["Người đồng hành", "Mai Anh"],
            ["Nhà vườn chăm sóc", "Vườn chú Bảy · Tiền Giang"],
            ["Gói mùa vụ", "Gói cam kết"],
            ["Giá thuê minh họa", "2.290.000 ₫"],
            ["Ngày bắt đầu", "09.11.2026"],
            ["Dự kiến thu hoạch", "Tháng 06.2027"],
            ["Sản lượng minh họa", "Tối thiểu 18 kg"],
            ["Giao nhận", "Thỏa thuận với nhà vườn"],
          ].map(([label, value]) => (
            <div key={label}><dt className="text-[#66796d]">{label}</dt><dd className="font-semibold">{value}</dd></div>
          ))}
        </dl>
        <p className="mt-6 border-t pt-4 text-left text-sm">Thông tin minh họa. Bản in này chưa được phát hành cho đơn hàng thực tế.</p>
      </article>
      <div className="flex-wrap">
        <Button href="/my-garden">Vào vườn của tôi <ArrowRight /></Button>
        <Button href="/" light><Share2 />Chia sẻ</Button>
      </div>
    </div>
  );
}
