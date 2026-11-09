import Link from "next/link";
import Image from "next/image";
import { Heart, Leaf } from "lucide-react";
import { trees } from "@/data/user-catalog";

export function TreeGrid({ repeat = false }: { repeat?: boolean }) {
  const items = repeat ? [...trees, ...trees] : trees;
  return <div className="vn-tree-grid">{items.map((tree, index) => <Link href={`/trees/${tree.slug}`} key={`${tree.slug}-${index}`} className="vn-tree-card"><div style={{ background: tree.color }}><Image src={tree.image} alt={tree.name} fill sizes="(max-width: 720px) 50vw, 28vw" /><em>Còn {index % 3 + 2} cây</em><Heart /></div><small>{tree.farm}</small><h3>{tree.name}</h3><footer><b>{tree.price}<small>/ vụ</small></b><span><Leaf />{tree.yield}</span></footer></Link>)}</div>;
}
