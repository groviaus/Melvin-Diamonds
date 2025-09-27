"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const all = await productAPI.getAll();
        setProducts(all);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    if (!slug) return [];
    const s = decodeURIComponent(slug).toLowerCase();
    return products.filter((p) =>
      p.categories.some((c) => {
        const cl = c.toLowerCase();
        return cl.includes(s) || s.includes(cl);
      })
    );
  }, [products, slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight capitalize">{slug}</h1>
      {filtered.length === 0 ? (
        <div className="text-muted-foreground">
          No products in this category.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <Card key={product.id}>
              <div className="aspect-square bg-gray-50">
                {product.mainImage && (
                  <Image
                    src={product.mainImage}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">
                  {product.categories.join(", ")}
                </div>
                <div className="font-medium mt-1">{product.title}</div>
                <div className="mt-1">${product.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
