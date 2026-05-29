import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "500", "700"]
});

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"]
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"]
});

export const metadata: Metadata = {
  title: "玉林軒株式会社",
  description: "骨董・古美術の鑑定、買取、販売を行う玉林軒株式会社の公式サイトです。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${serif.variable} ${sans.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
