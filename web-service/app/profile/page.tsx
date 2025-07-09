"use client";

import {
	ArrowLeft,
	Camera,
	Heart,
	Mail,
	MapPin,
	Package,
	Phone,
	Save,
	User,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/client";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfilePage() {
	const { user } = useAuthStore();

	const { data: metadata, isLoading } = trpc.user.getUserMetadata.useQuery(
		undefined,
		{ enabled: !!user },
	);

	const updateMutation = trpc.user.updateUserMetadata.useMutation({
		onSuccess: () => {
			setMessage("프로필이 성공적으로 업데이트되었습니다.");
			// tRPC가 자동으로 캐시를 무효화하여 최신 데이터를 가져옴
		},
		onError: (error) => {
			setMessage(`프로필 업데이트에 실패했습니다: ${error.message}`);
		},
	});

	const [formData, setFormData] = useState({
		fullName: "",
		phone: "",
	});
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (metadata) {
			setFormData({
				fullName: metadata.fullName || "",
				phone: metadata.phone || "",
			});
		}
	}, [metadata]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");

		await updateMutation.mutateAsync({
			fullName: formData.fullName,
			phone: formData.phone,
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	if (!user) {
		return null;
	}

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
							<h1 className="text-2xl font-bold">프로필</h1>
							<p className="text-muted-foreground">개인정보를 관리하세요</p>
						</div>
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						{/* Profile Info */}
						<div className="lg:col-span-2">
							<Card>
								<CardHeader>
									<CardTitle>기본 정보</CardTitle>
									<CardDescription>
										프로필 정보를 수정할 수 있습니다
									</CardDescription>
								</CardHeader>
								<CardContent>
									{isLoading ? (
										<div className="space-y-6">
											<Skeleton className="h-20 w-20 rounded-full" />
											<div className="space-y-4">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-10 w-full" />
											</div>
											<div className="space-y-4">
												<Skeleton className="h-4 w-24" />
												<Skeleton className="h-10 w-full" />
											</div>
										</div>
									) : (
										<form onSubmit={handleSubmit} className="space-y-6">
											{message && (
												<Alert>
													<AlertDescription>{message}</AlertDescription>
												</Alert>
											)}

											{/* Avatar */}
											<div className="flex items-center gap-4">
												<Avatar className="h-20 w-20">
													<AvatarFallback className="text-lg">
														{metadata?.fullName?.charAt(0) ||
															metadata?.email.charAt(0).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<Button variant="outline" size="sm" disabled>
														<Camera className="h-4 w-4 mr-2" />
														사진 변경
													</Button>
													<p className="text-xs text-muted-foreground mt-1">
														JPG, PNG 파일만 업로드 가능합니다
													</p>
												</div>
											</div>

											<Separator />

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="fullName">이름</Label>
													<div className="relative">
														<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
														<Input
															id="fullName"
															name="fullName"
															value={formData.fullName}
															onChange={handleChange}
															className="pl-10"
															placeholder="이름을 입력하세요"
														/>
													</div>
												</div>

												<div className="space-y-2">
													<Label htmlFor="email">이메일</Label>
													<div className="relative">
														<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
														<Input
															id="email"
															value={metadata?.email || ""}
															className="pl-10"
															disabled
														/>
													</div>
													<p className="text-xs text-muted-foreground">
														이메일은 변경할 수 없습니다
													</p>
												</div>

												<div className="space-y-2">
													<Label htmlFor="phone">전화번호</Label>
													<div className="relative">
														<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
														<Input
															id="phone"
															name="phone"
															value={formData.phone}
															onChange={handleChange}
															className="pl-10"
															placeholder="010-1234-5678"
														/>
													</div>
												</div>
											</div>

											<Button type="submit" disabled={updateMutation.isPending}>
												<Save className="h-4 w-4 mr-2" />
												{updateMutation.isPending
													? "저장 중..."
													: "변경사항 저장"}
											</Button>
										</form>
									)}
								</CardContent>
							</Card>

							{/* Password Change */}
							<Card className="mt-6">
								<CardHeader>
									<CardTitle>비밀번호 변경</CardTitle>
									<CardDescription>
										보안을 위해 정기적으로 비밀번호를 변경하세요
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Button variant="outline" disabled>
										비밀번호 변경
									</Button>
									<p className="text-sm text-muted-foreground mt-2">
										비밀번호 변경 기능은 곧 제공될 예정입니다
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Quick Links */}
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>빠른 메뉴</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Link href="/orders">
										<Button
											variant="outline"
											className="w-full justify-start bg-transparent"
										>
											<Package className="h-4 w-4 mr-2" />
											주문 내역
										</Button>
									</Link>
									<Link href="/wishlist">
										<Button
											variant="outline"
											className="w-full justify-start bg-transparent"
										>
											<Heart className="h-4 w-4 mr-2" />
											찜한 상품
										</Button>
									</Link>
									<Link href="/addresses">
										<Button
											variant="outline"
											className="w-full justify-start bg-transparent"
										>
											<MapPin className="h-4 w-4 mr-2" />
											배송지 관리
										</Button>
									</Link>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>계정 통계</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between">
										<span className="text-muted-foreground">총 주문 수</span>
										<span className="font-medium">0건</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">총 구매 금액</span>
										<span className="font-medium">0원</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">적립금</span>
										<span className="font-medium">0원</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">쿠폰</span>
										<span className="font-medium">0장</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
