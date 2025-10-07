"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { productAPI } from "@/lib/api";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useRingSizerStore } from "@/stores/ringSizerStore";
import { Card, CardContent } from "@/components/ui/card";
import RingSizer from "@/components/RingSizer";
import {
  Loader2Icon,
  ChevronLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  Ruler,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function ProductDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showRingSizer, setShowRingSizer] = useState(false);
  const [latestMeasurement, setLatestMeasurement] = useState<{
    id: string;
    size: string;
    diameter: number;
    circumference: number;
    measurementMethod: "manual" | "auto-detected";
    deviceInfo?: {
      deviceName?: string;
      confidence: "high" | "medium" | "low";
      ppi: number;
    };
    timestamp: number;
  } | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { getLatestMeasurement } = useRingSizerStore();

  useEffect(() => {
    if (!params?.id) return;
    const run = async () => {
      try {
        setIsLoading(true);
        const p = await productAPI.getById(params.id);
        setProduct(p);
        if (p.ringSizes?.length) setSelectedSize(p.ringSizes[0]);
        if (p.mainImage) setSelectedImage(p.mainImage);

        // Check if user has a recent ring size measurement
        const measurement = getLatestMeasurement();
        setLatestMeasurement(measurement);
        if (measurement && p.ringSizes?.includes(measurement.size)) {
          setSelectedSize(measurement.size);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [params?.id, getLatestMeasurement]);

  // Function to refresh latest measurement
  const refreshMeasurement = () => {
    const measurement = getLatestMeasurement();
    setLatestMeasurement(measurement);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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

  const allImages = [
    product.mainImage,
    ...(product.galleryImages || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-gray-50">
                  {selectedImage && (
                    <Image
                      src={resolveMediaUrl(selectedImage)}
                      alt={product.title}
                      fill
                      className="object-cover transition-opacity duration-300"
                      unoptimized
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                {allImages.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square relative overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      selectedImage === image
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    <Image
                      src={resolveMediaUrl(image)}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                ${product.price}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ring Size Selection */}
            {product.ringSizes?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Ring Size</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRingSizer(true)}
                      className="text-xs"
                    >
                      <Ruler className="w-3 h-3 mr-1" />
                      Measure
                    </Button>
                  </div>
                </div>

                {/* Measurement Info */}
                {latestMeasurement && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-900">
                          Your measured size: {latestMeasurement.size}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        {latestMeasurement.diameter.toFixed(1)}mm diameter
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-blue-600">
                      Measured on{" "}
                      {new Date(
                        latestMeasurement.timestamp
                      ).toLocaleDateString()}
                      {latestMeasurement.deviceInfo && (
                        <span className="ml-2">
                          • {latestMeasurement.deviceInfo.deviceName}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {product.ringSizes.map((size) => {
                    const isMeasuredSize =
                      latestMeasurement && size === latestMeasurement.size;
                    const isSelected = size === selectedSize;

                    return (
                      <button
                        key={size}
                        className={`px-3 py-2 text-sm font-medium border rounded-md transition-all duration-200 relative ${
                          isSelected
                            ? "bg-foreground text-background border-foreground"
                            : isMeasuredSize
                            ? "bg-blue-100 text-blue-900 border-blue-300 ring-1 ring-blue-200"
                            : "border-border hover:border-foreground/50 hover:bg-muted"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                        {isMeasuredSize && !isSelected && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none rounded-l-md"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none rounded-r-md"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Ring Size Validation Message */}
              {product.ringSizes?.length > 0 && !selectedSize && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-amber-800">
                      Please select a ring size before adding to cart
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="h-12 text-base font-medium"
                  disabled={product.ringSizes?.length > 0 && !selectedSize}
                  onClick={() => {
                    if (!product) return;
                    if (product.ringSizes?.length > 0 && !selectedSize) {
                      alert("Please select a ring size before adding to cart");
                      return;
                    }
                    try {
                      addItem(product, quantity, selectedSize || undefined);
                    } catch (error) {
                      alert("Ring size is required for this product");
                    }
                  }}
                >
                  {product.ringSizes?.length > 0 && !selectedSize
                    ? "Select Ring Size First"
                    : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 text-base font-medium"
                  disabled={
                    (product.ringSizes?.length > 0 && !selectedSize) ||
                    isBuyingNow
                  }
                  onClick={async () => {
                    if (!product || isBuyingNow) return;
                    if (product.ringSizes?.length > 0 && !selectedSize) {
                      alert("Please select a ring size before placing order");
                      return;
                    }
                    setIsBuyingNow(true);
                    try {
                      addItem(product, quantity, selectedSize || undefined);
                      // Small delay to ensure cart is updated
                      await new Promise((resolve) => setTimeout(resolve, 100));
                      router.push("/checkout");
                    } catch (error) {
                      alert("Ring size is required for this product");
                      setIsBuyingNow(false);
                    }
                  }}
                >
                  {isBuyingNow
                    ? "Adding to Cart..."
                    : product.ringSizes?.length > 0 && !selectedSize
                    ? "Select Ring Size First"
                    : "Buy Now"}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="lg"
                asChild
                className="w-full h-12 text-base"
              >
                <Link
                  href="/products"
                  className="flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Shop
                </Link>
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">SKU:</span>
                  <span className="ml-2 text-muted-foreground">
                    {product.id}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-muted-foreground">
                    {product.categories?.join(", ") || "N/A"}
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Free shipping on orders over $100</p>
                <p>30-day return policy</p>
                <p>Lifetime warranty on craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ring Sizer Modal */}
      {showRingSizer && (
        <RingSizer
          onClose={() => setShowRingSizer(false)}
          onSizeSelected={(size) => {
            setSelectedSize(size);
            refreshMeasurement();
            setShowRingSizer(false);
          }}
        />
      )}
    </div>
  );
}
