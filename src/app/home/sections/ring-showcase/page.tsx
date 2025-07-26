import Image from "next/image";
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
    <div className="grid grid-cols-2 h-[700px] ">
      {/* Left Section - Background Image with Overlay */}
    <div className="py-10 pl-8 h-full">
    <div className="relative h-full ">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/must-have/right (1).jpeg')",
          }}
        />

        {/* Semi-transparent Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col justify-end pb-12 items-start h-full px-12">
          <div className="text-left text-white">
            <h2 className="text-4xl  mb-6 leading-tight">
              Start Your Stack
            </h2>
            <Button
              className="bg-transparent border text-white px-12 py-4 text-lg font-medium rounded-none hover:bg-teal-900  transition-all duration-300"
              size="lg"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>

      {/* Right Section - Heading and Product Grid */}
      <div className="flex-1 p-12 h-full ">
        {/* Main Heading */}
        <h1 className="text-4xl font-serif text-gray-800 mb-5">
          Our Must-Have Rings
        </h1>
        <p className="text-gray-600 mb-10 ">
        Discover our must-have rings, curated for timeless elegance and lasting beauty.
        </p>

        {/* Product Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-6">
          {ringCategories.map((category, index) => (
            <div key={index} className="flex flex-col">
              <div className={`aspect-[5/3] ${category.bgColor}  mb-3 flex items-center justify-center overflow-hidden`}>
                <Image
                  src={category.image}
                  alt={category.name}
                  width={200}
                  height={200}
                  className="object-cover hover:scale-105 transition-all duration-300 w-full h-full"
                />
              </div>
              <h3 className="text-left ml-1 text-gray-900 font-medium">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
}
