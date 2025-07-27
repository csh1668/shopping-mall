"use client";

import Image from "next/image";
import Link from "next/link";
import {
	LucideIcon,
	type LucideIconName,
} from "@/components/common/lucide-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 상태 정보 타입 정의
interface StatusInfo {
	label: string;
	color: string;
	icon: LucideIconName;
	variant: "default" | "secondary" | "outline";
}

// Prisma 스키마 기반 더미 배송 데이터
const deliveryHistory = [
	{
		id: 1,
		orderNumber: "ORD-2024-001",
		status: "DELIVERED" as const,
		deliveredAt: "2024-01-15",
		trackingNumber: "CJ123456789",
		address: "서울시 강남구 테헤란로 123",
		items: [
			{
				id: 1,
				name: "무선 이어폰 Pro",
				price: 89000,
				quantity: 1,
				image: "/placeholder.svg?height=60&width=60",
				brand: "SoundTech",
			},
		],
		totalAmount: 89000,
	},
	{
		id: 2,
		orderNumber: "ORD-2024-002",
		status: "SHIPPED" as const,
		shippedAt: "2024-01-16",
		trackingNumber: "CJ987654321",
		address: "서울시 강남구 테헤란로 123",
		items: [
			{
				id: 2,
				name: "스마트워치 Series X",
				price: 299000,
				quantity: 1,
				image: "/placeholder.svg?height=60&width=60",
				brand: "TechWatch",
			},
			{
				id: 3,
				name: "무선 충전패드",
				price: 45000,
				quantity: 1,
				image: "/placeholder.svg?height=60&width=60",
				brand: "ChargeTech",
			},
		],
		totalAmount: 344000,
	},
	{
		id: 3,
		orderNumber: "ORD-2024-003",
		status: "PROCESSING" as const,
		orderedAt: "2024-01-17",
		trackingNumber: null,
		address: "서울시 강남구 테헤란로 123",
		items: [
			{
				id: 4,
				name: "게이밍 키보드",
				price: 129000,
				quantity: 1,
				image: "/placeholder.svg?height=60&width=60",
				brand: "GamePro",
			},
		],
		totalAmount: 129000,
	},
];

// 사용자 통계 더미 데이터
const userStats = {
	totalOrders: 15,
	deliveredOrders: 12,
	inProgressOrders: 3,
	totalSpent: 1250000,
	savedAmount: 180000,
	wishlistCount: 8,
	reviewCount: 7,
};

const getStatusInfo = (status: string): StatusInfo => {
	switch (status) {
		case "DELIVERED":
			return {
				label: "배송완료",
				color: "bg-green-500",
				icon: "CircleCheck" as LucideIconName,
				variant: "default" as const,
			};
		case "SHIPPED":
			return {
				label: "배송중",
				color: "bg-blue-500",
				icon: "Truck" as LucideIconName,
				variant: "secondary" as const,
			};
		case "PROCESSING":
			return {
				label: "배송준비",
				color: "bg-yellow-500",
				icon: "Clock" as LucideIconName,
				variant: "outline" as const,
			};
		default:
			return {
				label: "주문접수",
				color: "bg-gray-500",
				icon: "Package" as LucideIconName,
				variant: "outline" as const,
			};
	}
};

export default function ProfilePage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="space-y-8">
				{/* 페이지 헤더 */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">마이페이지</h1>
						<p className="text-muted-foreground mt-1">
							주문 현황과 계정 정보를 관리하세요
						</p>
					</div>
				</div>

				{/* 사용자 요약 카드 */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4 text-center">
							<LucideIcon
								name="ShoppingBag"
								className="h-8 w-8 mx-auto mb-2 text-primary"
							/>
							<div className="text-2xl font-bold">{userStats.totalOrders}</div>
							<div className="text-sm text-muted-foreground">총 주문</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 text-center">
							<LucideIcon
								name="CircleCheck"
								className="h-8 w-8 mx-auto mb-2 text-green-500"
							/>
							<div className="text-2xl font-bold">
								{userStats.deliveredOrders}
							</div>
							<div className="text-sm text-muted-foreground">배송완료</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 text-center">
							<LucideIcon
								name="Truck"
								className="h-8 w-8 mx-auto mb-2 text-blue-500"
							/>
							<div className="text-2xl font-bold">
								{userStats.inProgressOrders}
							</div>
							<div className="text-sm text-muted-foreground">진행중</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4 text-center">
							<LucideIcon
								name="CreditCard"
								className="h-8 w-8 mx-auto mb-2 text-purple-500"
							/>
							<div className="text-2xl font-bold">
								{(userStats.totalSpent / 10000).toFixed(0)}만원
							</div>
							<div className="text-sm text-muted-foreground">총 구매액</div>
						</CardContent>
					</Card>
				</div>

				{/* 탭 메뉴 */}
				<Tabs defaultValue="dashboard" className="space-y-6">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="dashboard" className="flex items-center gap-2">
							<LucideIcon name="Package" className="h-4 w-4" />
							<span className="hidden sm:inline">대시보드</span>
						</TabsTrigger>
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<LucideIcon name="User" className="h-4 w-4" />
							<span className="hidden sm:inline">프로필</span>
						</TabsTrigger>
						<TabsTrigger value="orders" className="flex items-center gap-2">
							<LucideIcon name="ShoppingBag" className="h-4 w-4" />
							<span className="hidden sm:inline">주문내역</span>
						</TabsTrigger>
						<TabsTrigger value="wishlist" className="flex items-center gap-2">
							<LucideIcon name="Heart" className="h-4 w-4" />
							<span className="hidden sm:inline">찜한상품</span>
						</TabsTrigger>
						<TabsTrigger value="settings" className="flex items-center gap-2">
							<LucideIcon name="Settings" className="h-4 w-4" />
							<span className="hidden sm:inline">설정</span>
						</TabsTrigger>
					</TabsList>

					{/* 대시보드 탭 */}
					<TabsContent value="dashboard" className="space-y-6">
						{/* 최근 배송 내역 */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<LucideIcon name="Truck" className="h-5 w-5" />
									최근 배송 내역
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{deliveryHistory.map((order) => {
									const statusInfo = getStatusInfo(order.status);
									const StatusIcon = statusInfo.icon;

									return (
										<div
											key={order.id}
											className="border rounded-lg p-4 space-y-3"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div
														className={`w-3 h-3 rounded-full ${statusInfo.color}`}
													/>
													<div>
														<div className="font-medium">
															{order.orderNumber}
														</div>
														<div className="text-sm text-muted-foreground">
															{order.status === "DELIVERED" &&
																order.deliveredAt &&
																`${order.deliveredAt} 배송완료`}
															{order.status === "SHIPPED" &&
																order.shippedAt &&
																`${order.shippedAt} 배송시작`}
															{order.status === "PROCESSING" &&
																order.orderedAt &&
																`${order.orderedAt} 주문접수`}
														</div>
													</div>
												</div>
												<Badge variant={statusInfo.variant}>
													<LucideIcon
														name={statusInfo.icon}
														className="h-3 w-3 mr-1"
													/>
													{statusInfo.label}
												</Badge>
											</div>

											<div className="flex items-center gap-2 text-sm text-muted-foreground">
												<LucideIcon name={StatusIcon} className="h-4 w-4" />
												<span>{order.address}</span>
											</div>

											{order.trackingNumber && (
												<div className="text-sm">
													<span className="text-muted-foreground">
														송장번호:{" "}
													</span>
													<span className="font-mono">
														{order.trackingNumber}
													</span>
												</div>
											)}

											<div className="flex items-center gap-4">
												{order.items.slice(0, 3).map((item) => (
													<div
														key={item.id}
														className="flex items-center gap-2"
													>
														<Image
															src={item.image || "/placeholder.svg"}
															alt={item.name}
															width={40}
															height={40}
															className="rounded object-cover"
														/>
														<div className="text-sm">
															<div className="font-medium line-clamp-1">
																{item.name}
															</div>
															<div className="text-muted-foreground">
																{item.quantity}개 ·{" "}
																{item.price.toLocaleString()}원
															</div>
														</div>
													</div>
												))}
												{order.items.length > 3 && (
													<div className="text-sm text-muted-foreground">
														외 {order.items.length - 3}개
													</div>
												)}
											</div>

											<Separator />

											<div className="flex items-center justify-between">
												<div className="font-medium">
													총 {order.totalAmount.toLocaleString()}원
												</div>
												<div className="flex gap-2">
													{order.trackingNumber && (
														<Button variant="outline" size="sm">
															배송추적
														</Button>
													)}
													<Button variant="outline" size="sm">
														주문상세
													</Button>
												</div>
											</div>
										</div>
									);
								})}

								<div className="text-center pt-4">
									<Link href="/orders">
										<Button variant="outline">전체 주문 내역 보기</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 프로필 설정 탭 */}
					<TabsContent value="profile">
						<Card>
							<CardHeader>
								<CardTitle>프로필 설정</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8 text-muted-foreground">
									프로필 설정 기능은 준비 중입니다.
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 주문 내역 탭 */}
					<TabsContent value="orders">
						<Card>
							<CardHeader>
								<CardTitle>주문 내역</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<LucideIcon
										name="ShoppingBag"
										className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
									/>
									<p className="text-muted-foreground mb-4">
										전체 주문 내역을 확인하세요
									</p>
									<Link href="/orders">
										<Button>주문 내역 보기</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 찜한 상품 탭 */}
					<TabsContent value="wishlist">
						<Card>
							<CardHeader>
								<CardTitle>찜한 상품</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<LucideIcon
										name="Heart"
										className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
									/>
									<p className="text-muted-foreground mb-4">
										관심 있는 상품을 저장하고 관리하세요
									</p>
									<Link href="/wishlist">
										<Button>찜한 상품 보기</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* 설정 탭 */}
					<TabsContent value="settings">
						<Card>
							<CardHeader>
								<CardTitle>계정 설정</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-center py-8">
									<LucideIcon
										name="Settings"
										className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
									/>
									<p className="text-muted-foreground mb-4">
										계정 설정을 관리하세요
									</p>
									<Link href="/settings">
										<Button>설정 페이지로 이동</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
