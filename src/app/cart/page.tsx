"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  // Helper function to ensure price is a number
  const formatPrice = (price: number | string): string => {
    const numPrice =
      typeof price === "string" ? parseFloat(price) : Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center space-x-2 py-3 sm:py-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
                asChild
              >
                <Link href="/products">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Shopping Cart
              </h1>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 text-center">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Looks like you haven&apos;t added any items to your cart yet.
                Start shopping to fill it up!
              </p>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href="/products" className="flex items-center space-x-2">
                <span>Continue Shopping</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
                asChild
              >
                <Link href="/products">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Shopping Cart
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-3">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-4">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={`${item.productId}-${item.size || "no-size"}`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image && (
                          <Image
                            src={resolveMediaUrl(item.image)}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                            {item.title}
                          </h3>
                          {item.size && (
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Size: {item.size}
                            </p>
                          )}
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm sm:text-base font-medium">
                            ${formatPrice(item.price)}
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none rounded-l-md"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                    item.size
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none rounded-r-md"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                    item.size
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() =>
                                removeItem(item.productId, item.size)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm text-muted-foreground">
                            Item total
                          </span>
                          <span className="text-base font-semibold">
                            ${formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link
                  href="/products"
                  className="flex items-center justify-center space-x-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="sticky top-20 lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium">
                      ${formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {subtotal > 100 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span>${formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button
                    asChild
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                  >
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 text-sm"
                    onClick={clear}
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure checkout</span>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                  <h4 className="font-medium text-sm sm:text-base">
                    Free Shipping
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Free shipping on orders over $100. Standard shipping takes
                    3-5 business days.
                  </p>
                  <h4 className="font-medium text-sm sm:text-base">
                    Easy Returns
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    30-day return policy. Items must be in original condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
