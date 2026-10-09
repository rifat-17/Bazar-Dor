



import CategoryPage from "./category/[slug]/page";
import AllProducts from "./components/AllProducts";
import Banner from "./components/Banner";

import PriceDown from "./components/PriceDown";
import PriceRised from "./components/PriceRised";
import ProductDetailsPage from "./product/[slug]/page";

export default function Home() {

  

  return (
    <main>
      <Banner />
      <PriceRised />
      <PriceDown />
      <AllProducts />
      <ProductDetailsPage />
      <CategoryPage />
      
    </main>
  );
}
