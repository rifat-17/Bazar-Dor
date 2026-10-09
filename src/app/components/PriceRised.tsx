
"use client";

import { useEffect, useState } from "react";
import Cards from "./Cards";

const API_URL =
    "https://api.api-store.workers.dev/api/bazardor/products";

const PriceRised = () => {
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

                // Handle common API response structures
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

                // Filter → Sort → Select top 6
                const risers = data
                    .filter((product) => product.change?.dir === "up")
                    .sort(
                        (a, b) =>
                            Number(b.change?.pct ?? 0) -
                            Number(a.change?.pct ?? 0)
                    )
                    .slice(0, 6);

                setProducts(risers);
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

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
            {/* Section heading */}
            <div className="mb-8 flex flex-2 gap-4">

                <span className="text-red-600 py-3 size-3">▲</span>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
                    আজ দাম বেড়েছে

                </h2>


            </div>

            {/* Loading state */}
            {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-40 animate-pulse rounded-2xl bg-gray-100"
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

            {/* Product grid */}
            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Cards
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-10 text-center">
                    <p className="text-lg font-semibold text-gray-800">
                        বর্তমানে দাম বৃদ্ধির কোনো তথ্য নেই
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        পরে আবার চেষ্টা করুন।
                    </p>
                </div>
            )}
        </section>
    );
};

export default PriceRised;