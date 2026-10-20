import { formatPrice, toBengaliNumber, type Product } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBazarButton from "@/app/components/AddToBazarButton";

async function getProduct(slug: string): Promise<Product | null> {

  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const products: Product[] = await res.json();
  return products.find((p) => p.slug === slug) || null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // মার্কেটগুলো ডিভিশন অনুযায়ী গ্রুপ 
  const marketsByDivision = product.markets.reduce(
    (acc, market) => {
      if (!acc[market.division]) {
        acc[market.division] = [];
      }
      acc[market.division].push(market);
      return acc;
    },
    {} as Record<string, typeof product.markets>
  );

  // Min, Max, Average 
  const allMins = product.markets.map((m) => m.min);
  const allMaxs = product.markets.map((m) => m.max);
  const minPrice = Math.min(...allMins);
  const maxPrice = Math.max(...allMaxs);
  const avgPrice = Math.round(
    product.markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) /
    product.markets.length
  );

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm mb-6">
        <ul>
          <li>
            <Link href="/">হোম</Link>
          </li>
          <li>
            <Link href={`/category/${product.category}`}>
              {product.categoryNameBn}
            </Link>
          </li>
          <li className="font-semibold">{product.nameBn}</li>
        </ul>
      </div>

      {/* Top Summary */}
      <div className="bg-white border rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Left: Emoji + Title */}
          <div className="flex flex-2 items-center gap-4 mt-10">
            <span className="text-6xl">{product.image}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {product.nameBn}
              </h1>
              <p className="text-gray-500 mt-1">
                প্রতি কেজি {product.categoryNameBn}
              </p>
              <p className="text-gray-500 mt-1">
                গতকালের তুলনায় আজ দাম বেড়েছে {(product.today - product.yesterday).toLocaleString("bn-BD")} টাকা
              </p>


            </div>
          </div>
          {/* right side */}
          
          {/* Today's Price */}
          <div className="rounded-xl border border-gray-200 bg-gray-100 p-5">
            <p className="text-lg font-medium text-gray-600">
              আজকের দাম
            </p>

            <p className="py-2 text-3xl font-bold text-gray-900">
              {formatPrice(product.today)}
            </p>

            <p className="text-sm text-gray-500">
              টাকা / {unitMap[product.unit] || product.unit || "একক"}
            </p>

            <div className="mt-3">
              <span
                className={`badge ${product.change.dir === "up"
                    ? "badge-error text-white"
                    : product.change.dir === "down"
                      ? "badge-success text-white"
                      : "badge-ghost"
                  }`}
              >
                {product.change.dir === "up"
                  ? `▲ ${toBengaliNumber(
                    Math.abs(product.change.pct).toFixed(1)
                  )}%`
                  : product.change.dir === "down"
                    ? `▼ ${toBengaliNumber(
                      Math.abs(product.change.pct).toFixed(1)
                    )}%`
                    : `— ${toBengaliNumber("0.0")}%`}
              </span>
            </div>

            <div className="mt-4">
              <AddToBazarButton
                slug={product.slug}
                unit={product.unit}
                nameBn={product.nameBn}
              />
            </div>
          </div>
        
        </div>
      </div>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
          <p className="text-xl font-bold text-green-700">
            {formatPrice(minPrice)} <span className="text-sm font-normal">টাকা</span>
          </p>
          <p>সবচেয়ে কম দামের বাজার</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
          <p className="text-xl font-bold text-red-600">
            {formatPrice(maxPrice)} <span className="text-sm font-normal">টাকা</span>
          </p>
          <p>সবচেয়ে বেশি দামের বাজার</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-gray-500">গড় দাম</p>
          <p className="text-xl font-bold text-blue-600">
            {formatPrice(avgPrice)} <span className="text-sm font-normal">টাকা</span>
          </p>
          <p>প্রতি কেজি-এর হিসাবে</p>
        </div>

      </div>

      {/* বাজারভিত্তিক আজকের দাম */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🏪 বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="space-y-6">
          {Object.entries(marketsByDivision).map(([division, markets]) => (
            <div key={division}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                📍 {division}
              </h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-gray-600">বাজার</th>
                      <th className="text-gray-600">সর্বনিম্ন</th>
                      <th className="text-gray-600">সর্বোচ্চ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((market) => (
                      <tr key={market.market} className="hover">
                        <td className="font-medium">{market.market}</td>
                        <td className="text-green-600 font-semibold">
                          {formatPrice(market.min)} টাকা
                        </td>
                        <td className="text-red-500 font-semibold">
                          {formatPrice(market.max)} টাকা
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}