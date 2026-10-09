import Link from "next/link";

const Cards = ({ product }) => {
  const {
    image,
    categoryIcon,
    nameBn,
    categoryNameBn,
    today,
    unit,
    change,
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

  const unitLabels = {
    kg: "কেজি",
    gram: "গ্রাম",
    liter: "লিটার",
    piece: "টি",
    dozen: "ডজন",
  };

  const unitLabel = unitLabels[unit] || unit || "একক";

  const formatPrice = (price) =>
    Number(price).toLocaleString("bn-BD", {
      maximumFractionDigits: 2,
    });

  return (
    <Link href={`/product/${product.slug}`}>
    <article className="h-full rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
      {/* Product information */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
            {image || categoryIcon || "🛒"}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900">
              {nameBn}
            </h3>

            <span className="ml-1 text-sm font-normal text-gray-500">
            প্রতি {unitLabel}
          </span>
          </div>
        </div>

        {/* Price change */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-bold ${badgeColor}`}
        >
          {arrow} {formatPrice(percentage)}%
        </span>
      </div>

      {/* Current price */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          আজকের দাম
        </p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          ৳{formatPrice(today)}

          
        </p>
      </div>
    </article>
    </Link>
  );
};

export default Cards;