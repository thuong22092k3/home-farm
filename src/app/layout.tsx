import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppI18nProvider } from "@/components/i18n-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vườn Nhà",
  description: "Thuê một cây, theo dõi một mùa trái.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppI18nProvider locale="vi">{children}</AppI18nProvider>
      </body>
    </html>
  );
}
