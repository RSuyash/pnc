import Header from '@/components/layout/Header';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prithvi Nature Club",
  description: "Official Digital Platform for Prithvi Nature Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased overflow-x-hidden bg-white dark:bg-gray-900`}
      >
        <Header />
        <main className="relative z-0">{children}</main>
      </body>
    </html>
  );
}
