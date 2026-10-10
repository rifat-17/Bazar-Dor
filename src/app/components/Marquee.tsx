
"use client";

import { useEffect, useState } from "react";
import { formatPrice, toBengaliNumber, type Product } from "@/lib/utils";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

export default function Marquee() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data)
            ? data
            : Array.isArray(data.products)
              ? data.products
              : []
        );
      } catch (error) {
        console.error("Ticker error:", error);
      }
    }

    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  const tickerItems = [...products, ...products];

  return (
    <div className="overflow-hidden border-t border-gray-100 bg-gray-50">
      <div className="animate-marquee flex whitespace-nowrap py-1.5">
        {tickerItems.map((product, index) => {
          const direction = product.change?.dir;
          const percentage = Number(product.change?.pct ?? 0);

          return (
            <span
              key={`${product.id ?? product.slug ?? index}-${index}`}
              className="mx-4 inline-flex items-center gap-1.5 text-sm"
            >
              <span>{product.image}</span>

              <span className="font-medium text-gray-700">
                {product.nameBn}
              </span>

              <span className="text-gray-500">
                {formatPrice(product.today)} টাকা/
                {unitMap[product.unit] || product.unit || "একক"}
              </span>

              <span
                className={`font-semibold ${
                  direction === "up"
                    ? "text-red-500"
                    : direction === "down"
                      ? "text-green-500"
                      : "text-gray-400"
                }`}
              >
                {direction === "up"
                  ? `▲ ${toBengaliNumber(Math.abs(percentage).toFixed(1))}%`
                  : direction === "down"
                    ? `▼ ${toBengaliNumber(Math.abs(percentage).toFixed(1))}%`
                    : `— ${toBengaliNumber("0.0")}%`}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
