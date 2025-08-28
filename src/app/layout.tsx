import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "../components/ConditionalLayout";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Melvin Diamonds - Premium Diamond & Gold Jewelry Store in Gorakhpur",
  description:
    "Melvin Diamonds offers the finest collection of diamond rings, gold jewelry, and engagement rings in Gorakhpur. Visit our showroom for personalized service and certified diamonds at competitive prices.",
  keywords: [
    "diamond jewelry Gorakhpur",
    "gold jewelry store Gorakhpur",
    "engagement rings Gorakhpur",
    "wedding jewelry Gorakhpur",
    "diamond rings Gorakhpur",
    "certified diamonds Gorakhpur",
    "gold ornaments Gorakhpur",
    "jewelry store Gorakhpur",
    "diamond necklace Gorakhpur",
    "gold earrings Gorakhpur",
    "bridal jewelry Gorakhpur",
    "luxury jewelry Gorakhpur",
    "Melvin Diamonds",
    "diamond shop Gorakhpur",
    "jewelry showroom Gorakhpur",
  ],
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title:
      "Melvin Diamonds - Premium Diamond & Gold Jewelry Store in Gorakhpur",
    description:
      "Discover exquisite diamond rings, gold jewelry, and engagement rings at Melvin Diamonds in Gorakhpur. Personalized service and certified diamonds at competitive prices.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Melvin Diamonds - Premium Diamond & Gold Jewelry Store in Gorakhpur",
    description:
      "Discover exquisite diamond rings, gold jewelry, and engagement rings at Melvin Diamonds in Gorakhpur. Personalized service and certified diamonds at competitive prices.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} font-playfair antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
