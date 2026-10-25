import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppI18nProvider } from "@/components/i18n-provider";
import { siteConfig } from "@/config/site";
import "./globals.css";

const siteUrl = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vườn Nhà | Thuê cây, theo dõi mùa trái",
    template: "%s | Vườn Nhà",
  },
  description:
    "Thuê một cây, theo dõi từng mùa trái qua ảnh, video và nhật ký chăm sóc. Vườn Nhà đưa trái cây từ nhà vườn đến tận nhà.",
  applicationName: "Vườn Nhà",
  alternates: { canonical: "/" },
  icons: {
    icon: "/avt.png",
    apple: "/avt.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Vườn Nhà",
    title: "Vườn Nhà | Thuê cây, theo dõi mùa trái",
    description:
      "Chọn một cây, theo dõi cả mùa và nhận trái từ nhà vườn đến tận nhà.",
    images: [
      {
        url: "/background.png",
        width: 2007,
        height: 783,
        alt: "Vườn Nhà - thuê cây và theo dõi mùa trái",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vườn Nhà | Thuê cây, theo dõi mùa trái",
    description:
      "Chọn một cây, theo dõi cả mùa và nhận trái từ nhà vườn đến tận nhà.",
    images: ["/background.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteUrl,
    telephone: siteConfig.phone,
    sameAs: siteConfig.sameAs,
    logo: `${siteUrl}/avt.png`,
    image: `${siteUrl}/background.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    description: "Nền tảng kết nối khách thuê với nhà vườn và mùa trái.",
  };

  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <AppI18nProvider locale="vi">{children}</AppI18nProvider>
      </body>
    </html>
  );
}
