"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Gift, ShieldCheck, Sprout, Sun } from "lucide-react";
import { Button, Title } from "@/components/user-navigation/shared-ui";
import { usePlansQuery } from "@/data/api/plan/plan.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getPlanPrice } from "@/lib/helpers/customer-catalog.helper";

const planIcons = { SEASONAL: Sprout, GUARANTEED: ShieldCheck, GIFT: Gift, EXPERIENCE: Sun } as const;
const descriptions: Record<string, string> = { SEASONAL: "Nhận toàn bộ sản lượng thực tế", GUARANTEED: "Đảm bảo sản lượng tối thiểu", GIFT: "Chứng nhận, thiệp và hộp quà", EXPERIENCE: "Cả nhà về vườn tự thu hoạch" };

export function PackageScreen(){
  const searchParams = useSearchParams();
  const plotId = searchParams.get("plotId") ?? "";
  const plotQuery = usePlotQuery(plotId);
  const plansQuery = usePlansQuery();
  const[pick,setPick]=useState(0);
  if (plotQuery.isPending || plansQuery.isPending) return <section className="vn-narrow min-h-[60vh] animate-pulse bg-[#e8eadf]"/>;
  if (plotQuery.isError || plansQuery.isError || plansQuery.data.length === 0) return <section className="vn-narrow"><Title eyebrow="KHÔNG THỂ TẢI" title="Chưa có gói mùa vụ" sub="Vui lòng quay lại và thử lại sau."/></section>;
  const plot = plotQuery.data;
  const plans = plansQuery.data;
  const selected = plans[Math.min(pick, plans.length - 1)];
  return <section className="vn-narrow"><FlowSteps/><Title eyebrow={`${plot.cropType.toUpperCase()} · ${plot.id}`} title="Chọn cách bạn muốn đồng hành" sub="Bạn có thể thay đổi quyền lợi trước khi vụ mùa bắt đầu."/><div className="vn-package-list">{plans.map((plan,index)=>{const Icon=planIcons[plan.type as keyof typeof planIcons]??Sprout;return <button className={pick===index?"active":""} onClick={()=>setPick(index)} key={plan.id}><i><Icon/></i><span><b>{plan.name}</b><small>{descriptions[plan.type]??`${plan.durationMonths} tháng đồng hành cùng nhà vườn`}</small></span><strong>{formatVnd(getPlanPrice(plot,plan))}<small>/ vụ</small></strong><em>{pick===index&&<Check/>}</em></button>})}</div><div className="vn-summary"><span><small>Tổng thanh toán</small><b>{formatVnd(getPlanPrice(plot,selected))}</b></span><Button href={`/checkout?plotId=${plot.id}&planId=${selected.id}`}>Tiếp tục thanh toán <ArrowRight/></Button></div></section>}

function FlowSteps(){return <div className="vn-steps"><span className="done"><i><Check/></i>Chọn cây</span><b/><span className="active"><i>2</i>Chọn gói</span><b/><span><i>3</i>Thanh toán</span></div>}
