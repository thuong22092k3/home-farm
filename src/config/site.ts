export const siteConfig = {
  name: "Vườn Nhà",
  legalName: "Trương Minh Trí",
  // Keep production SEO links valid even when the Vercel env var is missing.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://home-farm-two.vercel.app",
  phone: "+84377996467",
  phoneDisplay: "0377 996 467",
  address: {
    street: "Số 7 Nguyễn Bỉnh Khiêm",
    locality: "Phường Sài Gòn",
    region: "TP. Hồ Chí Minh",
    country: "VN",
  },
  sameAs: ["https://www.facebook.com/profile.php?id=61595059900977"],
  seededCatalog: {
    orchard: "Vườn mẫu miền Tây",
    area: "Đồng bằng sông Cửu Long",
    season: "Mùa vụ 2026",
    trees: [
      { id: "SR-03", variety: "Sầu riêng Ri6", price: 2200000, yield: "25–40 kg", daysToHarvest: 46 },
      { id: "SR-05", variety: "Sầu riêng Ri6", price: 2400000, yield: "30–45 kg", daysToHarvest: 53 },
      { id: "SR-07", variety: "Sầu riêng Monthong", price: 2900000, yield: "35–50 kg", daysToHarvest: 41 },
      { id: "SR-08", variety: "Sầu riêng Ri6", price: 2400000, yield: "30–45 kg", daysToHarvest: 42 },
    ],
  },
} as const;
