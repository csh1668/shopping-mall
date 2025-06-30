"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Package, Calendar, CreditCard, MoreHorizontal, Truck, RotateCcw, MessageSquare, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { OrderStatusBadge } from "./order-status-badge"
import { useOrderStore } from "@/lib/stores/order-store"
import { useCartStore } from "@/lib/stores/cart-store"
import type { Order } from "@/lib/stores/order-store"

interface OrderCardProps {
  order: Order
  onReorder?: (orderId: string) => void
}

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const { cancelOrder } = useOrderStore()
  const { addItem } = useCartStore()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleCancelOrder = () => {
    cancelOrder(order.id)
    setShowCancelDialog(false)
  }

  const handleReorder = () => {
    // 주문 상품들을 장바구니에 추가
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
    onReorder?.(order.id)
  }

  const canCancel = order.status === "paid" || order.status === "preparing"
  const canReorder = order.status === "delivered" || order.status === "cancelled"
  const canTrack = order.status === "shipped" || order.status === "preparing"
  const canReview = order.status === "delivered"

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-medium">주문번호: {order.id}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/orders/${order.id}`}>주문 상세보기</Link>
                </DropdownMenuItem>
                {canTrack && (
                  <DropdownMenuItem>
                    <Truck className="h-4 w-4 mr-2" />
                    배송 추적
                  </DropdownMenuItem>
                )}
                {canReorder && (
                  <DropdownMenuItem onClick={handleReorder}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    재주문
                  </DropdownMenuItem>
                )}
                {canReview && (
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    리뷰 작성
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>교환/반품 신청</DropdownMenuItem>
                <DropdownMenuItem>1:1 문의</DropdownMenuItem>
                {canCancel && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => setShowCancelDialog(true)}>
                      <X className="h-4 w-4 mr-2" />
                      주문 취소
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 주문 상품들 */}
          <div className="space-y-3">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex gap-1">
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
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.price.toLocaleString()}원</p>
                      <p className="text-xs text-muted-foreground">수량: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {order.items.length > 2 && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">외 {order.items.length - 2}개 상품</p>
              </div>
            )}
          </div>

          <Separator />

          {/* 주문 요약 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>{order.items.length}개 상품</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                <span>
                  {order.paymentInfo.method === "card" && "신용카드"}
                  {order.paymentInfo.method === "bank" && "계좌이체"}
                  {order.paymentInfo.method === "kakao" && "카카오페이"}
                  {order.paymentInfo.method === "naver" && "네이버페이"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{order.finalAmount.toLocaleString()}원</p>
              {order.discountAmount > 0 && (
                <p className="text-xs text-green-600">{order.discountAmount.toLocaleString()}원 할인</p>
              )}
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2 pt-2">
            <Link href={`/orders/${order.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                주문 상세
              </Button>
            </Link>
            {canTrack && (
              <Button variant="outline" size="sm" className="bg-transparent">
                <Truck className="h-4 w-4 mr-1" />
                배송 추적
              </Button>
            )}
            {canReorder && (
              <Button variant="outline" size="sm" onClick={handleReorder} className="bg-transparent">
                <RotateCcw className="h-4 w-4 mr-1" />
                재주문
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 주문 취소 확인 다이얼로그 */}
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
