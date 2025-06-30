"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, CreditCard, MapPin, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/stores/cart-store"
import { useOrderStore } from "@/lib/stores/order-store"
import { ShippingForm } from "@/components/shipping-form"
import { PaymentForm } from "@/components/payment-form"
import type { ShippingInfo, PaymentInfo } from "@/lib/stores/order-store"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getOriginalTotalPrice, clearCart } = useCartStore()
  const { setCurrentOrder, addOrder } = useOrderStore()

  const [step, setStep] = useState(1) // 1: 배송정보, 2: 결제정보, 3: 주문확인
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = getTotalPrice()
  const originalTotalPrice = getOriginalTotalPrice()
  const discountAmount = originalTotalPrice - totalPrice
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalAmount = totalPrice + shippingFee

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data)
    setStep(2)
  }

  const handlePaymentSubmit = (data: PaymentInfo) => {
    setPaymentInfo(data)
    setStep(3)
  }

  const handleOrderSubmit = async () => {
    if (!shippingInfo || !paymentInfo) return

    setIsProcessing(true)

    try {
      // 주문 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const now = new Date()
      const estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3일 후

      const order = {
        id: orderId,
        items,
        shippingInfo,
        paymentInfo,
        totalAmount: totalPrice,
        discountAmount,
        shippingFee,
        finalAmount,
        status: "paid" as const,
        createdAt: now.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
      }

      addOrder(order)
      clearCart()
      router.push(`/order/complete/${orderId}`)
    } catch (error) {
      alert("주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">주문/결제</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-muted"}`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="font-medium">배송정보</span>
            </div>
            <div className="w-8 h-px bg-muted" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-muted"}`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="font-medium">결제정보</span>
            </div>
            <div className="w-8 h-px bg-muted" />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-muted"}`}
              >
                3
              </div>
              <span className="font-medium">주문확인</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && <ShippingForm onSubmit={handleShippingSubmit} />}
            {step === 2 && <PaymentForm onSubmit={handlePaymentSubmit} amount={finalAmount} />}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>주문 확인</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 배송 정보 확인 */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      배송 정보
                    </h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p>
                        <strong>{shippingInfo?.name}</strong> | {shippingInfo?.phone}
                      </p>
                      <p>{shippingInfo?.email}</p>
                      <p>
                        ({shippingInfo?.zipCode}) {shippingInfo?.address} {shippingInfo?.detailAddress}
                      </p>
                      {shippingInfo?.deliveryRequest && (
                        <p className="text-sm text-muted-foreground">요청사항: {shippingInfo.deliveryRequest}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mt-2">
                      수정
                    </Button>
                  </div>

                  {/* 결제 정보 확인 */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      결제 정보
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      {paymentInfo?.method === "card" && (
                        <div>
                          <p>신용카드 결제</p>
                          <p className="text-sm text-muted-foreground">
                            {paymentInfo.cardNumber
                              ?.replace(/(\d{4})/g, "$1 ")
                              .trim()
                              .replace(/\d(?=\d{4})/g, "*")}{" "}
                            | {paymentInfo.cardholderName}
                          </p>
                        </div>
                      )}
                      {paymentInfo?.method === "bank" && (
                        <div>
                          <p>계좌이체</p>
                          <p className="text-sm text-muted-foreground">
                            {paymentInfo.bankName} | {paymentInfo.accountNumber}
                          </p>
                        </div>
                      )}
                      {paymentInfo?.method === "kakao" && <p>카카오페이</p>}
                      {paymentInfo?.method === "naver" && <p>네이버페이</p>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="mt-2">
                      수정
                    </Button>
                  </div>

                  <Button onClick={handleOrderSubmit} className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? "주문 처리 중..." : `${finalAmount.toLocaleString()}원 결제하기`}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  주문 상품 ({items.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 상품 목록 */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                        <div className="flex gap-1 mt-1">
                          {item.selectedColor && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedColor}
                            </Badge>
                          )}
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-xs">
                              {item.selectedSize}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">{item.price.toLocaleString()}원</span>
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* 가격 요약 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>할인 금액</span>
                      <span>-{discountAmount.toLocaleString()}원</span>
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
                    <span className="text-primary">{finalAmount.toLocaleString()}원</span>
                  </div>
                </div>

                {shippingFee > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {(50000 - totalPrice).toLocaleString()}원 더 구매하면 무료배송!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
