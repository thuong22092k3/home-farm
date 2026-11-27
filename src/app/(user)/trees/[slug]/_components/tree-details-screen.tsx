"use client";

import Image from "next/image";
import { CalendarDays, Leaf, MapPin, MessageCircle, ShieldCheck, Star, UserRound } from "lucide-react";
import { BackLink, Button } from "@/components/user-navigation/shared-ui";
import { useFarmsQuery } from "@/data/api/farm/farm.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getFarmName, getPlotImage } from "@/lib/helpers/customer-catalog.helper";

export function TreeDetailScreen({ plotId }: { plotId: string }) {
  const plotQuery = usePlotQuery(plotId);
  const farmsQuery = useFarmsQuery();

  if (plotQuery.isPending) return <section className="vn-section min-h-[60vh] animate-pulse bg-[#e8eadf]" />;
  if (plotQuery.isError) return <section className="vn-section"><BackLink href="/explore">Quay lại khám phá</BackLink><h1>Không tìm thấy cây này</h1></section>;

  const plot = plotQuery.data;
  const farmName = getFarmName(farmsQuery.data?.data, plot.farmId);
  const harvest = new Intl.DateTimeFormat("vi-VN", { month: "2-digit", year: "numeric" }).format(new Date(plot.expectedHarvestAt));
  return <section className="vn-section"><BackLink href="/explore">Khám phá / {plot.cropType}</BackLink><div className="vn-detail"><div className="vn-tree360"><Image src={getPlotImage(plot)} alt={plot.cropType} fill priority sizes="50vw"/><b>↻ Kéo để xem toàn cảnh</b></div><div className="vn-detail-copy"><p className="vn-tags">{plot.status}　·　ĐÃ XÁC MINH</p><h1>{plot.cropType} <i>Mã cây {plot.id}</i></h1><span><MapPin />{farmName}</span><div className="vn-stars"><Star />Mùa vụ {plot.season}</div><p>Cây được nhà vườn xác minh và cập nhật minh bạch qua nhật ký chăm sóc. Bạn nhận quyền theo dõi toàn bộ mùa vụ sau khi hoàn tất đăng ký.</p><div className="vn-metrics"><span><Leaf /><small>MÙA VỤ</small><b>{plot.season}</b></span><span><CalendarDays /><small>THU HOẠCH</small><b>{harvest}</b></span><span><ShieldCheck /><small>TRẠNG THÁI</small><b>{plot.status}</b></span></div><article className="vn-farmer"><UserRound/> <span><small>NHÀ VƯỜN CHĂM SÓC</small><b>{farmName}</b></span><button><MessageCircle /></button></article><div className="vn-buy"><span><small>Giá cơ bản theo vụ</small><b>{formatVnd(plot.price)}</b></span><Button href={`/plans?plotId=${plot.id}`}>Chọn cây này</Button></div></div></div></section>;
}
