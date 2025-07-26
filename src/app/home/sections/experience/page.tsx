"use client";

import Image from "next/image";
import { useState } from "react";

interface RingCategory {
  name: string;
  image: string;
  bgColor: string;
}

export default function Experience() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ringCategories: RingCategory[] = [
    {
      name: "Eternity Rings",
      image: "/images/experience/rings (1).webp",
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
    },
    {
      name: "Curved Rings",
      image: "/images/experience/rings (2).webp",
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    },
    {
      name: "Bezel Rings",
      image: "/images/experience/rings (3).webp",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
    },
    {
      name: "Lab Diamond Rings",
      image: "/images/experience/rings (4).webp",
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
    },
    {
      name: "Engagement Rings",
      image: "/images/experience/rings (1).jpeg",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-200",
    },
    {
      name: "Wedding Bands",
      image: "/images/experience/rings (2).jpeg",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
    },
    {
      name: "Diamond Rings",
      image: "/images/experience/rings (3).jpeg",
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ringCategories.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-max sm:min-h-[500px] lg:h-[700px]">
      {/* Left Section - Background Image with Overlay */}
      <div className="py-6 sm:py-8 lg:py-16 px-4 sm:px-6 lg:pl-8 h-80 sm:h-full">
        <div className="relative h-full">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-top"
            style={{
              backgroundImage: "url('/images/products/asset (4).webp')",
            }}
          />

          {/* Semi-transparent Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        </div>
      </div>

      {/* Right Section - Heading and Product Grid */}
      <div className="flex-1 p-4 sm:p-6 lg:p-12 h-full">
        {/* Main Heading */}
        <h1 className="font-serif text-gray-800 mb-3 sm:mb-4 lg:mb-5 text-center">
          <span className="text-xl sm:text-2xl">10 </span>YEARS OF OUR MISSION
        </h1>
        <p className="text-gray-800 tracking-wide mb-6 sm:mb-8 lg:mb-10 text-base sm:text-lg lg:text-2xl text-center">
          From our pioneering diamond standards to our unmatched transparency,
          we&apos;re redefining what it means to design, craft, and experience
          jewelry that makes a real difference.
        </p>

        {/* Product Grid - 2x2 */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-3 sm:gap-4 lg:gap-6 transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (200 + 16)}px)` }}
          >
            {[...ringCategories, ...ringCategories, ...ringCategories].map(
              (category, index) => (
                <div key={index} className="flex flex-col flex-shrink-0">
                  <div className="aspect-[3/4] mb-2 sm:mb-3 flex items-center justify-center overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="object-cover w-56 sm:w-56 lg:w-60 hover:scale-105 transition-all duration-300 h-full"
                    />
                  </div>
                  <h3 className="text-left ml-1 text-gray-900 font-medium text-xs sm:text-sm lg:text-base">
                    {category.name}
                  </h3>
                </div>
              )
            )}
          </div>

          {/* Navigation Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
