"use client";
import { ArrowRight, Check, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/user-navigation/shared-ui";

export function SuccessScreen(){return <div className="vn-success"><i><Check/></i><p>THANH TOÁN THÀNH CÔNG</p><h1>Chào mừng cây A12<br/>về với gia đình bạn!</h1><span>Hợp đồng mùa vụ đã được khởi tạo. Chú Bảy sẽ cập nhật trong 24 giờ.</span><article><ShieldCheck/><small>GIẤY CHỨNG NHẬN ĐỒNG HÀNH MÙA VỤ</small><h2>Xoài Cát Hòa Lộc · A12</h2><p>Người đồng hành: <b>Mai Anh</b></p><div><span>Bắt đầu<b>09.11.2026</b></span><span>Thu hoạch<b>Tháng 06.2027</b></span><span>Cam kết<b>Tối thiểu 18kg</b></span></div><em>TTTN-A12-261109</em></article><div><Button href="/my-garden">Vào vườn của tôi <ArrowRight/></Button><Button href="/" light><Share2/>Chia sẻ</Button></div></div>}
