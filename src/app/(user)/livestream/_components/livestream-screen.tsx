"use client";
import Image from "next/image";
import { ArrowRight, Leaf, Share2 } from "lucide-react";
import { Button } from "@/components/user-navigation/shared-ui";

export function LiveScreen(){return <div className="vn-live"><div className="vn-video"><Image src="/images/orchard-farmer.jpg" alt="Nông dân đang thu hoạch trong vườn" fill priority sizes="70vw"/><span className="vn-live-badge">● LIVE　248 người xem</span><article><h2>Thăm vườn xoài đầu mùa cùng chú Bảy</h2><p>Lan Anh: Cây A12 còn không chú ơi?</p><p>Minh Tú: Nhìn cây khỏe quá</p></article></div><aside><div className="vn-live-product"><Leaf/> <span><small>ĐANG GIỚI THIỆU</small><b>Xoài Cát Hòa Lộc A12</b><em>1.890.000đ / vụ</em></span><Share2/></div><article><small>ƯU ĐÃI TRONG LIVE</small><b>Tặng chuyến tham quan vườn</b><span>Kết thúc sau 08:42</span></article><Button href="/plans">Nhận nuôi cây này</Button><label>Trò chuyện trực tiếp<div><input placeholder="Nhắn gì đó cho nhà vườn..."/><button><ArrowRight/></button></div></label></aside></div>}
