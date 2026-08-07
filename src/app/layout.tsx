import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import "./tapa-styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "तप् · The Tapa Company",
  description: "Dharma doesn't demand fear, it demands devotion. Step-by-step ritual guides, Panchang, and Puja Samagri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
