import type { Metadata } from "next";
import { Inter, Oxanium } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const oxanium = Oxanium({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAPS CAPIT",
  description: "Dapatkan vouchermu sekarang juga!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={oxanium.className}>{children}</body>
    </html>
  );
}
