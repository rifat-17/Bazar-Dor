"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


import { type Product, type Category } from "@/lib/utils";
import Link from "next/link";
import Cards from "@/app/components/Cards";
import SortDropdown from "@/app/components/SortDropdown";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setLoading(true);
    setError(false);

    Promise.all([
      fetch(
        `https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`
      ).then((res) => {
        if (!res.ok) throw new Error("Products fetch failed");
        return res.json();
      }),
      fetch(
        `https://openapi.programming-hero.com/api/bazardor/categories/${slug}`
      ).then((res) => {
        if (!res.ok) throw new Error("Category fetch failed");
        return res.json();
      }),
    ])
      .then(([productsData, categoryData]) => {
        if (!productsData || productsData.length === 0) {
          setError(true);
        } else {
          setProducts(productsData);
          setCategory(categoryData);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Sort products 
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0; // default — API order
  });

  

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>{category?.icon}</span>
            {category?.nameBn}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            এই ক্যাটাগরিতে মোট {products.length}টি পণ্য
          </p>
        </div>
        {/* Sort Dropdown (C1 Challenge) */}
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedProducts.map((product) => (
          <Cards key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}