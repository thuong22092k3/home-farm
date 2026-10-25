import { VuonNhaWorkspace } from "@/components/vuon-nha-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bản mẫu giao diện",
  robots: { index: false, follow: false },
};

export default function SamplePage() {
  return <VuonNhaWorkspace />;
}
