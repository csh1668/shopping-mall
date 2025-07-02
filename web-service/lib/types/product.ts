import { Product as PrismaProduct, Category as PrismaCategory, ProductVariant as PrismaProductVariant, VariantType } from '@prisma/client'

// DB 모델 그대로 사용
export type Product = PrismaProduct
export type Category = PrismaCategory
export type ProductVariant = PrismaProductVariant

// 클라이언트에서 사용할 타입들
export type ClientProduct = Omit<Product, 'createdAt' | 'updatedAt'>
export type ClientCategory = Omit<Category, 'createdAt' | 'updatedAt'>
export type ClientProductVariant = Omit<ProductVariant, 'createdAt' | 'updatedAt'>

// 생성 시 사용하는 타입들
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
export type CreateProductVariantInput = Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>

// 업데이트 시 사용하는 타입들
export type UpdateProductInput = Partial<CreateProductInput> & { id: string }
export type UpdateCategoryInput = Partial<CreateCategoryInput> & { id: string }
export type UpdateProductVariantInput = Partial<CreateProductVariantInput> & { id: string }

// 상품 검증 함수
export function validateProduct(product: Partial<CreateProductInput>): string[] {
  const errors: string[] = []
  
  if (!product.name?.trim()) errors.push("상품명을 입력해주세요")
  if (!product.description?.trim()) errors.push("상품 설명을 입력해주세요")
  if (!product.price || product.price <= 0) errors.push("올바른 가격을 입력해주세요")
  if (!product.categoryId?.trim()) errors.push("카테고리를 선택해주세요")
  if (!product.brand?.trim()) errors.push("브랜드를 입력해주세요")
  if (!product.images || product.images.length === 0) errors.push("상품 이미지를 등록해주세요")
  if (product.stock !== undefined && product.stock < 0) errors.push("재고는 0 이상이어야 합니다")
  if (product.minStock !== undefined && product.minStock < 0) errors.push("최소 재고는 0 이상이어야 합니다")
  
  return errors
}

// 카테고리 검증 함수
export function validateCategory(category: Partial<CreateCategoryInput>): string[] {
  const errors: string[] = []
  
  if (!category.name?.trim()) errors.push("카테고리명을 입력해주세요")
  if (!category.slug?.trim()) errors.push("슬러그를 입력해주세요")
  
  // 슬러그 형식 검증 (영문, 숫자, 하이픈만 허용)
  const slugRegex = /^[a-z0-9-]+$/
  if (category.slug && !slugRegex.test(category.slug)) {
    errors.push("슬러그는 영문 소문자, 숫자, 하이픈만 사용 가능합니다")
  }
  
  return errors
}

// 상품 옵션 검증 함수
export function validateProductVariant(variant: Partial<CreateProductVariantInput>): string[] {
  const errors: string[] = []
  
  if (!variant.type) errors.push("옵션 타입을 선택해주세요")
  if (!variant.value?.trim()) errors.push("옵션값을 입력해주세요")
  if (variant.stock !== undefined && variant.stock < 0) errors.push("재고는 0 이상이어야 합니다")
  
  return errors
}

// 상품 옵션 타입
export { VariantType }

// 상품 옵션 선택 타입
export type SelectedOptions = {
  [key in VariantType]?: string
}

// 상품 필터 타입
export type ProductFilter = {
  categoryId?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  isFeatured?: boolean
  tags?: string[]
  search?: string
}

// 상품 정렬 타입
export type ProductSort = 
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'createdAt_desc'
  | 'rating_desc'
  | 'sales_desc'

// 상품 목록 조회 옵션
export type ProductListOptions = {
  page?: number
  limit?: number
  filter?: ProductFilter
  sort?: ProductSort
}

// 상품 상세 정보 (관계 포함)
export type ProductWithDetails = Product & {
  category: Category
  variants: ProductVariant[]
  reviews: Array<{
    id: string
    rating: number
    content: string
    createdAt: Date
  }>
  _count: {
    reviews: number
  }
} 