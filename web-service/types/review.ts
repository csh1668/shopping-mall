import { Review as PrismaReview } from '@prisma/client'

// DB 모델 그대로 사용
export type Review = PrismaReview

// 클라이언트에서 사용할 타입
export type ClientReview = Omit<Review, 'userId' | 'createdAt' | 'updatedAt'>

// 생성 시 사용하는 타입
export type CreateReviewInput = Omit<Review, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

// 업데이트 시 사용하는 타입
export type UpdateReviewInput = Partial<Pick<Review, 'rating' | 'title' | 'content' | 'images'>> & { id: string }

// 리뷰 검증 함수
export function validateReview(review: Partial<CreateReviewInput>): string[] {
  const errors: string[] = []
  
  if (!review.productId?.trim()) errors.push("상품을 선택해주세요")
  if (!review.rating || review.rating < 1 || review.rating > 5) errors.push("평점은 1-5 사이로 입력해주세요")
  if (!review.content?.trim()) errors.push("리뷰 내용을 입력해주세요")
  if (review.content && review.content.length < 10) errors.push("리뷰 내용은 10자 이상 입력해주세요")
  if (review.content && review.content.length > 1000) errors.push("리뷰 내용은 1000자 이하로 입력해주세요")
  if (review.title && review.title.length > 100) errors.push("리뷰 제목은 100자 이하로 입력해주세요")
  if (review.images && review.images.length > 5) errors.push("리뷰 이미지는 최대 5장까지 업로드 가능합니다")
  
  return errors
}

// 리뷰 평점 타입
export type ReviewRating = 1 | 2 | 3 | 4 | 5

// 리뷰 필터 타입
export type ReviewFilter = {
  productId?: string
  rating?: ReviewRating
  isVerified?: boolean
  startDate?: Date
  endDate?: Date
}

// 리뷰 정렬 타입
export type ReviewSort = 
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'rating_desc'
  | 'rating_asc'
  | 'helpfulCount_desc'

// 리뷰 목록 조회 옵션
export type ReviewListOptions = {
  page?: number
  limit?: number
  filter?: ReviewFilter
  sort?: ReviewSort
}

// 리뷰 상세 정보 (관계 포함)
export type ReviewWithDetails = Review & {
  user: {
    id: string
    fullName: string | null
  }
  product: {
    id: string
    name: string
    images: string[]
  }
}

// 리뷰 통계 정보
export type ReviewStats = {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    [key in ReviewRating]: number
  }
  verifiedReviews: number
}

// 리뷰 통계 계산 함수
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0
  
  const ratingDistribution = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  }
  
  reviews.forEach(review => {
    ratingDistribution[review.rating as ReviewRating]++
  })
  
  const verifiedReviews = reviews.filter(review => review.orderId).length
  
  return {
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10, // 소수점 첫째자리까지
    ratingDistribution,
    verifiedReviews,
  }
} 