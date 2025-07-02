import { Coupon as PrismaCoupon, CouponType } from '@prisma/client'

// DB 모델 그대로 사용
export type Coupon = PrismaCoupon

// 클라이언트에서 사용할 타입
export type ClientCoupon = Omit<Coupon, 'createdAt' | 'updatedAt'>

// 생성 시 사용하는 타입
export type CreateCouponInput = Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>

// 업데이트 시 사용하는 타입
export type UpdateCouponInput = Partial<CreateCouponInput> & { id: string }

// 쿠폰 타입
export { CouponType }

// 쿠폰 검증 함수
export function validateCoupon(coupon: Partial<CreateCouponInput>): string[] {
  const errors: string[] = []
  
  if (!coupon.code?.trim()) errors.push("쿠폰 코드를 입력해주세요")
  if (!coupon.name?.trim()) errors.push("쿠폰명을 입력해주세요")
  if (!coupon.type) errors.push("쿠폰 타입을 선택해주세요")
  if (!coupon.value || coupon.value <= 0) errors.push("올바른 할인값을 입력해주세요")
  if (!coupon.validFrom) errors.push("유효 시작일을 입력해주세요")
  if (!coupon.validUntil) errors.push("유효 종료일을 입력해주세요")
  
  // 쿠폰 코드 형식 검증 (영문, 숫자, 하이픈만 허용)
  const codeRegex = /^[A-Z0-9-]+$/
  if (coupon.code && !codeRegex.test(coupon.code)) {
    errors.push("쿠폰 코드는 영문 대문자, 숫자, 하이픈만 사용 가능합니다")
  }
  
  // 날짜 검증
  if (coupon.validFrom && coupon.validUntil && coupon.validFrom >= coupon.validUntil) {
    errors.push("유효 종료일은 시작일보다 이후여야 합니다")
  }
  
  // 할인값 검증
  if (coupon.type === 'PERCENTAGE' && coupon.value > 100) {
    errors.push("퍼센트 할인은 100%를 초과할 수 없습니다")
  }
  
  if (coupon.minAmount && coupon.minAmount <= 0) {
    errors.push("최소 주문 금액은 0보다 커야 합니다")
  }
  
  if (coupon.maxDiscount && coupon.maxDiscount <= 0) {
    errors.push("최대 할인 금액은 0보다 커야 합니다")
  }
  
  if (coupon.usageLimit && coupon.usageLimit <= 0) {
    errors.push("사용 제한 횟수는 0보다 커야 합니다")
  }
  
  return errors
}

// 쿠폰 적용 함수
export function calculateDiscount(coupon: Coupon, orderAmount: number): number {
  // 최소 주문 금액 확인
  if (coupon.minAmount && orderAmount < coupon.minAmount) {
    return 0
  }
  
  // 유효기간 확인
  const now = new Date()
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return 0
  }
  
  // 활성화 상태 확인
  if (!coupon.isActive) {
    return 0
  }
  
  // 사용 제한 확인
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return 0
  }
  
  // 할인 계산
  let discount = 0
  
  if (coupon.type === 'FIXED_AMOUNT') {
    discount = coupon.value
  } else if (coupon.type === 'PERCENTAGE') {
    discount = Math.floor(orderAmount * (coupon.value / 100))
  }
  
  // 최대 할인 금액 제한
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount
  }
  
  // 주문 금액을 초과하지 않도록
  if (discount > orderAmount) {
    discount = orderAmount
  }
  
  return discount
}

// 쿠폰 필터 타입
export type CouponFilter = {
  type?: CouponType
  isActive?: boolean
  validFrom?: Date
  validUntil?: Date
  search?: string
}

// 쿠폰 정렬 타입
export type CouponSort = 
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'validFrom_asc'
  | 'validUntil_asc'
  | 'code_asc'
  | 'name_asc'

// 쿠폰 목록 조회 옵션
export type CouponListOptions = {
  page?: number
  limit?: number
  filter?: CouponFilter
  sort?: CouponSort
}

// 쿠폰 사용 통계
export type CouponStats = {
  totalCoupons: number
  activeCoupons: number
  expiredCoupons: number
  totalUsage: number
  totalDiscount: number
}

// 쿠폰 통계 계산 함수
export function calculateCouponStats(coupons: Coupon[]): CouponStats {
  const now = new Date()
  
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(coupon => 
    coupon.isActive && 
    coupon.validFrom <= now && 
    coupon.validUntil >= now
  ).length
  const expiredCoupons = coupons.filter(coupon => 
    coupon.validUntil < now
  ).length
  const totalUsage = coupons.reduce((sum, coupon) => sum + coupon.usedCount, 0)
  const totalDiscount = coupons.reduce((sum, coupon) => sum + (coupon.value * coupon.usedCount), 0)
  
  return {
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    totalUsage,
    totalDiscount,
  }
} 