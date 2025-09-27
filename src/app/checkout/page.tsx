"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const disabled = items.length === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="text-muted-foreground">
        Payments to be integrated (Stripe).
      </p>
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span>Order subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <Button className="mt-4" disabled={disabled}>
          Place order
        </Button>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
    </div>
  );
}
