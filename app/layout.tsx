import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CursorProvider } from "@/components/CursorContext";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Portfolio | Visuals & Motion",
  description: "A breathtaking cinematic creative portfolio featuring photography, videography, and drone imagery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <CursorProvider>
          <Preloader />
          <CustomCursor />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
