"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cards from "./Cards";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");


                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
                }

                const result = await response.json();

                const data = Array.isArray(result)
                    ? result
                    : result.products ??
                    result.data?.products ??
                    result.data ??
                    result.results ??
                    [];

                if (!Array.isArray(data)) {
                    throw new Error("পণ্যের তথ্য সঠিক ফরম্যাটে নেই।");
                }

                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();


    }, []);

    return (<section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Section heading */}
        <div className="mb-8"> <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            সব পণ্য </h2>

            <p className="mt-2 text-sm text-gray-500 md:text-base">
               মোট {products.length.toLocaleString("bn-BD")}টি পণ্য দেখানো হচ্ছে
            </p>    
        </div>

        {/* Loading state */}
        {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, index) => (
                    <div
                        key={index}
                        className="h-44 animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        )}

        {/* Error state */}
        {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        )}

        {/* All products */}
        {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
                    >
                        <Cards product={product} />
                    </Link>
                ))}
            </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-10 text-center">
                <p className="text-lg font-semibold text-gray-800">
                    কোনো পণ্য পাওয়া যায়নি
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    পরে আবার চেষ্টা করুন।
                </p>
            </div>
        )}
    </section>


    );
};

export default AllProducts;
