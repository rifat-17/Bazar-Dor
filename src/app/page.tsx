


import AllProducts from "./components/AllProducts";
import Banner from "./components/Banner";
import PriceDown from "./components/PriceDown";
import PriceRised from "./components/PriceRised";

export default function Home() {
  return (
    <main>
      <Banner/>
      <PriceRised/>
      <PriceDown/>
      <AllProducts/>
    </main>
  );
}
