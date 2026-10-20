"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  type Product,
  formatPrice,
  formatQty,
  getUnitShort,
  toBengaliNumber,
} from "@/lib/utils";
import {
  basketTotals,
  buildBasket,
  encodeItems,
  optimizeMarkets,
  topMovers,
} from "@/lib/bazar";
import { useBazar } from "@/app/components/BazarProvider";
import AddToBazarButton from "@/app/components/AddToBazarButton";
import VoiceSearch from "@/app/components/VoiceSearch";

function taka(value: number): string {
  return `৳${formatPrice(Math.round(value))}`;
}

function Delta({ value }: { value: number }) {
  const rounded = Math.round(value);

  if (rounded === 0) {
    return <span className="font-semibold text-gray-500">অপরিবর্তিত</span>;
  }

  const up = rounded > 0;

  return (
    <span className={`font-semibold ${up ? "text-red-600" : "text-green-700"}`}>
      {up ? "▲" : "▼"} {taka(Math.abs(rounded))} {up ? "বেশি" : "কম"}
    </span>
  );
}

export default function BazarClient({ products }: { products: Product[] }) {
  const { items, hydrated, remove, clear } = useBazar();
  const [query, setQuery] = useState("");

  const entries = useMemo(() => buildBasket(items, products), [items, products]);
  const totals = useMemo(() => basketTotals(entries), [entries]);
  const movers = useMemo(() => topMovers(entries), [entries]);
  const optimize = useMemo(() => optimizeMarkets(entries), [entries]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return products
      .filter(
        (product) =>
          product.nameBn.toLowerCase().includes(term) ||
          product.categoryNameBn.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [products, query]);

  const slipUrl = `/bazar/slip?items=${encodeURIComponent(encodeItems(items))}`;

  const handleShare = async () => {
    if (items.length === 0) return;

    try {
      const res = await fetch(slipUrl);
      if (!res.ok) throw new Error("slip failed");
      const blob = await res.blob();
      const file = new File([blob], "bazar-dor-slip.png", {
        type: "image/png",
      });

      const nav = navigator as Navigator & {
        canShare?: (data: { files?: File[] }) => boolean;
      };

      if (navigator.share && nav.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "আমার বাজারের রিপোর্ট",
          text: "বাজার দর — আজকের বাজার",
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "bazar-dor-slip.png";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("রিপোর্ট ডাউনলোড হয়েছে");
    } catch {
      toast.error("রিপোর্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="skeleton h-8 w-56" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            🧺 আমার বাজার
          </h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            আপনার নিত্যপ্রয়োজনীয় পণ্যের তালিকা — আজকের খরচ, দামের পরিবর্তন আর
            সবচেয়ে সস্তা বাজার এক জায়গায়।
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-success text-white"
            >
              📤 রিপোর্ট শেয়ার
            </button>
            <button
              type="button"
              onClick={clear}
              className="btn btn-ghost text-gray-500"
            >
              সব মুছুন
            </button>
          </div>
        )}
      </div>

      {/* Add products */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <h2 className="text-base font-bold text-gray-800 sm:text-lg">
          পণ্য যোগ করুন
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          নাম লিখুন অথবা মাইক্রোফোনে চেপে বাংলায় বলুন — যেমন “পেঁয়াজ”।
        </p>

        <div className="mt-3">
          <VoiceSearch value={query} onChange={setQuery} />
        </div>

        {query.trim() && (
          <ul className="mt-3 divide-y divide-gray-100">
            {results.length === 0 ? (
              <li className="py-4 text-sm text-gray-500">
                “{query}” নামে কোনো পণ্য পাওয়া যায়নি।
              </li>
            ) : (
              results.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-xl" aria-hidden="true">
                      {product.image || product.categoryIcon || "🛒"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {product.nameBn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {taka(product.today)} / {getUnitShort(product.unit)}
                      </p>
                    </div>
                  </div>

                  <div className="w-40 shrink-0">
                    <AddToBazarButton
                      slug={product.slug}
                      unit={product.unit}
                      nameBn={product.nameBn}
                      compact
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </section>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
          <div className="text-5xl">🧺</div>
          <p className="mt-3 text-lg font-semibold text-gray-700">
            আপনার তালিকা এখন খালি
          </p>
          <p className="mt-1 text-sm text-gray-500">
            উপরের খোঁজা বক্স থেকে পণ্য যোগ করে শুরু করুন।
          </p>
          <Link href="/" className="btn btn-success mt-5 text-white">
            সব পণ্য দেখুন
          </Link>
        </div>
      ) : (
        <>
          {/* Totals */}
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card border border-gray-200 bg-white">
              <div className="card-body p-4">
                <p className="text-sm text-gray-500">আজকের খরচ</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {taka(totals.today)}
                </p>
                <p className="text-xs text-gray-500">
                  {toBengaliNumber(totals.itemCount)} ধরনের পণ্য
                </p>
              </div>
            </div>

            <div className="card border border-gray-200 bg-white">
              <div className="card-body p-4">
                <p className="text-sm text-gray-500">গত সপ্তাহের তুলনায়</p>
                <p className="mt-1 text-lg">
                  <Delta value={totals.weekDelta} />
                </p>
                <p className="text-xs text-gray-500">
                  {toBengaliNumber(Math.abs(totals.weekPct).toFixed(1))}% পরিবর্তন
                </p>
              </div>
            </div>

            <div className="card border border-gray-200 bg-white">
              <div className="card-body p-4">
                <p className="text-sm text-gray-500">গত মাসের তুলনায়</p>
                <p className="mt-1 text-lg">
                  <Delta value={totals.monthDelta} />
                </p>
                <p className="text-xs text-gray-500">
                  {toBengaliNumber(Math.abs(totals.monthPct).toFixed(1))}% পরিবর্তন
                </p>
              </div>
            </div>
          </section>

          {/* Optimizer */}
          <section className="mt-6 rounded-2xl border border-green-100 bg-green-50/60 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-green-900">
              🏪 কোথায় কিনলে সবচেয়ে কম খরচ?
            </h2>

            {optimize.oneStop ? (
              <div className="mt-4">
                <div className="rounded-xl border border-green-200 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    এক জায়গায় পুরো তালিকা কিনতে সবচেয়ে সস্তা
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-green-800">
                    {optimize.oneStop.market}
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      ({optimize.oneStop.division})
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    আনুমানিক খরচ {taka(optimize.oneStop.total)}
                    {optimize.oneStopSavings > 0 && (
                      <>
                        {" "}
                        — সাশ্রয়{" "}
                        <span className="font-semibold text-green-700">
                          {taka(optimize.oneStopSavings)}
                        </span>
                      </>
                    )}
                  </p>
                  {optimize.oneStop.missing.length > 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      এই বাজারে পাওয়া যায়নি:{" "}
                      {optimize.oneStop.missing.join(", ")} (আজকের দাম ধরে
                      হিসাব)।
                    </p>
                  )}
                </div>

                {optimize.perItem && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-white p-4">
                    <p className="text-sm text-gray-500">
                      প্রতিটি পণ্য আলাদা বাজার থেকে কিনলে
                    </p>
                    <p className="mt-1 text-xl font-bold text-green-800">
                      {taka(optimize.perItem.total)} — সাশ্রয়{" "}
                      {taka(optimize.perItem.savings)}
                    </p>

                    <div className="mt-3 overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr className="text-gray-500">
                            <th>পণ্য</th>
                            <th>সস্তা বাজার</th>
                            <th className="text-right">খরচ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {optimize.perItem.picks.map((pick) => (
                            <tr key={pick.slug}>
                              <td>{pick.nameBn}</td>
                              <td className="text-gray-600">
                                {pick.market}
                                <span className="text-xs text-gray-400">
                                  {" "}
                                  ({pick.division})
                                </span>
                              </td>
                              <td className="text-right font-semibold">
                                {taka(pick.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                বাজারের তথ্য পাওয়া গেলে এখানে সবচেয়ে সস্তা বাজার দেখানো হবে।
              </p>
            )}
          </section>

          {/* Movers */}
          {movers.length > 0 && (
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-lg font-bold text-gray-800">
                📈 আপনার তালিকায় সবচেয়ে বেশি বদল
              </h2>
              <ul className="mt-3 space-y-2">
                {movers.map((entry) => (
                  <li
                    key={entry.product.slug}
                    className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <span className="truncate font-medium text-gray-700">
                      {entry.product.image} {entry.product.nameBn}
                    </span>
                    <Delta value={entry.weekDelta} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Basket items */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-800">
              তালিকার পণ্য ({toBengaliNumber(entries.length)})
            </h2>

            <ul className="mt-3 divide-y divide-gray-100">
              {entries.map((entry) => (
                <li
                  key={entry.product.slug}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link
                    href={`/product/${entry.product.slug}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {entry.product.image || entry.product.categoryIcon || "🛒"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800 hover:text-green-700">
                        {entry.product.nameBn}
                      </p>
                      <p className="text-xs text-gray-500">
                        {taka(entry.product.today)} /{" "}
                        {getUnitShort(entry.product.unit)} ×{" "}
                        {formatQty(entry.qty)} = {taka(entry.lineToday)}
                      </p>
                    </div>
                  </Link>

                  <div className="flex shrink-0 items-center gap-2">
                    <div className="w-44">
                      <AddToBazarButton
                        slug={entry.product.slug}
                        unit={entry.product.unit}
                        nameBn={entry.product.nameBn}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(entry.product.slug)}
                      className="btn btn-ghost btn-sm text-gray-400 hover:text-red-500"
                      aria-label={`${entry.product.nameBn} সরান`}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-base font-semibold text-gray-700">
                মোট (আজকের দামে)
              </span>
              <span className="text-2xl font-extrabold text-gray-900">
                {taka(totals.today)}
              </span>
            </div>
          </section>

          <p className="mt-4 text-center text-xs text-gray-400">
            সাইন ইন করলে আপনার তালিকা সব ডিভাইসে সেভ থাকবে।
          </p>
        </>
      )}
    </div>
  );
}
