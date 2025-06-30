"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Heart, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/stores/cart-store"

// 추천 상품 데이터
const recommendedProducts = [
  {
    id: 11,
    name: "무선 충전패드",
    price: 45000,
    originalPrice: 59000,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.5,
    brand: "ChargeTech",
  },
  {
    id: 12,
    name: "스마트폰 케이스",
    price: 25000,
    originalPrice: 35000,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    brand: "ProtectPro",
  },
  {
    id: 13,
    name: "블루투스 키보드",
    price: 89000,
    originalPrice: 120000,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    brand: "TypeMaster",
  },
]

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getOriginalTotalPrice, addItem } = useCartStore()

  const [selectedItems, setSelectedItems] = useState<number[]>(items.map((item) => item.id))
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const totalPrice = getTotalPrice()
  const originalTotalPrice = getOriginalTotalPrice()
  const totalSavings = originalTotalPrice - totalPrice

  // 선택된 아이템들의 총 가격
  const selectedTotalPrice = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleApplyCoupon = () => {
    // 간단한 쿠폰 시스템 (실제로는 서버에서 검증)
    const coupons: Record<string, number> = {
      WELCOME10: 0.1,
      SAVE5000: 5000,
      NEWUSER: 0.15,
    }

    if (coupons[couponCode]) {
      const discount =
        typeof coupons[couponCode] === "number" && coupons[couponCode] < 1
          ? selectedTotalPrice * coupons[couponCode]
          : coupons[couponCode]

      setAppliedCoupon({ code: couponCode, discount })
      setCouponCode("")
    } else {
      alert("유효하지 않은 쿠폰 코드입니다.")
    }
  }

  const finalPrice = appliedCoupon ? Math.max(0, selectedTotalPrice - appliedCoupon.discount) : selectedTotalPrice

  const shippingFee = finalPrice >= 50000 ? 0 : 3000

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h1>
            <p className="text-muted-foreground mb-8">원하는 상품을 담아보세요!</p>
            <Link href="/">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                쇼핑 계속하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">장바구니</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select All */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedItems.length === items.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="font-medium cursor-pointer">
                      전체선택 ({selectedItems.length}/{items.length})
                    </label>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    전체삭제
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />

                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>

                            {(item.selectedColor || item.selectedSize) && (
                              <div className="flex gap-2 mt-2">
                                {item.selectedColor && <Badge variant="outline">색상: {item.selectedColor}</Badge>}
                                {item.selectedSize && <Badge variant="outline">사이즈: {item.selectedSize}</Badge>}
                              </div>
                            )}
                          </div>

                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">{item.price.toLocaleString()}원</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {item.originalPrice.toLocaleString()}원
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium">총 {(item.price * item.quantity).toLocaleString()}원</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  쿠폰 적용
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="쿠폰 코드 입력"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode}>
                      적용
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">쿠폰 적용: {appliedCoupon.code}</span>
                      <span className="text-green-600 font-medium">-{appliedCoupon.discount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">사용 가능한 쿠폰: WELCOME10, SAVE5000, NEWUSER</div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">주문 요약</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>선택 상품 ({selectedItems.length}개)</span>
                    <span>{selectedTotalPrice.toLocaleString()}원</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>쿠폰 할인</span>
                      <span>-{appliedCoupon.discount.toLocaleString()}원</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">무료</span>
                      ) : (
                        `${shippingFee.toLocaleString()}원`
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>총 결제금액</span>
                    <span>{(finalPrice + shippingFee).toLocaleString()}원</span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {(50000 - finalPrice).toLocaleString()}원 더 구매하면 무료배송!
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg" disabled={selectedItems.length === 0}>
                      주문하기 ({selectedItems.length}개)
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      쇼핑 계속하기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">함께 구매하면 좋은 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                    <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold">{product.price.toLocaleString()}원</span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice.toLocaleString()}원
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          brand: product.brand,
                          inStock: true,
                        })
                      }
                    >
                      장바구니 담기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
