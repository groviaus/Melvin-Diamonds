import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RingCategory {
  name: string;
  image: string;
  bgColor: string;
}

export default function RingShowcase() {
  const ringCategories: RingCategory[] = [
    {
      name: "Eternity Rings",
      image: "/images/must-have/left (1).webp",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
    },
    {
      name: "Curved Rings",
      image: "/images/must-have/left (2).webp",
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    },
    {
      name: "Bezel Rings",
      image: "/images/must-have/left (3).webp",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
    },
    {
      name: "Lab Diamond Rings",
      image: "/images/must-have/left (4).webp",
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-max sm:h-[500px] lg:h-[700px] order-2 ">
      {/* Left Section - Background Image with Overlay */}
      <div className="py-6 sm:py-8 lg:py-10 px-1 sm:px-6 lg:pl-8 h-60 sm:h-full">
        <div className="relative h-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/must-have/right (1).jpeg')",
            }}
          />

          {/* Semi-transparent Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/0" />

          {/* Centered Content */}
          <div className="relative z-10 flex flex-col justify-end pb-6 sm:pb-8 lg:pb-12 items-center sm:items-start h-full px-4 sm:px-8 lg:px-12">
            <div className="text-center sm:text-left text-white">
              <h2 className="text-xl sm:text-3xl lg:text-4xl mb-4 sm:mb-5 lg:mb-6 leading-tight text-center sm:text-left">
                Start Your Stack
              </h2>
              <Button
                className="bg-transparent border text-white px-4 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-medium rounded-none hover:bg-teal-900 transition-all duration-300 text-center sm:text-left"
                size="lg"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Heading and Product Grid */}
      <div className="flex-1 p-4 sm:p-6 lg:p-12 h-full order-1 ">
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-3 sm:mb-4 lg:mb-5 text-center sm:text-left  ">
          Our Must-Have Rings
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base text-center sm:text-left">
          Discover our must-have rings, curated for timeless elegance and
          lasting beauty.
        </p>

        {/* Product Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {ringCategories.map((category, index) => (
            <div key={index} className="flex flex-col">
              <div
                className={`aspect-[3/2.5] sm:aspect-[5/3] ${category.bgColor} mb-2 sm:mb-3 flex items-center justify-center overflow-hidden`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="object-cover hover:scale-105 transition-all duration-300 w-full h-full"
                />
              </div>
              <h3 className=" ml-1 text-center sm:text-left text-gray-900 font-medium text-xs sm:text-sm lg:text-base mb-4 sm:mb-0">
                <Link href={`/category/${encodeURIComponent(category.name)}`}>
                  {category.name}
                </Link>
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
