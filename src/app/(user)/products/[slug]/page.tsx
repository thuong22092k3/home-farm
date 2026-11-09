import { ProductScreen } from "./_components/product-screen";
import { products } from "@/data/user-catalog";

export function generateStaticParams(){return products.map((product)=>({slug:product.slug}))}
export const instant = false;
export default async function Page({params}:{params:Promise<{slug:string}>}){await params;return <ProductScreen/>}
