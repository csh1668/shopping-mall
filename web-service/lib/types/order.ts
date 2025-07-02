import { Order as PrismaOrder, OrderItem as PrismaOrderItem, OrderStatusHistory as PrismaOrderStatusHistory, OrderStatus, PaymentStatus } from '@prisma/client'

// DB 모델 그대로 사용
export type Order = PrismaOrder
export type OrderItem = PrismaOrderItem
export type OrderStatusHistory = PrismaOrderStatusHistory

// 클라이언트에서 사용할 타입들
export type ClientOrder = Omit<Order, 'userId' | 'createdAt' | 'updatedAt'>
export type ClientOrderItem = Omit<OrderItem, 'orderId' | 'createdAt' | 'updatedAt'>

// 생성 시 사용하는 타입들
export type CreateOrderInput = Omit<Order, 'id' | 'orderNumber' | 'userId' | 'createdAt' | 'updatedAt'>
export type CreateOrderItemInput = Omit<OrderItem, 'id' | 'orderId'>

// 업데이트 시 사용하는 타입들
export type UpdateOrderInput = Partial<Pick<Order, 'status' | 'paymentStatus' | 'trackingNumber' | 'notes'>> & { id: string }

// 주문 상태 및 결제 상태 타입
export { OrderStatus, PaymentStatus }

// 주문 검증 함수
export function validateOrder(order: Partial<CreateOrderInput>): string[] {
  const errors: string[] = []
  
  if (!order.addressId?.trim()) errors.push("배송지를 선택해주세요")
  if (!order.totalAmount || order.totalAmount <= 0) errors.push("올바른 총 금액을 입력해주세요")
  if (!order.paymentMethod?.trim()) errors.push("결제 방법을 선택해주세요")
  if (order.shippingFee !== undefined && order.shippingFee < 0) errors.push("배송비는 0 이상이어야 합니다")
  if (order.taxAmount !== undefined && order.taxAmount < 0) errors.push("세금은 0 이상이어야 합니다")
  
  return errors
}

// 주문 항목 검증 함수
export function validateOrderItem(item: Partial<CreateOrderItemInput>): string[] {
  const errors: string[] = []
  
  if (!item.productId?.trim()) errors.push("상품을 선택해주세요")
  if (!item.name?.trim()) errors.push("상품명을 입력해주세요")
  if (!item.price || item.price <= 0) errors.push("올바른 가격을 입력해주세요")
  if (!item.quantity || item.quantity <= 0) errors.push("올바른 수량을 입력해주세요")
  
  return errors
}

// 주문번호 생성 함수
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp.slice(-8)}-${random}`
}

// 주문 상태 변경 함수
export function createOrderStatusHistory(orderId: string, status: OrderStatus, notes?: string): Omit<OrderStatusHistory, 'id' | 'createdAt'> {
  return {
    orderId,
    status,
    notes: notes || null,
  }
}

// 주문 요약 정보 타입
export type OrderSummary = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  itemCount: number
  createdAt: Date
}

// 주문 상세 정보 (관계 포함)
export type OrderWithDetails = Order & {
  items: OrderItem[]
  statusHistory: OrderStatusHistory[]
  user: {
    id: string
    fullName: string | null
  }
  address: {
    id: string
    name: string
    address: string
    detailAddress: string | null
    zipCode: string
  }
}

// 주문 필터 타입
export type OrderFilter = {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  startDate?: Date
  endDate?: Date
  search?: string
}

// 주문 정렬 타입
export type OrderSort = 
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'totalAmount_desc'
  | 'totalAmount_asc'
  | 'orderNumber_asc'
  | 'orderNumber_desc'

// 주문 목록 조회 옵션
export type OrderListOptions = {
  page?: number
  limit?: number
  filter?: OrderFilter
  sort?: OrderSort
}
