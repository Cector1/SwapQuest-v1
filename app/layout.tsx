import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WldBalanceProvider } from '@/hooks/useArenaBalance';
import { WorldCoinAuthHeader } from '@/components/worldcoin-auth-header';
import { Toaster } from 'sonner';
import { MiniKitProvider } from '@worldcoin/minikit-js/minikit-provider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SwapQuest - WorldCoin x AVAX Gaming",
  description: "WorldCoin MiniApp for Gaming DApp on Avalanche Fuji with Real Swaps",
  applicationName: "SwapQuest",
  authors: [{ name: "SwapQuest Team" }],
  keywords: ["worldcoin", "miniapp", "avalanche", "defi", "gaming", "crypto", "swap"],
  manifest: "/manifest.json",
  themeColor: "#1616b4",
  colorScheme: "light",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "SwapQuest",
    title: "SwapQuest - WorldCoin x AVAX Gaming",
    description: "WorldCoin MiniApp for Gaming DApp on Avalanche Fuji with Real Swaps",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SwapQuest - WorldCoin MiniApp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwapQuest - WorldCoin x AVAX Gaming",
    description: "WorldCoin MiniApp for Gaming DApp on Avalanche Fuji with Real Swaps",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SwapQuest",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "worldcoin:app_id": "swapquest-miniapp",
    "worldcoin:version": "1.0.0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#1616b4" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}>
        <MiniKitProvider>
          <WldBalanceProvider>
            <div className="min-h-screen">
              <WorldCoinAuthHeader />
              {children}
            </div>
            <Toaster 
              position="top-center"
              theme="light"
              richColors
            />
          </WldBalanceProvider>
        </MiniKitProvider>
      </body>
    </html>
  );
}
