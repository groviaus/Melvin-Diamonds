"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function HeaderCartBadge() {
  const { totalQuantity } = useCart();
  return (
    <Link href="/cart" className="relative">
      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-teal-700 transition-colors cursor-pointer" />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-teal-700 text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
