import type { Metadata } from "next";
import { Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { SentinelProvider } from "../lib/store";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron'
});

const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-rajdhani'
});

const shareTechMono = Share_Tech_Mono({
  weight: ['400'],
  subsets: ["latin"],
  variable: '--font-share-tech-mono'
});

export const metadata: Metadata = {
  title: 'SENTINEL — Threat Intelligence Platform',
  description: 'Real-time cybersecurity threat monitoring powered by Claude AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <body className="font-sans">
        <SentinelProvider>
          {children}
        </SentinelProvider>
      </body>
    </html>
  );
}
