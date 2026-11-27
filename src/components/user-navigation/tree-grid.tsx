"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Leaf } from "lucide-react";
import { useFarmsQuery } from "@/data/api/farm/farm.hooks";
import { usePlotsQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getFarmName, getPlotImage } from "@/lib/helpers/customer-catalog.helper";

export function TreeGrid({ repeat = false }: { repeat?: boolean }) {
  const plotsQuery = usePlotsQuery({ status: "AVAILABLE" });
  const farmsQuery = useFarmsQuery();

  if (plotsQuery.isPending || farmsQuery.isPending) {
    return <div className="vn-tree-grid" aria-busy="true">{Array.from({ length: repeat ? 6 : 3 }, (_, index) => <div className="vn-tree-card min-h-80 animate-pulse bg-[#e8eadf]" key={index} />)}</div>;
  }

  if (plotsQuery.isError) {
    return <p className="py-10 text-sm text-[#a44f3e]">Không tải được danh sách cây. Vui lòng kiểm tra kết nối API.</p>;
  }

  const items = repeat ? plotsQuery.data?.data : plotsQuery.data?.data.slice(0, 3);
  return <div className="vn-tree-grid">{items.map((plot, index) => <Link href={`/trees/${plot.id}`} key={plot.id} className="vn-tree-card"><div style={{ background: ["#e7f1b4", "#ffe2aa", "#d5ebc1"][index % 3] }}><Image src={getPlotImage(plot)} alt={plot.cropType} fill sizes="(max-width: 720px) 50vw, 28vw" /><em>{plot.status === "AVAILABLE" ? "Đang mở nhận nuôi" : plot.status}</em><Heart /></div><small>{getFarmName(farmsQuery.data?.data, plot.farmId)}</small><h3>{plot.cropType}</h3><footer><b>{formatVnd(plot.price)}<small>/ vụ</small></b><span><Leaf />{plot.season}</span></footer></Link>)}</div>;
}
