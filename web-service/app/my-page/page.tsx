"use client";

import {
	ArrowLeft,
	Bell,
	CreditCard,
	Heart,
	HelpCircle,
	LogOut,
	MapPin,
	Package,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/server/client";
import { useAuthStore } from "@/stores/auth-store";

export default function MyPage() {
	const { user, signOut } = useAuthStore();
	const { data: metadata } = trpc.user.getUserMetadata.useQuery(undefined, {
		enabled: !!user,
	});

	const handleSignOut = async () => {
		await signOut();
	};

	if (!user || !metadata) {
		return null;
	}

	const menuItems = [
		{
			title: "주문 관리",
			items: [
				{
					name: "주문 내역",
					href: "/orders",
					icon: Package,
					description: "주문한 상품들을 확인하세요",
				},
				{
					name: "배송 추적",
					href: "/tracking",
					icon: Package,
					description: "배송 현황을 실시간으로 확인",
				},
			],
		},
		{
			title: "계정 관리",
			items: [
				{
					name: "프로필 수정",
					href: "/profile",
					icon: User,
					description: "개인정보를 수정하세요",
				},
				{
					name: "배송지 관리",
					href: "/addresses",
					icon: MapPin,
					description: "배송지를 추가하고 관리하세요",
				},
				{
					name: "결제 수단",
					href: "/payment-methods",
					icon: CreditCard,
					description: "결제 수단을 관리하세요",
				},
			],
		},
		{
			title: "쇼핑 관리",
			items: [
				{
					name: "찜한 상품",
					href: "/wishlist",
					icon: Heart,
					description: "관심 있는 상품들을 모아보세요",
				},
				{
					name: "쿠폰함",
					href: "/coupons",
					icon: Package,
					description: "사용 가능한 쿠폰을 확인하세요",
				},
			],
		},
		{
			title: "설정 및 지원",
			items: [
				{
					name: "알림 설정",
					href: "/notifications",
					icon: Bell,
					description: "알림 설정을 관리하세요",
				},
				{
					name: "고객 지원",
					href: "/support",
					icon: HelpCircle,
					description: "도움이 필요하시면 문의하세요",
				},
				{
					name: "설정",
					href: "/settings",
					icon: Settings,
					description: "앱 설정을 변경하세요",
				},
			],
		},
	];

	const orderStats = {
		total: 12,
		preparing: 2,
		shipped: 1,
		delivered: 9,
	};

	return (
		<AuthGuard>
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
							<h1 className="text-2xl font-bold">마이페이지</h1>
							<p className="text-muted-foreground">
								계정 정보와 주문을 관리하세요
							</p>
						</div>
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						{/* Profile Section */}
						<div className="lg:col-span-1">
							<Card>
								<CardContent className="p-6">
									<div className="text-center">
										<Avatar className="h-20 w-20 mx-auto mb-4">
											{/* <AvatarImage src={metadata.avatar_url || ""} alt={metadata.full_name || ""} /> */}
											<AvatarFallback className="text-lg">
												{metadata.fullName?.charAt(0) ||
													metadata.email.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<h2 className="text-xl font-bold mb-1">
											{metadata.fullName || "사용자"}
										</h2>
										<p className="text-muted-foreground mb-4">
											{metadata.email}
										</p>
										<Badge variant="secondary" className="mb-4">
											일반 회원
										</Badge>
										<Link href="/profile">
											<Button
												variant="outline"
												className="w-full bg-transparent"
											>
												프로필 수정
											</Button>
										</Link>
									</div>
								</CardContent>
							</Card>

							{/* Quick Stats */}
							<Card className="mt-6">
								<CardHeader>
									<CardTitle>주문 현황</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4">
										<div className="text-center">
											<p className="text-2xl font-bold text-primary">
												{orderStats.total}
											</p>
											<p className="text-sm text-muted-foreground">총 주문</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-blue-600">
												{orderStats.preparing}
											</p>
											<p className="text-sm text-muted-foreground">준비중</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-purple-600">
												{orderStats.shipped}
											</p>
											<p className="text-sm text-muted-foreground">배송중</p>
										</div>
										<div className="text-center">
											<p className="text-2xl font-bold text-green-600">
												{orderStats.delivered}
											</p>
											<p className="text-sm text-muted-foreground">배송완료</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Benefits */}
							<Card className="mt-6">
								<CardHeader>
									<CardTitle>혜택 정보</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between">
										<span className="text-muted-foreground">적립금</span>
										<span className="font-medium">5,000원</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">쿠폰</span>
										<span className="font-medium">3장</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">등급</span>
										<Badge variant="outline">일반</Badge>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Menu Section */}
						<div className="lg:col-span-2">
							<div className="space-y-8">
								{menuItems.map((section) => (
									<Card key={section.title}>
										<CardHeader>
											<CardTitle>{section.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="grid gap-4">
												{section.items.map((item) => (
													<Link key={item.name} href={item.href}>
														<div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
															<div className="p-2 bg-primary/10 rounded-lg">
																<item.icon className="h-5 w-5 text-primary" />
															</div>
															<div className="flex-1">
																<h3 className="font-medium">{item.name}</h3>
																<p className="text-sm text-muted-foreground">
																	{item.description}
																</p>
															</div>
															<div className="text-muted-foreground">
																<svg
																	className="h-5 w-5"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																	aria-hidden="true"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M9 5l7 7-7 7"
																	/>
																</svg>
															</div>
														</div>
													</Link>
												))}
											</div>
										</CardContent>
									</Card>
								))}

								{/* Logout Section */}
								<Card>
									<CardContent className="p-6">
										<Button
											variant="outline"
											className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
											onClick={handleSignOut}
										>
											<LogOut className="h-4 w-4 mr-2" />
											로그아웃
										</Button>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
