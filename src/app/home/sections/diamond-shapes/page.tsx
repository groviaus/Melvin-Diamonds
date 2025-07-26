"use client";

import Image from "next/image";
import { useState } from "react";

interface DiamondShape {
  name: string;
  image: string;
  isSelected?: boolean;
}

export default function DiamondShapes() {
  const [selectedShape, setSelectedShape] = useState("Cushion");

  const diamondShapes: DiamondShape[] = [
    { name: "Oval", image: "/images/rings/ring (1).webp" },
    { name: "Round", image: "/images/rings/ring (2).webp" },
    { name: "Emerald", image: "/images/rings/ring (3).webp" },
    { name: "Marquise", image: "/images/rings/ring (4).webp" },
    { name: "Radiant", image: "/images/rings/ring (5).webp" },
    { name: "Pear", image: "/images/rings/ring (6).webp" },
    { name: "Elongated Cushion", image: "/images/rings/ring (7).webp" },
    { name: "Cushion", image: "/images/rings/ring (8).webp" },
    { name: "Princess", image: "/images/rings/ring (9).webp" },
    { name: "Asscher", image: "/images/rings/ring (10).webp" },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* Left - Main Diamond Display */}
          <div className="flex flex-col justify-center items-center sm:items-start">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-800 text-center sm:text-left mb-3 sm:mb-4">
              Shop Diamonds by Shape
            </h2>
            <div className="relative w-full sm:w-[20rem] lg:w-[25rem] h-48 sm:h-56 lg:h-60">
              <Image
                src="/images/rings/mainLeftRing.webp"
                alt="Featured diamond shape"
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 320px, 400px"
              />
            </div>
          </div>

          {/* Right - Shape Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 sm:gap-10 w-full">
            {diamondShapes.map((shape, index) => (
              <button
                key={index}
                onClick={() => setSelectedShape(shape.name)}
                className={`group flex flex-col items-center transition-all duration-300`}
              >
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mb-2 sm:mb-3 transition-all duration-300">
                  <Image
                    src={shape.image}
                    alt={shape.name}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 72px, 80px"
                  />
                </div>
                <p
                  className={`text-center text-xs sm:text-sm font-light transition-colors duration-300 ${
                    selectedShape === shape.name
                      ? "text-teal-700 font-medium"
                      : "text-gray-600 group-hover:text-gray-800"
                  }`}
                >
                  {shape.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
