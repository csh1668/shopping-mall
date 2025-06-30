"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Package, Truck, MapPin, CreditCard, Calendar, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useOrderStore } from "@/lib/stores/order-store"
import type { Order } from "@/lib/stores/order-store"

export default function OrderCompletePage({ params }: { params: { orderId: string } }) {
  const { getOrderById } = useOrderStore()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const foundOrder = getOrderById(params.orderId)
    setOrder(foundOrder || null)
  }, [params.orderId, getOrderById])

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">주문을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-6">주문번호를 확인해주세요.</p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
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

  const getStatusText = (status: Order["status"]) => {
    const statusMap = {
      pending: "결제 대기",
      paid: "결제 완료",
      preparing: "상품 준비중",
      shipped: "배송중",
      delivered: "배송 완료",
      cancelled: "주문 취소",
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Order["status"]) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      preparing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colorMap[status]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다!</h1>
          <p className="text-muted-foreground">주문해주셔서 감사합니다. 빠른 시일 내에 배송해드리겠습니다.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  주문 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">주문번호</p>
                    <p className="font-mono font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">주문일시</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">주문상태</p>
                    <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">예상 배송일</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
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
                <div className="space-y-2">
                  <p>
                    <strong>{order.shippingInfo.name}</strong> | {order.shippingInfo.phone}
                  </p>
                  <p>{order.shippingInfo.email}</p>
                  <p>
                    ({order.shippingInfo.zipCode}) {order.shippingInfo.address} {order.shippingInfo.detailAddress}
                  </p>
                  {order.shippingInfo.deliveryRequest && (
                    <p className="text-sm text-muted-foreground">배송 요청사항: {order.shippingInfo.deliveryRequest}</p>
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
                <div className="space-y-3">
                  <div>
                    {order.paymentInfo.method === "card" && (
                      <div>
                        <p className="font-medium">신용카드 결제</p>
                        <p className="text-sm text-muted-foreground">
                          {order.paymentInfo.cardNumber
                            ?.replace(/(\d{4})/g, "$1 ")
                            .trim()
                            .replace(/\d(?=\d{4})/g, "*")}{" "}
                          | {order.paymentInfo.cardholderName}
                        </p>
                      </div>
                    )}
                    {order.paymentInfo.method === "bank" && (
                      <div>
                        <p className="font-medium">계좌이체</p>
                        <p className="text-sm text-muted-foreground">
                          {order.paymentInfo.bankName} | {order.paymentInfo.accountNumber}
                        </p>
                      </div>
                    )}
                    {order.paymentInfo.method === "kakao" && <p className="font-medium">카카오페이</p>}
                    {order.paymentInfo.method === "naver" && <p className="font-medium">네이버페이</p>}
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

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>주문 상품 ({order.items.length}개)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
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
                        <div className="flex gap-2 mt-1">
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
                          <span className="font-medium">{item.price.toLocaleString()}원</span>
                          <span className="text-sm text-muted-foreground">수량: {item.quantity}개</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>배송 추적</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Truck className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">배송 준비중</p>
                    <p className="text-sm text-muted-foreground">곧 배송이 시작됩니다</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  배송 추적하기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>고객 지원</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  주문 내역 보기
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  1:1 문의하기
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  교환/반품 신청
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full">
                  쇼핑 계속하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/category/electronics">
                <Button variant="outline" className="w-full bg-transparent">
                  추천 상품 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
