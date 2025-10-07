import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clear: () => void;
  totalQuantity: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, size) => {
        // Validate ring size requirement
        if (product.ringSizes && product.ringSizes.length > 0 && !size) {
          throw new Error("Ring size is required for this product");
        }

        set((state) => {
          const idx = state.items.findIndex(
            (i) => i.productId === product.id && (i.size || "") === (size || "")
          );

          if (idx >= 0) {
            const newItems = [...state.items];
            newItems[idx] = {
              ...newItems[idx],
              quantity: newItems[idx].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
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
            ],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && (i.size || "") === (size || ""))
          ),
        }));
      },

      updateQuantity: (productId, quantity, size) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && (i.size || "") === (size || "")
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }));
      },

      clear: () => set({ items: [] }),

      totalQuantity: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((sum, i) => {
          const price =
            typeof i.price === "string" ? parseFloat(i.price) : Number(i.price);
          return sum + (isNaN(price) ? 0 : price) * i.quantity;
        }, 0);
      },
    }),
    {
      name: "melvin_cart_v1", // Same storage key as before
    }
  )
);
