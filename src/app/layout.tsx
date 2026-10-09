import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";
import MarqueeText from "react-marquee-text";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-geist-sans",
  subsets: ["latin", "bengali"],
});



export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "A Next.js 13 e-commerce app built with Tailwind CSS, TypeScript.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${notoSerifBengali.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
       
        {children}</body>
    </html>
  );
}
