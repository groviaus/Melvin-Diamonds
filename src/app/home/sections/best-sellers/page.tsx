"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface Category {
  name: string;
  image: string;
  bgimage: string;
  bgColor: string;
}

export default function BestSellers() {
  const categories: Category[] = [
    {
      name: "Solitaire Rings",
      image: "/images/best-sellers/best-sellers (1).jpeg",
      bgimage: "/images/best-sellers/best-sellers (1) copy.jpeg",
      bgColor: "bg-green-50",
    },
    {
      name: "Nature Inspired Rings",
      image: "/images/best-sellers/best-sellers (2).jpeg",
      bgimage: "/images/best-sellers/best-sellers (2) copy.jpeg",
      bgColor: "bg-gray-50",
    },
    {
      name: "Three Stone Rings",
      image: "/images/best-sellers/best-sellers (3).jpeg",
      bgimage: "/images/best-sellers/best-sellers (3) copy.jpeg",
      bgColor: "bg-green-50",
    },
    {
      name: "Bridal Sets",
      image: "/images/best-sellers/best-sellers (4).webp",
      bgimage: "/images/best-sellers/best-sellers (4) copy.jpg",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <section className="py-16 sm:px-8 px-4  mx-auto">
      {/* Header Section */}
      <div className="text-left mb-12">
        <h1 className="text-4xl font-serif text-gray-800 mb-4">
          Popular Engagement Rings
        </h1>
        <p className="text-lg font-light text-gray-600 max-w-2xl">
          Artistry and craftsmanship in every detail.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {categories.map((category, index) => (
          <CategoryCard key={index} category={category} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div
        className={`aspect-[4/5] ${category.bgColor} mb-4 flex items-center justify-center overflow-hidden shadow-sm relative `}
      >
        {/* Main image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          draggable={false}
        />

        {/* Hover bgimage crossfade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={category.bgimage}
            alt={category.name + " alternate"}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Category Label */}
      <h3 className="text-center font-light text-gray-900 sm:text-lg text-base sm:text-left sm:ml-1">
        {category.name}
      </h3>
    </motion.div>
  );
}
