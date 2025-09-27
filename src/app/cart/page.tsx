"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { resolveMediaUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mt-2">Add items to get started.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size || "_"}`}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              {item.image && (
                <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden">
                  <Image
                    src={resolveMediaUrl(item.image)}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  ${item.price} {item.size ? `• Size ${item.size}` : ""}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1,
                        item.size
                      )
                    }
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1,
                        item.size
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    className="ml-4 text-red-600"
                    onClick={() => removeItem(item.productId, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border rounded-lg h-fit">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Taxes and shipping calculated at checkout.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" className="w-full mt-2" onClick={clear}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
