
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Cards from "@/app/components/Cards";

const API_URL =
  "https://api.api-store.workers.dev/api/bazardor/products";

const CategoryPage = () => {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        // Supports common API response formats
        const allProducts = Array.isArray(data)
          ? data
          : data.products ?? data.data ?? [];

        const filteredProducts = allProducts.filter(
          (product) => product.category === slug
        );

        setProducts(filteredProducts);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  // Sort products by today's price
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low-to-high") {
      return a.today - b.today;
    }

    if (sort === "high-to-low") {
      return b.today - a.today;
    }

    return 0;
  });

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F0F5F0] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-gray-600">
            পণ্য লোড হচ্ছে...
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-gray-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="mt-6 h-3 w-1/3 rounded bg-gray-100" />
                <div className="mt-3 h-7 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Empty state or invalid category
  if (error || products.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F0F5F0] px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">🔎</div>

          <h1 className="text-2xl font-bold text-gray-900">
            {error
              ? "পণ্য লোড করা যায়নি"
              : "কোনো পণ্য পাওয়া যায়নি"}
          </h1>

          <p className="mt-3 text-gray-600">
            {error
              ? "আবার চেষ্টা করুন অথবা হোম পেজে ফিরে যান।"
              : "এই ক্যাটাগরিতে কোনো পণ্য নেই, অথবা ক্যাটাগরিটি সঠিক নয়।"}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  // Category page
  const category = products[0];

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-600">
            হোম
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">
            {category.categoryNameBn}
          </span>
        </div>

        {/* Title and sorting */}
        <div  >
          <div className="flex flex-1 py-6 px-10 rounded-2xl  bg-white mb-8 gap-5 ">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              {category.categoryIcon}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {category.categoryNameBn}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {products.length.toLocaleString("bn-BD")}টি পণ্যের আজকের দাম ও পরিবর্তন
              </p>
            </div>
          </div>

          {/* Sort control */}
          <div className=" bg-white justify-end px-2 py-4 flex flex-col gap-2 mb-4 
          rounded-2xl sm:flex-row sm:items-center">
            <label
              htmlFor="sort"
              className="shrink-0 text-sm font-medium text-gray-700"
            >
              সাজান:
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-to-high">
                দাম: কম থেকে বেশি
              </option>
              <option value="high-to-low">
                দাম: বেশি থেকে কম
              </option>
            </select>
          </div>
        </div>

                <div className="mb-4">
                    <p>মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে</p>
                </div>
        {/* Product cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {sortedProducts.map((product) => (
            <Cards key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
