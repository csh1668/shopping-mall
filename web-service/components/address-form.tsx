"use client";

import { MapPin, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
	id: string;
	name: string;
	phone: string;
	address: string;
	detailAddress: string;
	zipCode: string;
	isDefault: boolean;
}

interface AddressFormProps {
	address?: Address;
	onSubmit: (address: Address) => void;
	onCancel: () => void;
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
	const [formData, setFormData] = useState<Address>({
		id: address?.id || "",
		name: address?.name || "",
		phone: address?.phone || "",
		address: address?.address || "",
		detailAddress: address?.detailAddress || "",
		zipCode: address?.zipCode || "",
		isDefault: address?.isDefault || false,
	});

	const [errors, setErrors] = useState<Partial<Address>>({});

	const validateForm = () => {
		const newErrors: Partial<Address> = {};

		if (!formData.name.trim()) newErrors.name = "이름을 입력해주세요";
		if (!formData.phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
		if (!formData.address.trim()) newErrors.address = "주소를 입력해주세요";
		if (!formData.zipCode.trim()) newErrors.zipCode = "우편번호를 입력해주세요";

		// 전화번호 형식 검증
		const phoneRegex = /^[0-9-]+$/;
		if (formData.phone && !phoneRegex.test(formData.phone)) {
			newErrors.phone = "올바른 전화번호 형식을 입력해주세요";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	const handleAddressSearch = () => {
		// 실제로는 다음 우편번호 API 등을 사용
		alert("주소 검색 기능은 실제 서비스에서 구현됩니다.");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MapPin className="h-5 w-5" />
					{address ? "배송지 수정" : "새 배송지 추가"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="name">받는 분 이름 *</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-red-500 mt-1">{errors.name}</p>
							)}
						</div>

						<div>
							<Label htmlFor="phone">전화번호 *</Label>
							<Input
								id="phone"
								placeholder="010-1234-5678"
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								className={errors.phone ? "border-red-500" : ""}
							/>
							{errors.phone && (
								<p className="text-sm text-red-500 mt-1">{errors.phone}</p>
							)}
						</div>
					</div>

					<div>
						<Label htmlFor="zipCode">우편번호 *</Label>
						<div className="flex gap-2">
							<Input
								id="zipCode"
								placeholder="12345"
								value={formData.zipCode}
								onChange={(e) =>
									setFormData({ ...formData, zipCode: e.target.value })
								}
								className={errors.zipCode ? "border-red-500" : ""}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleAddressSearch}
							>
								<Search className="h-4 w-4 mr-2" />
								검색
							</Button>
						</div>
						{errors.zipCode && (
							<p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>
						)}
					</div>

					<div>
						<Label htmlFor="address">주소 *</Label>
						<Input
							id="address"
							placeholder="기본 주소를 입력해주세요"
							value={formData.address}
							onChange={(e) =>
								setFormData({ ...formData, address: e.target.value })
							}
							className={errors.address ? "border-red-500" : ""}
						/>
						{errors.address && (
							<p className="text-sm text-red-500 mt-1">{errors.address}</p>
						)}
					</div>

					<div>
						<Label htmlFor="detailAddress">상세 주소</Label>
						<Input
							id="detailAddress"
							placeholder="상세 주소를 입력해주세요"
							value={formData.detailAddress}
							onChange={(e) =>
								setFormData({ ...formData, detailAddress: e.target.value })
							}
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="isDefault"
							checked={formData.isDefault}
							onCheckedChange={(checked) =>
								setFormData({ ...formData, isDefault: checked as boolean })
							}
						/>
						<Label htmlFor="isDefault" className="text-sm cursor-pointer">
							기본 배송지로 설정
						</Label>
					</div>

					<div className="flex gap-2 pt-4">
						<Button type="submit" className="flex-1">
							{address ? "수정하기" : "추가하기"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="flex-1 bg-transparent"
						>
							취소
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
