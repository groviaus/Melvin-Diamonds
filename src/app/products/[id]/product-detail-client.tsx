"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function ProductDetailClient() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { addItem } = useCart();

  useEffect(() => {
    if (!params?.id) return;
    const run = async () => {
      try {
        setIsLoading(true);
        const p = await productAPI.getById(params.id);
        setProduct(p);
        if (p.ringSizes?.length) setSelectedSize(p.ringSizes[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <Card className="py-0">
          <CardContent className="p-0">
            {product.mainImage && (
              <Image
                src={resolveMediaUrl(product.mainImage)}
                alt={product.title}
                width={1000}
                height={1000}
                className="w-full object-cover"
                unoptimized
              />
            )}
          </CardContent>
        </Card>
        {product.galleryImages?.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {product.galleryImages.map((g, i) => (
              <div key={i} className="aspect-square bg-gray-50">
                <Image
                  src={resolveMediaUrl(g)}
                  alt={`${product.title} ${i + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          <div className="mt-2 text-lg">${product.price}</div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {product.ringSizes?.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Ring size</div>
              <div className="flex flex-wrap gap-2">
                {product.ringSizes.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 text-sm border rounded ${
                      size === selectedSize
                        ? "bg-foreground text-background"
                        : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            size="lg"
            className="rounded-none"
            onClick={() => {
              if (!product) return;
              addItem(product, 1, selectedSize || undefined);
            }}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="rounded-none"
            onClick={() => {
              if (!product) return;
              addItem(product, 1, selectedSize || undefined);
            }}
          >
            <Link href="/products">Back to Shop</Link>
          </Button>
          <Button asChild size="lg" className="rounded-none">
            <Link href="/checkout">Buy Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
