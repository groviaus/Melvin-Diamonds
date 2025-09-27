"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { resolveMediaUrl } from "@/lib/utils";

interface Category {
  name: string;
  image: string;
  bgimage: string;
  bgColor: string;
}

export default function BestSellers() {
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const products = await productAPI.getAll();
        const filtered = products.filter((p) =>
          (p.categories || []).some((c) =>
            c.toLowerCase().includes("engagement")
          )
        );
        setBest(filtered.slice(0, 8));
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header Section */}
      <div className="sm:text-left text-center mb-8 sm:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
          Popular Engagement Rings
        </h1>
        <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl">
          Artistry and craftsmanship in every detail.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {best.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex flex-col group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div
        className={`aspect-[4/5] bg-gray-50 mb-2 sm:mb-3 lg:mb-4 flex items-center justify-center overflow-hidden shadow-sm relative`}
      >
        {/* Main image */}
        <Image
          src={resolveMediaUrl(product.mainImage)}
          alt={product.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
            src={resolveMediaUrl(
              product.galleryImages?.[0] || product.mainImage
            )}
            alt={product.title + " alternate"}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Product Label */}
      <h3 className="text-center font-light text-gray-900 text-xs sm:text-sm lg:text-lg mb-1">
        <Link href={`/products/${product.id}`}>{product.title}</Link>
      </h3>
      <p className="text-center text-sm text-muted-foreground mb-4 sm:mb-0">
        ${product.price}
      </p>
    </motion.div>
  );
}
