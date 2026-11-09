"use client";
import { useState } from "react";
import { ArrowRight, Check, Gift, ShieldCheck, Sprout, Sun } from "lucide-react";
import { Button, Title } from "@/components/user-navigation/shared-ui";

const plans = [[Sprout,"Thuê theo vụ","Nhận toàn bộ sản lượng thực tế","1.890.000đ"],[ShieldCheck,"Gói cam kết","Đảm bảo tối thiểu 18kg","2.290.000đ"],[Gift,"Gói quà tặng","Chứng nhận, thiệp và hộp quà","2.490.000đ"],[Sun,"Trải nghiệm vườn","Cả nhà về vườn tự thu hoạch","2.690.000đ"]] as const;

export function PackageScreen(){const[pick,setPick]=useState(1);return <section className="vn-narrow"><FlowSteps/><Title eyebrow="XOÀI CÁT HÒA LỘC · A12" title="Chọn cách bạn muốn đồng hành" sub="Bạn có thể thay đổi quyền lợi trước khi vụ mùa bắt đầu."/><div className="vn-package-list">{plans.map(([Icon,title,description,price],index)=><button className={pick===index?"active":""} onClick={()=>setPick(index)} key={title}><i><Icon/></i><span><b>{title}</b><small>{description}</small></span><strong>{price}<small>/ vụ</small></strong><em>{pick===index&&<Check/>}</em></button>)}</div><div className="vn-summary"><span><small>Tổng thanh toán</small><b>{plans[pick][3]}</b></span><Button href="/checkout">Tiếp tục thanh toán <ArrowRight/></Button></div></section>}

function FlowSteps(){return <div className="vn-steps"><span className="done"><i><Check/></i>Chọn cây</span><b/><span className="active"><i>2</i>Chọn gói</span><b/><span><i>3</i>Thanh toán</span></div>}
