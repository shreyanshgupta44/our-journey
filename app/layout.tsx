import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import AuthGuard from "@/components/AuthGuard";
import { GuestProvider } from "@/components/GuestContext";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Our Journey — A Love Story in Places",
  description:
    "A private couples travel album — every road we walked, every sunset we shared.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen">
        <AuthGuard>
          <GuestProvider>
            <main className="animate-fade-in">{children}</main>
          </GuestProvider>
        </AuthGuard>
      </body>
    </html>
  );
}
