
import { type Product } from "@/lib/utils";
import Cards from "./Cards";

export default function AllProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <section
      id="সব-পণ্য"
      className="bg-[#F0F5F0] py-8 sm:py-10 lg:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              সব পণ্য
            </h2>

            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              আজকের বাজারের সর্বশেষ পণ্যের দাম
            </p>
          </div>

          <span className="w-fit rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
            মোট {products.length}টি পণ্য
          </span>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Cards key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
            <p className="text-lg font-semibold text-gray-700">
              কোনো পণ্য পাওয়া যায়নি
            </p>
            <p className="mt-2 text-sm text-gray-500">
              পরে আবার চেষ্টা করুন।
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
