import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  size: "S" | "M" | "L" | "XL" | "XXL";
  fabric: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (i) => i._id === item._id && i.size === item.size
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingItemIndex].quantity + quantity;
          updatedItems[existingItemIndex].quantity = Math.min(newQty, item.maxStock);
          set({ items: updatedItems });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: Math.min(quantity, item.maxStock) }],
          });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter((item) => !(item._id === id && item.size === size)),
        });
      },

      updateQuantity: (id, size, quantity) => {
        const currentItems = get().items;
        const itemIndex = currentItems.findIndex(
          (item) => item._id === id && item.size === size
        );

        if (itemIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[itemIndex].quantity = Math.max(
            1,
            Math.min(quantity, updatedItems[itemIndex].maxStock)
          );
          set({ items: updatedItems });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "blvck-cart-storage",
      skipHydration: false,
    }
  )
);
