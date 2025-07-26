import Header from "./sections/header/page";
import Hero from "./sections/hero/page";
import Categories from "./sections/categories/page";
import DiamondShapes from "./sections/diamond-shapes/page";
import BestSellers from "./sections/best-sellers/page";
import RingShowcase from "./sections/ring-showcase/page";

export default function JewelryHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Categories />
      <DiamondShapes />
      <BestSellers />
      <RingShowcase />
    </div>
  );
}
