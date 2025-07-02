// 모든 타입들을 한 곳에서 export
export * from './user-metadata'
export * from './address'
export * from './order'
export * from './cart'
export * from './review'
export * from './coupon'
export * from './product'

// 공통 타입들
export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// 공통 검증 함수들
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9-]+$/
  return phoneRegex.test(phone)
}