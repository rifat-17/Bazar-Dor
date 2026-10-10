
import { type Product } from "@/lib/utils";
import Cards from "./Cards";

interface PriceDownProps {
  products: Product[];
}

export default function PriceDown({ products }: PriceDownProps) {
  const fallers = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        Number(a.change?.pct ?? 0) -
        Number(b.change?.pct ?? 0)
    )
    .slice(0, 6);

  if (fallers.length === 0) return null;

  return (
    <section className="bg-gray-50 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-lg text-green-700">
                ▼
              </span>

              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                আজ দাম কমেছে
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              যেসব পণ্যের দাম কমেছে, সেগুলো এক নজরে দেখুন।
            </p>
          </div>

          <span className="w-fit rounded-full bg-white px-3 py-1.5 text-sm font-medium text-green-700 shadow-sm ring-1 ring-gray-100">
            {fallers.length}টি পণ্য
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-3">
          {fallers.map((product) => (
            <Cards key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
