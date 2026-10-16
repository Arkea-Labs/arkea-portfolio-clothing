import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa Léa · Atelier Feminino | Linho Puro, Seda & Alfaiataria Fluida",
  description:
    "E-commerce de moda feminina autoral em São Paulo. Vestidos em linho puro, alfaiataria fluida e blusas de seda com motor de checkout modular (Stripe 6x sem juros, Pix com 10% OFF ou Consultora via WhatsApp).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-galeria font-sans text-ameixa antialiased">
        {children}
      </body>
    </html>
  );
}
