import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "陈少极 | Shaoji Chen";
const description =
  "陈少极，厦门大学信息与计算科学专业本科生，正在探索 C++、Qt、OpenGL、OCCT 与图形可视化。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || requestHeaders.get("host") || undefined;
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol =
    forwardedProtocol || (host?.startsWith("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : undefined;
  const socialImage = origin ? `${origin}/og.png` : undefined;

  return {
    title,
    description,
    applicationName: "Shaoji Chen Portfolio",
    authors: [{ name: "Shaoji Chen" }],
    keywords: [
      "陈少极",
      "Shaoji Chen",
      "厦门大学",
      "C++",
      "Qt",
      "OpenGL",
      "OCCT",
    ],
    metadataBase: origin ? new URL(origin) : undefined,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      alternateLocale: ["en_US"],
      title,
      description,
      siteName: "Shaoji Chen Portfolio",
      images: socialImage
        ? [
            {
              url: socialImage,
              width: 1730,
              height: 909,
              alt: "陈少极 · Shaoji Chen — 在数学与图形之间探索数字表达",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
