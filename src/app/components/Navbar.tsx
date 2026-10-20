
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, type Category } from "@/lib/utils";
import toast from "react-hot-toast";

import Marquee from "./Marquee";
import BasketBadge from "./BasketBadge";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/categories";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("সাইন আউট সফল হয়েছে!");
            setMobileMenuOpen(false);
            router.push("/");
          },
          onError: () => {
            toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
          },
        },
      });
    } catch {
      toast.error("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  // Active category
  const isCategoryActive = (slug: string) => {
    const href = `/category/${slug}`;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2 sm:min-h-[76px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="বাজার দর - হোম"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl sm:size-12">
              🛒
            </span>

            <div className="min-w-0">
              <h1 className="text-lg font-extrabold leading-tight text-green-700 sm:text-xl">
                বাজার দর
              </h1>

              <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                {getBanglaDate()}
              </p>
            </div>
          </Link>

          {/* Desktop Authentication */}
          <div className="hidden items-center gap-3 lg:flex">
            <BasketBadge />
            {isPending ? (
              <span
                className="loading loading-spinner loading-sm text-green-700"
                aria-label="লোড হচ্ছে"
              />
            ) : session ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className="btn btn-ghost btn-sm gap-2 rounded-xl"
                  aria-label="ইউজার মেনু"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>

                  <span className="max-w-36 truncate">
                    {session.user.name || "ব্যবহারকারী"}
                  </span>

                  <svg
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-lg"
                >
                  <li>
                    <Link href="/profile">👤 আমার প্রোফাইল</Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                    >
                      🚪 সাইন আউট
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="btn btn-sm btn-outline btn-success rounded-lg px-4"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="btn btn-sm btn-success rounded-lg px-4 text-white"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="btn btn-square btn-ghost btn-sm lg:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <div
        id="mobile-navigation"
        className={`border-t border-gray-100 ${
          mobileMenuOpen ? "block" : "hidden"
        } lg:block`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="পণ্যের ক্যাটাগরি">
            <ul className="flex flex-wrap items-center gap-2 py-3">
              {categories.map((category) => {
                const isActive = isCategoryActive(category.slug);

                return (
                  <li key={category.id ?? category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                        isActive
                          ? "bg-green-700 text-white"
                          : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                      }`}
                    >
                      <span aria-hidden="true">{category.icon}</span>
                      <span>{category.nameBn}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Authentication */}
          {mobileMenuOpen && (
            <div className="flex gap-2 border-t border-gray-100 py-3 lg:hidden">
              <BasketBadge />
              {isPending ? (
                <span className="loading loading-spinner loading-sm text-green-700" />
              ) : session ? (
                <>
                  <Link
                    href="/profile"
                    className="btn btn-outline btn-success btn-sm flex-1"
                  >
                    👤 প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-error btn-sm flex-1 text-white"
                  >
                    🚪 সাইন আউট
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="btn btn-outline btn-success btn-sm flex-1"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    className="btn btn-success btn-sm flex-1 text-white"
                  >
                    সাইন আপ
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Market Price Ticker */}
      <Marquee />
    </header>
  );
}
