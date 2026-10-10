
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ICategory {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/categories";

export default function CategoryNav() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(false);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: ICategory[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav
      aria-label="পণ্যের ক্যাটাগরি"
      className="border-y border-gray-100 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="pt-3 sm:pt-4">
          <p className="text-xs font-semibold text-gray-500 sm:text-sm">
            ক্যাটাগরি অনুযায়ী পণ্য খুঁজুন
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex gap-2 overflow-hidden py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          /* Error state */
          <div className="py-4 text-sm text-red-600">
            ক্যাটাগরি লোড করা যায়নি। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।
          </div>
        ) : categories.length === 0 ? (
          /* Empty state */
          <div className="py-4 text-sm text-gray-500">
            কোনো ক্যাটাগরি পাওয়া যায়নি।
          </div>
        ) : (
          /* Category list */
          <ul className="flex items-center gap-2 overflow-x-auto overscroll-x-contain py-3 sm:gap-3 sm:py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;

              const isActive =
                pathname === href ||
                pathname.startsWith(`${href}/`);

              return (
                <li key={category.id} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-200 sm:px-4 ${
                      isActive
                        ? "border-green-700 bg-green-700 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800"
                    }`}
                  >
                    <span aria-hidden="true" className="text-base">
                      {category.icon}
                    </span>

                    <span>{category.nameBn}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
