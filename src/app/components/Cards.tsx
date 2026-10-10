
import Link from "next/link";
import type { Product } from "@/lib/utils";

interface CardsProps {
  product: Product;
}

const unitLabels: Record<string, string> = {
  kg: "কেজি",
  gram: "গ্রাম",
  liter: "লিটার",
  piece: "টি",
  dozen: "ডজন",
};

const formatPrice = (price: number | string) => {
  return Number(price).toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
};

export default function Cards({ product }: CardsProps) {
  const {
    image,
    categoryIcon,
    nameBn,
    categoryNameBn,
    today,
    unit,
    change,
    slug,
  } = product;

  const direction = change?.dir;
  const percentage = Number(change?.pct ?? 0);

  const isUp = direction === "up";
  const isDown = direction === "down";

  const badgeColor = isUp
    ? "bg-red-50 text-red-600"
    : isDown
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-600";

  const arrow = isUp ? "▲" : isDown ? "▼" : "—";

  const unitLabel = unitLabels[unit] ?? unit ?? "একক";

  return (
    <Link
      href={`/product/${slug}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-red-200 group-hover:shadow-lg sm:p-5">
        {/* Product information */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl sm:size-12">
              {image || categoryIcon || "🛒"}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-red-600 sm:text-lg">
                {nameBn}
              </h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                প্রতি {unitLabel}
              </p>
            </div>
          </div>

          {/* Price change */}
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold sm:px-2.5 sm:text-sm ${badgeColor}`}
          >
            {arrow} {formatPrice(percentage)}%
          </span>
        </div>

        {/* Category */}
        {categoryNameBn && (
          <div className="mt-4">
            <span className="inline-flex rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
              {categoryNameBn}
            </span>
          </div>
        )}

        {/* Current price */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            আজকের দাম
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-1">
            <span className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              ৳{formatPrice(today)}
            </span>

            <span className="text-xs text-gray-500 sm:text-sm">
              / {unitLabel}
            </span>
          </div>

          <p className="mt-3 text-xs font-medium text-red-600 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            বিস্তারিত দেখুন →
          </p>
        </div>
      </article>
    </Link>
  );
}
