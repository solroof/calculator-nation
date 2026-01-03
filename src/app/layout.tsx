import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "계산기나라 - 다양한 온라인 계산기",
    template: "%s | 계산기나라",
  },
  description: "삼각형, 넓이, 부피, 비율 등 다양한 수학 계산기를 무료로 제공합니다. 모바일에서도 편리하게 사용하세요.",
  keywords: ["계산기", "온라인 계산기", "삼각형 계산기", "수학 계산기", "넓이 계산기", "무료 계산기"],
  authors: [{ name: "계산기나라" }],
  creator: "계산기나라",
  publisher: "계산기나라",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "계산기나라",
    title: "계산기나라 - 다양한 온라인 계산기",
    description: "삼각형, 넓이, 부피, 비율 등 다양한 수학 계산기를 무료로 제공합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "계산기나라 - 다양한 온라인 계산기",
    description: "삼각형, 넓이, 부피, 비율 등 다양한 수학 계산기를 무료로 제공합니다.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <Header />
        <main className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
