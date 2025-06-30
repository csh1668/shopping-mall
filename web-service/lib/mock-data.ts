export interface MockProduct {
  id: number
  name: string
  price: number
  salePrice?: number
  brand: string
  category: string
  images: string[]
  rating: number
  reviews: number
}

export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: "스마트폰",
    price: 800000,
    salePrice: 600000,
    brand: "TechPro",
    category: "electronics",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "노트북",
    price: 1200000,
    salePrice: 1000000,
    brand: "SmartTech",
    category: "electronics",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "무선 이어폰",
    price: 150000,
    salePrice: 120000,
    brand: "SoundMax",
    category: "electronics",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.3,
    reviews: 256,
  },
  {
    id: 4,
    name: "스니커즈",
    price: 89000,
    salePrice: 67000,
    brand: "UrbanStyle",
    category: "fashion",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.6,
    reviews: 189,
  },
  {
    id: 5,
    name: "스킨케어 세트",
    price: 45000,
    salePrice: 36000,
    brand: "GlowBeauty",
    category: "beauty",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 6,
    name: "운동복 세트",
    price: 65000,
    salePrice: 52000,
    brand: "ComfortWear",
    category: "sports",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.4,
    reviews: 156,
  },
  {
    id: 7,
    name: "요가 매트",
    price: 45000,
    salePrice: 36000,
    brand: "FitLife",
    category: "sports",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.5,
    reviews: 189,
  },
  {
    id: 8,
    name: "프로그래밍 도서",
    price: 35000,
    salePrice: 28000,
    brand: "TechBooks",
    category: "books",
    images: ["/placeholder.svg?height=300&width=300"],
    rating: 4.8,
    reviews: 123,
  },
] 