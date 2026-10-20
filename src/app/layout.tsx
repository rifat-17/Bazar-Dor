import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";


import Footer from "./components/Footer";
import { BazarProvider } from "./components/BazarProvider";
import { Toaster } from "react-hot-toast";

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
        <BazarProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </BazarProvider>
        <Toaster position="top-center" reverseOrder={false} />
        </body>
      
    </html>
  );
}
