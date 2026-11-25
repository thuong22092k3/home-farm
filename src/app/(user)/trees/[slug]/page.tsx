import { TreeDetailScreen } from "./_components/tree-details-screen";

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const { slug } = await params;
  return <TreeDetailScreen plotId={slug}/>;
}
