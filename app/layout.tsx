import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consignment Stores Near Me - Find the Best Consignment Shops in Your Area",
  description: "Discover the best consignment stores near you. Browse thousands of consignment shops across the United States by city and state. Find quality second-hand items, furniture, clothing, and more.",
  keywords: "consignment stores, consignment shops, second hand stores, thrift stores, resale shops, used furniture, vintage clothing",
  openGraph: {
    title: "Consignment Stores Near Me",
    description: "Find the best consignment stores in your area",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consignment Stores Near Me",
    description: "Find the best consignment stores in your area",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
