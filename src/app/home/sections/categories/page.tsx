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

export default function Categories() {
  const categories: Category[] = [
    {
      name: "Engagement Rings",
      image: "/images/categories/engagement.jpeg",
      bgimage: "/images/categories/engagement.webp",
      bgColor: "bg-green-50",
    },
    {
      name: "Women's Wedding Rings",
      image: "/images/categories/weddingw.jpeg",
      bgimage: "/images/categories/weddingw.webp",
      bgColor: "bg-gray-50",
    },
    {
      name: "Men's Wedding Rings",
      image: "/images/categories/weddingm.jpeg",
      bgimage: "/images/categories/weddingm.webp",
      bgColor: "bg-green-50",
    },
    {
      name: "Gemstone Rings",
      image: "/images/categories/gemstone.jpeg",
      bgimage: "/images/categories/gemstone.webp",
      bgColor: "bg-gray-50",
    },
    {
      name: "Fine Jewelry",
      image: "/images/categories/fine.jpeg",
      bgimage: "/images/categories/fine.webp",
      bgColor: "bg-green-50",
    },
    {
      name: "Best Sellers",
      image: "/images/categories/best.jpeg",
      bgimage: "/images/categories/best.webp",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header Section */}
      <div className="sm:text-left text-center mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
          Shop Jewelry by Category
        </h1>
        <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl">
          Thoughtfully designed collections for the big day and every day.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
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
        className={`aspect-[4/5] ${category.bgColor} mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center overflow-hidden shadow-sm relative`}
      >
        {/* Main image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 16vw, 16vw"
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
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 16vw, 16vw"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Category Label */}
      <h3 className="text-center font-light text-gray-900 text-xs sm:text-sm lg:text-lg mb-4 sm:mb-0">
        {category.name}
      </h3>
    </motion.div>
  );
}
