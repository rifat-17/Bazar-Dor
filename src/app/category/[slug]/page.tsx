"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { type Product, type Category } from "@/lib/utils";
import Link from "next/link";
import Cards from "@/app/components/Cards";
import SortDropdown from "@/app/components/SortDropdown";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

interface CategoryState {
  slug: string;
  products: Product[];
  category: Category | null;
  error: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [state, setState] = useState<CategoryState | null>(null);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(`${API_URL}/products?category=${slug}`).then((res) => {
        if (!res.ok) throw new Error("Products fetch failed");
        return res.json();
      }),
      fetch(`${API_URL}/categories/${slug}`).then((res) => {
        if (!res.ok) throw new Error("Category fetch failed");
        return res.json();
      }),
    ])
      .then(([productsData, categoryData]) => {
        if (cancelled) return;

        const products: Product[] = Array.isArray(productsData)
          ? productsData
          : [];

        setState({
          slug,
          products,
          category: categoryData,
          error: products.length === 0,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ slug, products: [], category: null, error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // slug বদলালে আগের ডেটা আর বৈধ নয়, তাই লোডিং হিসেবে ধরা হয়।
  const loading = state?.slug !== slug;
  const products = loading ? [] : state.products;
  const category = loading ? null : state.category;
  const error = !loading && state.error;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0; // default — API order
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card mb-8 h-20 animate-pulse bg-gray-100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error / Empty State — 404 type
  if (error || products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          কোনো পণ্য পাওয়া যায়নি
        </h2>
        <p className="text-gray-500 mb-6">
          এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ক্যাটাগরিটি সঠিক নয়।
        </p>
        <Link href="/" className="btn btn-success text-white">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>{category?.icon}</span>
            {category?.nameBn}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>
      </div>

      <div className="card mb-4 items-end">
        {/* Sort Dropdown (C1 Challenge) */}
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {sortedProducts.map((product) => (
          <Cards key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
