



import { Product } from "@/lib/utils";
import CategoryPage from "./category/[slug]/page";
import AllProducts from "./components/AllProducts";
import Banner from "./components/Banner";

import PriceDown from "./components/PriceDown";
import PriceRised from "./components/PriceRised";
import ProductDetailsPage from "./product/[slug]/page";



async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products",
    { next: { revalidate: 60 } } 
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}



export default async function Home() {

const products = await getProducts();

  return (
    <>
      <Banner />
      <PriceRised products={products} />
      <PriceDown products={products} />
      <AllProducts products={products} />
      <ProductDetailsPage />
      <CategoryPage />
    </>



  );
}
