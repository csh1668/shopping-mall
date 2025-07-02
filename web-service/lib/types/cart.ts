import { CartItem as PrismaCartItem, WishlistItem as PrismaWishlistItem } from '@prisma/client'
import { VariantType, SelectedOptions } from './product'

// DB 모델 그대로 사용
export type CartItem = PrismaCartItem
export type WishlistItem = PrismaWishlistItem

// 클라이언트에서 사용할 타입들
export type ClientCartItem = Omit<CartItem, 'userId' | 'createdAt' | 'updatedAt'>
export type ClientWishlistItem = Omit<WishlistItem, 'userId' | 'createdAt'>

// 생성 시 사용하는 타입들
export type CreateCartItemInput = Omit<CartItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type CreateWishlistItemInput = Omit<WishlistItem, 'id' | 'userId' | 'createdAt'>

// 업데이트 시 사용하는 타입들
export type UpdateCartItemInput = Partial<Pick<CartItem, 'quantity' | 'selectedOptions'>> & { id: string }

// 장바구니 검증 함수
export function validateCartItem(item: Partial<CreateCartItemInput>): string[] {
  const errors: string[] = []
  
  if (!item.productId?.trim()) errors.push("상품을 선택해주세요")
  if (!item.quantity || item.quantity <= 0) errors.push("올바른 수량을 입력해주세요")
  if (item.quantity && item.quantity > 99) errors.push("수량은 99개 이하여야 합니다")
  
  return errors
}

// 위시리스트 검증 함수
export function validateWishlistItem(item: Partial<CreateWishlistItemInput>): string[] {
  const errors: string[] = []
  
  if (!item.productId?.trim()) errors.push("상품을 선택해주세요")
  
  return errors
}

// 장바구니 항목 상세 정보 (관계 포함)
export type CartItemWithDetails = CartItem & {
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    images: string[]
    stock: number
  }
}

// 위시리스트 항목 상세 정보 (관계 포함)
export type WishlistItemWithDetails = WishlistItem & {
  product: {
    id: string
    name: string
    price: number
    originalPrice: number | null
    images: string[]
    stock: number
  }
}

// 장바구니 요약 정보
export type CartSummary = {
  itemCount: number
  totalQuantity: number
  subtotal: number
  totalDiscount: number
  totalAmount: number
}

// 장바구니 계산 함수
export function calculateCartSummary(items: CartItemWithDetails[]): CartSummary {
  const itemCount = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.originalPrice || item.product.price
    return sum + (price * item.quantity)
  }, 0)
  const totalDiscount = items.reduce((sum, item) => {
    const discount = (item.product.originalPrice || item.product.price) - item.product.price
    return sum + (discount * item.quantity)
  }, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return {
    itemCount,
    totalQuantity,
    subtotal,
    totalDiscount,
    totalAmount,
  }
} 