"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productAPI.getAll();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const min = parseFloat(minPrice || "0");
    const max = parseFloat(maxPrice || "0");
    return products.filter((p) => {
      const matchesText =
        !s ||
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.categories.some((c) => c.toLowerCase().includes(s)) ||
        p.tags.some((t) => t.toLowerCase().includes(s));
      const matchesMin = isNaN(min) ? true : p.price >= min;
      const matchesMax = isNaN(max) || max === 0 ? true : p.price <= max;
      return matchesText && matchesMin && matchesMax;
    });
  }, [products, search, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="text-muted-foreground">
          Explore our latest jewelry pieces
        </p>
      </div>

      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search products, categories, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-none"
              />
            </div>
            <Input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="rounded-none"
            />
            <Input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-none"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2Icon className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          No products found.
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <Card key={product.id} className="group overflow-hidden py-0 rounded-none">
              <div className="aspect-square bg-gray-50">
                {product.mainImage && (
                  <Image
                    src={resolveMediaUrl(product.mainImage)}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
              <CardContent className="pb-4 px-4">
                <div className="text-sm text-muted-foreground capitalize">
                  {product.categories.join(", ")}
                </div>
                <div className="font-medium mt-1">{product.title}</div>
                <div className="mt-1">${product.price}</div>
                <div className="mt-3 flex gap-2">
                  <Button asChild size="sm" className="flex-1 rounded-none">
                    <a href={`/products/${product.id}`}>View</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
