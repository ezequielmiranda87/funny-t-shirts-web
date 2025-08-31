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
  title: "Funny T-Shirts Shop - Hilarious T-Shirts for Every Personality",
  description: "Discover hilarious t-shirt designs that will make you and others laugh. Premium quality funny t-shirts for every personality.",
  keywords: [
    "funny t-shirts",
    "humor apparel", 
    "comedy shirts",
    "graphic tees",
    "joke shirts",
    "sarcastic t-shirts",
    "witty clothing",
    "funny gifts",
    "novelty shirts",
    "humorous apparel"
  ],
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
    locale: "en_US", 
    url: "https://funny-t-shirts-shop.com",
    title: "Funny T-Shirts Shop",
    description: "Discover hilarious t-shirt designs that will make you and others laugh. Premium quality funny t-shirts for every personality.",
    siteName: "Funny T-Shirts Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Funny T-Shirts Shop",
    description: "Discover hilarious t-shirt designs that will make you and others laugh. Premium quality funny t-shirts for every personality.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
