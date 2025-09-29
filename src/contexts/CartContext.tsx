"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Product } from "@/types";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clear: () => void;
  totalQuantity: number;
  subtotal: number;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "melvin_cart_v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback(
    (product: Product, quantity = 1, size?: string) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.productId === product.id && (i.size || "") === (size || "")
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            title: product.title,
            price:
              typeof product.price === "string"
                ? parseFloat(product.price)
                : Number(product.price),
            image: product.mainImage,
            size,
            quantity,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (i.size || "") === (size || ""))
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && (i.size || "") === (size || "")
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        )
      );
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const price =
          typeof i.price === "string" ? parseFloat(i.price) : Number(i.price);
        return sum + (isNaN(price) ? 0 : price) * i.quantity;
      }, 0),
    [items]
  );

  const value = useMemo<CartState>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      totalQuantity,
      subtotal,
    }),
    [items, addItem, removeItem, updateQuantity, clear, totalQuantity, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
