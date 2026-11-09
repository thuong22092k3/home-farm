import { TreeDetailScreen } from "./_components/tree-details-screen";
import { trees } from "@/data/user-catalog";

export function generateStaticParams(){return trees.map((tree)=>({slug:tree.slug}))}
export const instant = false;
export default async function Page({params}:{params:Promise<{slug:string}>}){await params;return <TreeDetailScreen/>}
