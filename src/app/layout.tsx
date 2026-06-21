import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Adatara - Platform SaaS Undangan Digital Premium",
  description: "Buat undangan digital elegan untuk pernikahan, ulang tahun, syukuran, dan acara bisnis Anda dengan Template Builder instan, musik latar, RSVP otomatis, dan amplop digital.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;700;900&family=Lora:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;800&family=Outfit:wght@300;400;600;800&family=Pinyon+Script&family=Playball&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
