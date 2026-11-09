"use client";
import { useState } from "react";
import { ArrowRight, Check, Gift, MapPin, Truck } from "lucide-react";
import { Button, Title } from "@/components/user-navigation/shared-ui";

export function HarvestScreen(){const[pick,setPick]=useState(0);const options=[[Truck,"Giao tận nhà","Chuỗi lạnh trong 36 giờ","Miễn phí"],[MapPin,"Về vườn tự thu hoạch","Trải nghiệm cho gia đình 4 người","+300.000đ"],[Gift,"Chia sẻ mùa quả","Gửi tặng bạn bè, người thân","Từ 35.000đ"]] as const;return <section className="vn-narrow"><div className="vn-harvest-title">🥭 <Title eyebrow="SẮP ĐẾN NGÀY THU HOẠCH" title="18–22kg xoài đang chờ bạn" sub="Dự kiến 12–15.06.2027"/></div><h2>Bạn muốn nhận mùa quả thế nào?</h2><div className="vn-options">{options.map(([Icon,title,desc,price],index)=><button className={pick===index?"active":""} onClick={()=>setPick(index)} key={title}><Icon/><span><b>{title}</b><small>{desc}</small><em>{price}</em></span><i>{pick===index&&<Check/>}</i></button>)}</div><div className="vn-summary"><span><small>Lựa chọn</small><b>{options[pick][1]}</b></span><Button href="/orders">Xác nhận <ArrowRight/></Button></div></section>}
