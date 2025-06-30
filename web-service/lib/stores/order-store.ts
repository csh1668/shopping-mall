import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "./cart-store"
import { supabase } from "../supabase"

export interface ShippingInfo {
  name: string
  phone: string
  email: string
  address: string
  detailAddress: string
  zipCode: string
  deliveryRequest?: string
}

export interface PaymentInfo {
  method: "card" | "bank" | "kakao" | "naver"
  cardNumber?: string
  expiryDate?: string
  cvc?: string
  cardholderName?: string
  bankName?: string
  accountNumber?: string
}

export interface Order {
  id: string
  items: CartItem[]
  shippingInfo: ShippingInfo
  paymentInfo: PaymentInfo
  totalAmount: number
  discountAmount: number
  shippingFee: number
  finalAmount: number
  couponCode?: string
  status: "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery: string
}

interface OrderStore {
  orders: Order[]
  currentOrder: Partial<Order> | null
  setCurrentOrder: (order: Partial<Order>) => void
  addOrder: (order: Order) => void
  getOrderById: (id: string) => Order | undefined
  updateOrderStatus: (id: string, status: Order["status"]) => void
  clearCurrentOrder: () => void
  cancelOrder: (id: string) => void
  searchOrders: (query: string) => Order[]
  getOrdersByStatus: (status: Order["status"]) => Order[]
  getOrdersByDateRange: (startDate: string, endDate: string) => Order[]
  reorder: (orderId: string) => void
  loadUserOrders: () => Promise<void>
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      setCurrentOrder: (order) => {
        set({ currentOrder: order })
      },

      addOrder: async (order) => {
        try {
          // Supabase에 주문 저장
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            const { error } = await supabase.from("orders").insert({
              id: order.id,
              user_id: user.id,
              order_data: order,
              status: order.status,
              total_amount: order.finalAmount,
            })

            if (error) {
              console.error("Order save error:", error)
            }
          }

          // 로컬 상태 업데이트
          set((state) => ({
            orders: [order, ...state.orders],
            currentOrder: null,
          }))
        } catch (error) {
          console.error("Add order error:", error)
        }
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id)
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        }))
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null })
      },
      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status: "cancelled" } : order)),
        }))
      },

      searchOrders: (query) => {
        const orders = get().orders
        if (!query.trim()) return orders

        return orders.filter(
          (order) =>
            order.id.toLowerCase().includes(query.toLowerCase()) ||
            order.items.some(
              (item) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.brand.toLowerCase().includes(query.toLowerCase()),
            ),
        )
      },

      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status)
      },

      getOrdersByDateRange: (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        return get().orders.filter((order) => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= start && orderDate <= end
        })
      },

      reorder: (orderId) => {
        const order = get().getOrderById(orderId)
        if (order) {
          // 장바구니에 상품들을 다시 추가하는 로직
          // 실제로는 cart store와 연동해야 함
          console.log("Reordering items:", order.items)
        }
      },

      loadUserOrders: async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (!user) return

          const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Load orders error:", error)
            return
          }

          const orders = data.map((row) => row.order_data)
          set({ orders })
        } catch (error) {
          console.error("Load user orders error:", error)
        }
      },
    }),
    {
      name: "order-storage",
    },
  ),
)
