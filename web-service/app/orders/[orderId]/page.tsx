"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, MapPin, CreditCard, Truck, MessageSquare, RotateCcw, X, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { useOrderStore } from "@/lib/stores/order-store"
import { useCartStore } from "@/lib/stores/cart-store"
import type { Order } from "@/lib/stores/order-store"

// 배송 추적 단계
const trackingSteps = [
  { status: "paid", label: "결제 완료", description: "주문이 접수되었습니다" },
  { status: "preparing", label: "상품 준비", description: "상품을 준비하고 있습니다" },
  { status: "shipped", label: "배송 시작", description: "상품이 배송을 시작했습니다" },
  { status: "delivered", label: "배송 완료", description: "상품이 배송 완료되었습니다" },
]

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { getOrderById, cancelOrder } = useOrderStore()
  const { addItem } = useCartStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const foundOrder = getOrderById(params.orderId)
    setOrder(foundOrder || null)
  }, [params.orderId, getOrderById])

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">주문을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-6">주문번호를 확인해주세요.</p>
          <Link href="/orders">
            <Button>주문 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCancelOrder = () => {
    cancelOrder(order.id)
    setShowCancelDialog(false)
    setOrder({ ...order, status: "cancelled" })
  }

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        brand: item.brand,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        inStock: item.inStock,
      })
    })
    alert("상품이 장바구니에 추가되었습니다!")
  }

  const getCurrentStepIndex = () => {
    const statusOrder = ["paid", "preparing", "shipped", "delivered"]
    return statusOrder.indexOf(order.status)
  }

  const canCancel = order.status === "paid" || order.status === "preparing"
  const canReorder = order.status === "delivered" || order.status === "cancelled"
  const canTrack = order.status === "shipped" || order.status === "preparing"
  const canReview = order.status === "delivered"

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">주문 상세</h1>
              <p className="text-muted-foreground">주문번호: {order.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                영수증 다운로드
              </Button>
              {canCancel && (
                <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)}>
                  <X className="h-4 w-4 mr-2" />
                  주문 취소
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status & Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      주문 상태
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.status !== "cancelled" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>진행률</span>
                        <span>{Math.round(((getCurrentStepIndex() + 1) / trackingSteps.length) * 100)}%</span>
                      </div>
                      <Progress value={((getCurrentStepIndex() + 1) / trackingSteps.length) * 100} />

                      <div className="space-y-3 mt-6">
                        {trackingSteps.map((step, index) => (
                          <div key={step.status} className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                index <= getCurrentStepIndex()
                                  ? "bg-primary text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-medium ${index <= getCurrentStepIndex() ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {step.label}
                              </p>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                            {index === getCurrentStepIndex() && <Badge variant="secondary">현재</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.status === "cancelled" && (
                    <div className="text-center py-8">
                      <X className="h-12 w-12 mx-auto mb-4 text-red-500" />
                      <h3 className="text-lg font-medium mb-2">주문이 취소되었습니다</h3>
                      <p className="text-muted-foreground">결제 금액은 영업일 기준 3-5일 내에 환불됩니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    주문 상품 ({order.items.length}개)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.brand}</p>
                          <div className="flex gap-2 mt-2">
                            {item.selectedColor && (
                              <Badge variant="outline" className="text-xs">
                                색상: {item.selectedColor}
                              </Badge>
                            )}
                            {item.selectedSize && (
                              <Badge variant="outline" className="text-xs">
                                사이즈: {item.selectedSize}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <span className="font-medium">{item.price.toLocaleString()}원</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-muted-foreground line-through ml-2">
                                  {item.originalPrice.toLocaleString()}원
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">수량: {item.quantity}개</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {canReview && (
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              리뷰
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            교환/반품
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    배송 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{order.shippingInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingInfo.phone}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm">
                        ({order.shippingInfo.zipCode}) {order.shippingInfo.address}
                      </p>
                      <p className="text-sm">{order.shippingInfo.detailAddress}</p>
                    </div>
                    {order.shippingInfo.deliveryRequest && (
                      <div>
                        <p className="text-sm font-medium">배송 요청사항</p>
                        <p className="text-sm text-muted-foreground">{order.shippingInfo.deliveryRequest}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    결제 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">
                        {order.paymentInfo.method === "card" && "신용카드"}
                        {order.paymentInfo.method === "bank" && "계좌이체"}
                        {order.paymentInfo.method === "kakao" && "카카오페이"}
                        {order.paymentInfo.method === "naver" && "네이버페이"}
                      </p>
                      {order.paymentInfo.method === "card" && (
                        <p className="text-sm text-muted-foreground">
                          {order.paymentInfo.cardNumber
                            ?.replace(/(\d{4})/g, "$1 ")
                            .trim()
                            .replace(/\d(?=\d{4})/g, "*")}{" "}
                          | {order.paymentInfo.cardholderName}
                        </p>
                      )}
                      {order.paymentInfo.method === "bank" && (
                        <p className="text-sm text-muted-foreground">
                          {order.paymentInfo.bankName} | {order.paymentInfo.accountNumber}
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>상품 금액</span>
                        <span>{order.totalAmount.toLocaleString()}원</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>할인 금액</span>
                          <span>-{order.discountAmount.toLocaleString()}원</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>배송비</span>
                        <span>
                          {order.shippingFee === 0 ? (
                            <span className="text-green-600">무료</span>
                          ) : (
                            `${order.shippingFee.toLocaleString()}원`
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>총 결제금액</span>
                        <span className="text-primary">{order.finalAmount.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>주문 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>주문일시</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>예상 배송일</span>
                      <span>{formatDate(order.estimatedDelivery)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>상품 개수</span>
                      <span>{order.items.length}개</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{order.finalAmount.toLocaleString()}원</p>
                    <p className="text-sm text-muted-foreground">총 결제금액</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 액션</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canTrack && (
                    <Button className="w-full bg-transparent" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      배송 추적
                    </Button>
                  )}
                  {canReorder && (
                    <Button className="w-full bg-transparent" variant="outline" onClick={handleReorder}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      재주문
                    </Button>
                  )}
                  <Button className="w-full bg-transparent" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    1:1 문의
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    교환/반품 신청
                  </Button>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="space-y-3">
                <Link href="/orders">
                  <Button variant="outline" className="w-full bg-transparent">
                    주문 내역으로 돌아가기
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">쇼핑 계속하기</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>주문을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              주문을 취소하면 되돌릴 수 없습니다. 결제된 금액은 영업일 기준 3-5일 내에 환불됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
              주문 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
