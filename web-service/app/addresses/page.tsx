"use client";

import { ArrowLeft, Edit, MapPin, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthGuard } from "@/components/common/auth-guard";
import { AddressForm } from "@/components/forms/address-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

interface Address {
	id: string;
	name: string;
	phone: string;
	address: string;
	detailAddress: string;
	zipCode: string;
	isDefault: boolean;
}

export default function AddressesPage() {
	const { user } = useAuth();
	console.log(user);
	const [addresses, setAddresses] = useState<Address[]>([
		{
			id: "1",
			name: "홍길동",
			phone: "010-1234-5678",
			address: "서울특별시 강남구 테헤란로 123",
			detailAddress: "456호",
			zipCode: "12345",
			isDefault: true,
		},
		{
			id: "2",
			name: "김철수",
			phone: "010-9876-5432",
			address: "서울특별시 서초구 서초대로 789",
			detailAddress: "101동 202호",
			zipCode: "67890",
			isDefault: false,
		},
	]);

	const [showForm, setShowForm] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

	const handleAddAddress = (address: Address) => {
		const newAddress = {
			...address,
			id: Date.now().toString(),
		};

		// 기본 배송지로 설정하는 경우 다른 주소들의 기본 설정 해제
		if (address.isDefault) {
			setAddresses((prev) =>
				prev.map((addr) => ({ ...addr, isDefault: false })).concat(newAddress),
			);
		} else {
			setAddresses((prev) => [...prev, newAddress]);
		}

		setShowForm(false);
	};

	const handleEditAddress = (address: Address) => {
		// 기본 배송지로 설정하는 경우 다른 주소들의 기본 설정 해제
		if (address.isDefault) {
			setAddresses((prev) =>
				prev.map((addr) =>
					addr.id === address.id ? address : { ...addr, isDefault: false },
				),
			);
		} else {
			setAddresses((prev) =>
				prev.map((addr) => (addr.id === address.id ? address : addr)),
			);
		}

		setEditingAddress(null);
		setShowForm(false);
	};

	const handleDeleteAddress = (id: string) => {
		setAddresses((prev) => prev.filter((addr) => addr.id !== id));
		setDeleteTarget(null);
	};

	const handleSetDefault = (id: string) => {
		setAddresses((prev) =>
			prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
		);
	};

	const handleEditClick = (address: Address) => {
		setEditingAddress(address);
		setShowForm(true);
	};

	const handleCancelForm = () => {
		setShowForm(false);
		setEditingAddress(null);
	};

	if (showForm) {
		return (
			<AuthGuard>
				<div className="min-h-screen bg-background">
					<div className="container px-4 py-8">
						<div className="max-w-2xl mx-auto">
							<div className="flex items-center gap-4 mb-8">
								<Button variant="ghost" size="icon" onClick={handleCancelForm}>
									<ArrowLeft className="h-4 w-4" />
								</Button>
								<div>
									<h1 className="text-2xl font-bold">
										{editingAddress ? "배송지 수정" : "새 배송지 추가"}
									</h1>
								</div>
							</div>

							<AddressForm
								address={editingAddress || undefined}
								onSubmit={(address) => {
									if (editingAddress) {
										handleEditAddress(address);
									} else {
										handleAddAddress(address);
									}
								}}
								onCancel={handleCancelForm}
							/>
						</div>
					</div>
				</div>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard>
			<div className="min-h-screen bg-background">
				<div className="container px-4 py-8">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<Link href="/profile">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div className="flex-1">
							<h1 className="text-2xl font-bold">배송지 관리</h1>
							<p className="text-muted-foreground">
								배송지를 추가하고 관리하세요
							</p>
						</div>
						<Button onClick={() => setShowForm(true)}>
							<Plus className="h-4 w-4 mr-2" />새 배송지 추가
						</Button>
					</div>

					{/* Address List */}
					<div className="space-y-4">
						{addresses.length === 0 ? (
							<Card>
								<CardContent className="p-12 text-center">
									<MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
									<h3 className="text-lg font-medium mb-2">
										등록된 배송지가 없습니다
									</h3>
									<p className="text-muted-foreground mb-6">
										새 배송지를 추가해보세요
									</p>
									<Button onClick={() => setShowForm(true)}>
										<Plus className="h-4 w-4 mr-2" />
										배송지 추가
									</Button>
								</CardContent>
							</Card>
						) : (
							addresses.map((address) => (
								<Card key={address.id} className="relative">
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="font-medium">{address.name}</h3>
													{address.isDefault && (
														<Badge variant="default" className="text-xs">
															<Star className="h-3 w-3 mr-1" />
															기본 배송지
														</Badge>
													)}
												</div>
												<p className="text-sm text-muted-foreground mb-1">
													{address.phone}
												</p>
												<p className="text-sm">
													({address.zipCode}) {address.address}
												</p>
												{address.detailAddress && (
													<p className="text-sm">{address.detailAddress}</p>
												)}
											</div>

											<div className="flex items-center gap-2">
												{!address.isDefault && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleSetDefault(address.id)}
													>
														기본 설정
													</Button>
												)}
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleEditClick(address)}
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => setDeleteTarget(address.id)}
													disabled={address.isDefault}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>

					{/* 안내 메시지 */}
					<div className="mt-8 p-4 bg-muted/50 rounded-lg">
						<h4 className="font-medium mb-2">배송지 관리 안내</h4>
						<ul className="text-sm text-muted-foreground space-y-1">
							<li>• 기본 배송지는 주문 시 자동으로 선택됩니다</li>
							<li>• 기본 배송지는 삭제할 수 없습니다</li>
							<li>• 최대 10개까지 배송지를 등록할 수 있습니다</li>
						</ul>
					</div>
				</div>

				{/* Delete Confirmation Dialog */}
				<AlertDialog
					open={!!deleteTarget}
					onOpenChange={() => setDeleteTarget(null)}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>배송지를 삭제하시겠습니까?</AlertDialogTitle>
							<AlertDialogDescription>
								삭제된 배송지는 복구할 수 없습니다.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>취소</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									deleteTarget && handleDeleteAddress(deleteTarget)
								}
								className="bg-red-600 hover:bg-red-700"
							>
								삭제
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</AuthGuard>
	);
}
