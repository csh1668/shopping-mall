"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Package, ArrowLeft, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useOrderStore } from "@/lib/stores/order-store"
import { OrderCard } from "@/components/order-card"
import type { Order } from "@/lib/stores/order-store"

const sortOptions = [
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "amount-high", label: "금액 높은순" },
  { value: "amount-low", label: "금액 낮은순" },
]

const dateRanges = [
  { value: "all", label: "전체" },
  { value: "1month", label: "1개월" },
  { value: "3months", label: "3개월" },
  { value: "6months", label: "6개월" },
  { value: "1year", label: "1년" },
]

export default function OrdersPage() {
  const { orders, searchOrders, getOrdersByStatus } = useOrderStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [dateRange, setDateRange] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "all">("all")

  // 주문 통계
  const orderStats = useMemo(() => {
    const stats = {
      total: orders.length,
      pending: 0,
      paid: 0,
      preparing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      stats[order.status]++
    })

    return stats
  }, [orders])

  // 필터링 및 정렬된 주문들
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // 검색 필터
    if (searchQuery.trim()) {
      filtered = searchOrders(searchQuery)
    }

    // 상태 필터
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus)
    }

    // 날짜 범위 필터
    if (dateRange !== "all") {
      const now = new Date()
      const startDate = new Date()

      switch (dateRange) {
        case "1month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          startDate.setMonth(now.getMonth() - 3)
          break
        case "6months":
          startDate.setMonth(now.getMonth() - 6)
          break
        case "1year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((order) => new Date(order.createdAt) >= startDate)
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "amount-high":
          return b.finalAmount - a.finalAmount
        case "amount-low":
          return a.finalAmount - b.finalAmount
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [orders, searchQuery, selectedStatus, dateRange, sortBy, searchOrders])

  const handleReorder = (orderId: string) => {
    // 재주문 성공 메시지
    alert("상품이 장바구니에 추가되었습니다!")
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">주문 상태</Label>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant={selectedStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("all")}
            className="justify-start"
          >
            전체 ({orderStats.total})
          </Button>
          <Button
            variant={selectedStatus === "paid" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("paid")}
            className="justify-start"
          >
            결제완료 ({orderStats.paid})
          </Button>
          <Button
            variant={selectedStatus === "preparing" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("preparing")}
            className="justify-start"
          >
            준비중 ({orderStats.preparing})
          </Button>
          <Button
            variant={selectedStatus === "shipped" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("shipped")}
            className="justify-start"
          >
            배송중 ({orderStats.shipped})
          </Button>
          <Button
            variant={selectedStatus === "delivered" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("delivered")}
            className="justify-start"
          >
            배송완료 ({orderStats.delivered})
          </Button>
          <Button
            variant={selectedStatus === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus("cancelled")}
            className="justify-start"
          >
            취소 ({orderStats.cancelled})
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-base font-medium">기간</Label>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-base font-medium">정렬</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

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
          <div>
            <h1 className="text-2xl font-bold">주문 내역</h1>
            <p className="text-muted-foreground">총 {orderStats.total}개의 주문</p>
          </div>
        </div>

        {/* 주문 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{orderStats.total}</p>
              <p className="text-sm text-muted-foreground">전체</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.paid}</p>
              <p className="text-sm text-muted-foreground">결제완료</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{orderStats.preparing}</p>
              <p className="text-sm text-muted-foreground">준비중</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
              <p className="text-sm text-muted-foreground">배송중</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-sm text-muted-foreground">배송완료</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
              <p className="text-sm text-muted-foreground">취소</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  필터
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="주문번호 또는 상품명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      필터
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>필터</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">주문 내역이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || selectedStatus !== "all" || dateRange !== "all"
                      ? "검색 조건에 맞는 주문이 없습니다."
                      : "첫 주문을 시작해보세요!"}
                  </p>
                  <Link href="/">
                    <Button>쇼핑하러 가기</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onReorder={handleReorder} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > 10 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    이전
                  </Button>
                  <Button variant="default" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    다음
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
