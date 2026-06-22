import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BLVCK CORE | Ultra-Premium Avant-Garde Minimalist Luxury Apparel",
  description: "Experience the pinnacle of luxury with our curated collection of ultra-premium, highly breathable, carbon-dense matte black clothing.",
  metadataBase: new URL("https://blvck.vercel.app"),
  openGraph: {
    title: "BLVCK CORE | Ultra-Premium Black Apparel",
    description: "Avant-Garde Minimalist luxury black clothing engineered for breathability and fit.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
