"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { resolveMediaUrl } from "@/lib/utils";

export default function LatestProducts() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const products = await productAPI.getAll();
        setItems(products.slice(0, 8));
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="sm:text-left text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-3 lg:mb-4">
          Latest Products
        </h2>
        <p className="text-base sm:text-lg font-light text-gray-600 max-w-2xl">
          Newly added pieces from the admin panel.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
        {items.map((p) => (
          
          <div key={p.id} className="group">
            <Link href={`/products/${p.id}`}>
            <div className="aspect-[3/4]
             bg-gray-50 overflow-hidden">
              <Image
                src={resolveMediaUrl(p.mainImage)}
                alt={p.title}
                width={600}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                unoptimized
              />
            </div>
            {/* <div className="mt-2 text-sm text-muted-foreground">
              {p.categories.join(" > ")}
            </div> */}
            <div className="font-medium mt-2">{p.title}</div>
            <div className="">&#8377;{p.price}</div> 
            {/* <div className="text-sm text-muted-foreground line-through">{1000}</div> */}
            
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
