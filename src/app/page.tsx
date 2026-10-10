



import { Product } from "@/lib/utils";

import AllProducts from "./components/AllProducts";
import Banner from "./components/Banner";

import PriceDown from "./components/PriceDown";
import PriceRised from "./components/PriceRised";




async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/bazardor/products",
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

    </>



  );
}
