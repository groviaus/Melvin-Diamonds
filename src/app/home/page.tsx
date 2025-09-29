import Hero from "./sections/hero/page";
import Categories from "./sections/categories/page";
import DiamondShapes from "./sections/diamond-shapes/page";
// import BestSellers from "./sections/best-sellers/page";
import RingShowcase from "./sections/ring-showcase/page";
import Collections from "./sections/collections/page";
import About from "./sections/about/page";
import Benefits from "./sections/benefits/page";
import Experience from "./sections/experience/page";
import LatestProducts from "./sections/latest-products/page";

export default function JewelryHomepage() {
  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}
      <Hero />
      <LatestProducts />
      <Categories />
      <DiamondShapes />
      {/* <BestSellers /> */}
      <RingShowcase />
      <Collections />
      <About />
      <Benefits />
      <Experience />
      {/* <Footer /> */}
    </div>
  );
}
