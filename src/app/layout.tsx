import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "G Unit Security — Premium Security Services Perth",
    template: "%s | G Unit Security",
  },
  description:
    "Perth's premier security services. VIP protection, crowd control, CCTV, mobile patrols, canine security and more. Licensed, insured, trusted since 2010.",
  keywords: [
    "security services Perth",
    "VIP protection",
    "crowd control",
    "mobile patrols",
    "CCTV monitoring",
    "canine security",
    "G Unit Security",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy-deep text-off-white font-body">
        {children}
      </body>
    </html>
  );
}
