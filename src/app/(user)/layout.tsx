import { Suspense, type ReactNode } from "react";
import { UserShell } from "@/components/user-navigation/user-shell";

export default function UserLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#f7f4e9]" />}><UserShell>{children}</UserShell></Suspense>;
}
