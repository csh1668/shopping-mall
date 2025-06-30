import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  brand: string
  quantity: number
  selectedColor?: string
  selectedSize?: string
  inStock: boolean
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getOriginalTotalPrice: () => number
  toggleCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(
          (item) =>
            item.id === newItem.id &&
            item.selectedColor === newItem.selectedColor &&
            item.selectedSize === newItem.selectedSize,
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id &&
              item.selectedColor === existingItem.selectedColor &&
              item.selectedSize === existingItem.selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          })
        } else {
          set({
            items: [...items, { ...newItem, quantity: 1 }],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getOriginalTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0)
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      closeCart: () => {
        set({ isOpen: false })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
