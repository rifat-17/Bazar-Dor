import type { Metadata } from "next";
import type { Product } from "@/lib/utils";
import BazarClient from "./BazarClient";

export const metadata: Metadata = {
  title: "আমার বাজার | বাজার দর",
  description:
    "নিজের বাজারের তালিকা, আজকের খরচ, দামের পরিবর্তন আর সবচেয়ে সস্তা বাজার এক জায়গায়।",
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

async function getProducts(): Promise<Product[]> {
  const res = await fetch(API_URL, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function BazarPage() {
  let products: Product[] = [];
  let failed = false;

  try {
    products = await getProducts();
  } catch {
    failed = true;
  }

  if (failed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl">😢</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          পণ্যের দাম লোড করা যায়নি
        </h1>
        <p className="mt-2 text-gray-500">
          ইন্টারনেট সংযোগ পরীক্ষা করে পেজটি আবার রিফ্রেশ করুন।
        </p>
      </div>
    );
  }

  return <BazarClient products={products} />;
}
