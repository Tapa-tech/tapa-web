import { create } from "zustand";

export interface CartItemState {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
  codAvailability?: string;
  isCustomKit?: boolean;
  customKitItems?: Array<{ itemName: string; itemFunction: string; quantity: number }>;
}

export interface FlatLocalCartItem {
  id: string;
  name: string;
  price: number;
  imgGrad?: string;
  isCustomKit?: boolean;
  customKitItems?: Array<{ itemName: string; itemFunction: string; quantity: number }>;
}

export interface DBCartItem {
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: string | number;
    images?: string[] | null;
    category?: string | null;
    codAvailability?: string | null;
  };
}

interface CartStore {
  items: CartItemState[];
  loading: boolean;
  isLoggedIn: boolean;
  checkAuth: () => Promise<boolean>;
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    details: Omit<CartItemState, "productId" | "quantity">
  ) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncLocalCartToDb: () => Promise<void>;
}


function syncToLocalStorage(items: CartItemState[]) {
  const flatItems: FlatLocalCartItem[] = [];
  items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      flatItems.push({
        id: item.productId,
        name: item.name,
        price: item.price,
        imgGrad: item.image ? undefined : "linear-gradient(135deg,#3A2A08,#8A5A14)",
        isCustomKit: item.isCustomKit,
        customKitItems: item.customKitItems,
      });
    }
  });
  localStorage.setItem("tap-cart", JSON.stringify(flatItems));
  window.dispatchEvent(new Event("cart-updated"));
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  isLoggedIn: false,

  checkAuth: async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        const loggedIn = !!data?.session?.user;
        set({ isLoggedIn: loggedIn });
        return loggedIn;
      }
    } catch (e) {
      console.error("Auth check error in cartStore:", e);
    }
    set({ isLoggedIn: false });
    return false;
  },

  fetchCart: async () => {
    set({ loading: true });
    try {
      const isLoggedIn = await get().checkAuth();
      if (isLoggedIn) {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          const dbItems: CartItemState[] = (data as DBCartItem[]).map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: Number(item.product.price),
            image: item.product.images?.[0] || undefined,
            quantity: item.quantity,
            category: item.product.category || undefined,
            codAvailability: item.product.codAvailability || undefined,
          }));
          set({ items: dbItems });
          syncToLocalStorage(dbItems);
        }
      } else {
        const stored = localStorage.getItem("tap-cart");
        if (stored) {
          try {
            const flatItems = JSON.parse(stored) as FlatLocalCartItem[];
            
            const grouped: { [key: string]: CartItemState } = {};
            flatItems.forEach((item: FlatLocalCartItem) => {
              const id = item.id;
              if (grouped[id]) {
                grouped[id].quantity += 1;
              } else {
                grouped[id] = {
                  productId: id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  isCustomKit: item.isCustomKit,
                  customKitItems: item.customKitItems,
                };
              }
            });
            set({ items: Object.values(grouped) });
          } catch (e) {
            console.error("Failed to parse local cart:", e);
            set({ items: [] });
          }
        } else {
          set({ items: [] });
        }
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity, details) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.productId === productId);
    const updatedItems = [...currentItems];

    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push({
        productId,
        quantity,
        ...details,
      });
    }

    set({ items: updatedItems });
    syncToLocalStorage(updatedItems);

    const isLoggedIn = get().isLoggedIn;
    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (err) {
        console.error("Failed to sync add to database:", err);
      }
    }
  },

  removeFromCart: async (productId) => {
    const updatedItems = get().items.filter((item) => item.productId !== productId);
    set({ items: updatedItems });
    syncToLocalStorage(updatedItems);

    const isLoggedIn = get().isLoggedIn;
    if (isLoggedIn) {
      try {
        await fetch(`/api/cart?productId=${productId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to sync delete to database:", err);
      }
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await get().removeFromCart(productId);
      return;
    }

    const updatedItems = get().items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    set({ items: updatedItems });
    syncToLocalStorage(updatedItems);

    const isLoggedIn = get().isLoggedIn;
    if (isLoggedIn) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      } catch (err) {
        console.error("Failed to sync update quantity to database:", err);
      }
    }
  },

  clearCart: async () => {
    set({ items: [] });
    localStorage.removeItem("tap-cart");
    window.dispatchEvent(new Event("cart-updated"));

    const isLoggedIn = get().isLoggedIn;
    if (isLoggedIn) {
      try {
        await fetch("/api/cart/clear", {
          method: "POST",
        });
      } catch (err) {
        console.error("Failed to clear cart in database:", err);
      }
    }
  },

  syncLocalCartToDb: async () => {
    const localStored = localStorage.getItem("tap-cart");
    if (!localStored) return;

    try {
      const flatItems = JSON.parse(localStored) as FlatLocalCartItem[];
      const grouped: { [key: string]: number } = {};
      flatItems.forEach((item: FlatLocalCartItem) => {
        grouped[item.id] = (grouped[item.id] || 0) + 1;
      });

      
      for (const [productId, quantity] of Object.entries(grouped)) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
      }

      
      await get().fetchCart();
    } catch (err) {
      console.error("Failed to sync local cart to DB:", err);
    }
  },
}));
