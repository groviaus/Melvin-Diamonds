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
    <section className="py-16 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
       

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
          {/* Left - Main Diamond Display */}
          <div className="flex flex-col justify-center items-center sm:items-start">
          <h2 className="text-3xl text-gray-800 text-center ml-8 mb-4">
            Shop Diamonds by Shape
          </h2>
            <div className="relative w-[25rem] h-60 ">
              <Image
                src="/images/rings/mainLeftRing.webp"
                alt="Featured diamond shape"
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
            {/* <h3 className="text-xl font-light text-gray-800 text-center">
              {selectedShape} Diamond
            </h3> */}
          </div>

          {/* Right - Shape Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5  gap-6 sm:gap-10 w-full">
            {diamondShapes.map((shape, index) => (
              <button
                key={index}
                onClick={() => setSelectedShape(shape.name)}
                className={`group flex flex-col items-center transition-all duration-300 `}
              >
                <div className="relative w-20 h-20 mb-3 transition-all duration-300">
                  <Image
                    src={shape.image}
                    alt={shape.name}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="80px"
                  />
                </div>
                <p
                  className={`text-center  text-sm font-light transition-colors duration-300 ${
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
