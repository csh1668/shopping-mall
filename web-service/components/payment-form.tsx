// "use client";

// import { Building2, CreditCard, Smartphone } from "lucide-react";
// import type React from "react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import type { PaymentInfo } from "@/lib/stores/order-store";

// interface PaymentFormProps {
// 	onSubmit: (data: PaymentInfo) => void;
// 	amount: number;
// }

// export function PaymentForm({ onSubmit, amount }: PaymentFormProps) {
// 	const [paymentMethod, setPaymentMethod] =
// 		useState<PaymentInfo["method"]>("card");
// 	const [formData, setFormData] = useState<PaymentInfo>({
// 		method: "card",
// 		cardNumber: "",
// 		expiryDate: "",
// 		cvc: "",
// 		cardholderName: "",
// 		bankName: "",
// 		accountNumber: "",
// 	});

// 	const [errors, setErrors] = useState<Partial<PaymentInfo>>({});

// 	const validateForm = () => {
// 		const newErrors: Partial<PaymentInfo> = {};

// 		if (paymentMethod === "card") {
// 			if (!formData.cardNumber?.trim())
// 				newErrors.cardNumber = "카드번호를 입력해주세요";
// 			if (!formData.expiryDate?.trim())
// 				newErrors.expiryDate = "유효기간을 입력해주세요";
// 			if (!formData.cvc?.trim()) newErrors.cvc = "CVC를 입력해주세요";
// 			if (!formData.cardholderName?.trim())
// 				newErrors.cardholderName = "카드소유자명을 입력해주세요";

// 			// 카드번호 형식 검증 (16자리)
// 			if (
// 				formData.cardNumber &&
// 				formData.cardNumber.replace(/\s/g, "").length !== 16
// 			) {
// 				newErrors.cardNumber = "올바른 카드번호를 입력해주세요";
// 			}

// 			// 유효기간 형식 검증 (MM/YY)
// 			if (formData.expiryDate && !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
// 				newErrors.expiryDate = "MM/YY 형식으로 입력해주세요";
// 			}

// 			// CVC 형식 검증 (3-4자리)
// 			if (
// 				formData.cvc &&
// 				(formData.cvc.length < 3 || formData.cvc.length > 4)
// 			) {
// 				newErrors.cvc = "3-4자리 숫자를 입력해주세요";
// 			}
// 		} else if (paymentMethod === "bank") {
// 			if (!formData.bankName?.trim())
// 				newErrors.bankName = "은행명을 입력해주세요";
// 			if (!formData.accountNumber?.trim())
// 				newErrors.accountNumber = "계좌번호를 입력해주세요";
// 		}

// 		setErrors(newErrors);
// 		return Object.keys(newErrors).length === 0;
// 	};

// 	const handleSubmit = (e: React.FormEvent) => {
// 		e.preventDefault();
// 		if (validateForm()) {
// 			onSubmit({ ...formData, method: paymentMethod });
// 		}
// 	};

// 	const formatCardNumber = (value: string) => {
// 		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
// 		const matches = v.match(/\d{4,16}/g);
// 		const match = matches?.[0] || "";
// 		const parts = [];

// 		for (let i = 0, len = match.length; i < len; i += 4) {
// 			parts.push(match.substring(i, i + 4));
// 		}

// 		if (parts.length) {
// 			return parts.join(" ");
// 		} else {
// 			return v;
// 		}
// 	};

// 	const formatExpiryDate = (value: string) => {
// 		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
// 		if (v.length >= 2) {
// 			return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
// 		}
// 		return v;
// 	};

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle className="flex items-center gap-2">
// 					<CreditCard className="h-5 w-5" />
// 					결제 정보
// 				</CardTitle>
// 			</CardHeader>
// 			<CardContent>
// 				<form onSubmit={handleSubmit} className="space-y-6">
// 					{/* 결제 수단 선택 */}
// 					<div>
// 						<Label className="text-base font-medium">결제 수단</Label>
// 						<RadioGroup
// 							value={paymentMethod}
// 							onValueChange={(value) =>
// 								setPaymentMethod(value as PaymentInfo["method"])
// 							}
// 						>
// 							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
// 								<div className="flex items-center space-x-2 border rounded-lg p-3">
// 									<RadioGroupItem value="card" id="card" />
// 									<Label
// 										htmlFor="card"
// 										className="flex items-center gap-2 cursor-pointer"
// 									>
// 										<CreditCard className="h-4 w-4" />
// 										신용카드
// 									</Label>
// 								</div>
// 								<div className="flex items-center space-x-2 border rounded-lg p-3">
// 									<RadioGroupItem value="bank" id="bank" />
// 									<Label
// 										htmlFor="bank"
// 										className="flex items-center gap-2 cursor-pointer"
// 									>
// 										<Building2 className="h-4 w-4" />
// 										계좌이체
// 									</Label>
// 								</div>
// 								<div className="flex items-center space-x-2 border rounded-lg p-3">
// 									<RadioGroupItem value="kakao" id="kakao" />
// 									<Label
// 										htmlFor="kakao"
// 										className="flex items-center gap-2 cursor-pointer"
// 									>
// 										<Smartphone className="h-4 w-4" />
// 										카카오페이
// 									</Label>
// 								</div>
// 								<div className="flex items-center space-x-2 border rounded-lg p-3">
// 									<RadioGroupItem value="naver" id="naver" />
// 									<Label
// 										htmlFor="naver"
// 										className="flex items-center gap-2 cursor-pointer"
// 									>
// 										<Smartphone className="h-4 w-4" />
// 										네이버페이
// 									</Label>
// 								</div>
// 							</div>
// 						</RadioGroup>
// 					</div>

// 					{/* 신용카드 정보 */}
// 					{paymentMethod === "card" && (
// 						<div className="space-y-4">
// 							<div>
// 								<Label htmlFor="cardNumber">카드번호 *</Label>
// 								<Input
// 									id="cardNumber"
// 									placeholder="1234 5678 9012 3456"
// 									value={formData.cardNumber}
// 									onChange={(e) =>
// 										setFormData({
// 											...formData,
// 											cardNumber: formatCardNumber(e.target.value),
// 										})
// 									}
// 									maxLength={19}
// 									className={errors.cardNumber ? "border-red-500" : ""}
// 								/>
// 								{errors.cardNumber && (
// 									<p className="text-sm text-red-500 mt-1">
// 										{errors.cardNumber}
// 									</p>
// 								)}
// 							</div>

// 							<div className="grid grid-cols-2 gap-4">
// 								<div>
// 									<Label htmlFor="expiryDate">유효기간 *</Label>
// 									<Input
// 										id="expiryDate"
// 										placeholder="MM/YY"
// 										value={formData.expiryDate}
// 										onChange={(e) =>
// 											setFormData({
// 												...formData,
// 												expiryDate: formatExpiryDate(e.target.value),
// 											})
// 										}
// 										maxLength={5}
// 										className={errors.expiryDate ? "border-red-500" : ""}
// 									/>
// 									{errors.expiryDate && (
// 										<p className="text-sm text-red-500 mt-1">
// 											{errors.expiryDate}
// 										</p>
// 									)}
// 								</div>

// 								<div>
// 									<Label htmlFor="cvc">CVC *</Label>
// 									<Input
// 										id="cvc"
// 										placeholder="123"
// 										value={formData.cvc}
// 										onChange={(e) =>
// 											setFormData({
// 												...formData,
// 												cvc: e.target.value.replace(/\D/g, ""),
// 											})
// 										}
// 										maxLength={4}
// 										className={errors.cvc ? "border-red-500" : ""}
// 									/>
// 									{errors.cvc && (
// 										<p className="text-sm text-red-500 mt-1">{errors.cvc}</p>
// 									)}
// 								</div>
// 							</div>

// 							<div>
// 								<Label htmlFor="cardholderName">카드소유자명 *</Label>
// 								<Input
// 									id="cardholderName"
// 									placeholder="홍길동"
// 									value={formData.cardholderName}
// 									onChange={(e) =>
// 										setFormData({ ...formData, cardholderName: e.target.value })
// 									}
// 									className={errors.cardholderName ? "border-red-500" : ""}
// 								/>
// 								{errors.cardholderName && (
// 									<p className="text-sm text-red-500 mt-1">
// 										{errors.cardholderName}
// 									</p>
// 								)}
// 							</div>
// 						</div>
// 					)}

// 					{/* 계좌이체 정보 */}
// 					{paymentMethod === "bank" && (
// 						<div className="space-y-4">
// 							<div>
// 								<Label htmlFor="bankName">은행명 *</Label>
// 								<Input
// 									id="bankName"
// 									placeholder="국민은행"
// 									value={formData.bankName}
// 									onChange={(e) =>
// 										setFormData({ ...formData, bankName: e.target.value })
// 									}
// 									className={errors.bankName ? "border-red-500" : ""}
// 								/>
// 								{errors.bankName && (
// 									<p className="text-sm text-red-500 mt-1">{errors.bankName}</p>
// 								)}
// 							</div>

// 							<div>
// 								<Label htmlFor="accountNumber">계좌번호 *</Label>
// 								<Input
// 									id="accountNumber"
// 									placeholder="123-456-789012"
// 									value={formData.accountNumber}
// 									onChange={(e) =>
// 										setFormData({ ...formData, accountNumber: e.target.value })
// 									}
// 									className={errors.accountNumber ? "border-red-500" : ""}
// 								/>
// 								{errors.accountNumber && (
// 									<p className="text-sm text-red-500 mt-1">
// 										{errors.accountNumber}
// 									</p>
// 								)}
// 							</div>
// 						</div>
// 					)}

// 					{/* 간편결제 안내 */}
// 					{(paymentMethod === "kakao" || paymentMethod === "naver") && (
// 						<div className="bg-muted p-4 rounded-lg">
// 							<p className="text-sm text-muted-foreground">
// 								{paymentMethod === "kakao" ? "카카오페이" : "네이버페이"} 결제
// 								창이 새로 열립니다.
// 								<br />
// 								결제를 완료하려면{" "}
// 								{paymentMethod === "kakao" ? "카카오톡" : "네이버"} 앱에서
// 								인증을 진행해주세요.
// 							</p>
// 						</div>
// 					)}

// 					{/* 결제 금액 */}
// 					<div className="bg-primary/5 p-4 rounded-lg">
// 						<div className="flex justify-between items-center">
// 							<span className="text-lg font-medium">결제 금액</span>
// 							<span className="text-2xl font-bold text-primary">
// 								{amount.toLocaleString()}원
// 							</span>
// 						</div>
// 					</div>

// 					<Button type="submit" className="w-full" size="lg">
// 						{amount.toLocaleString()}원 결제하기
// 					</Button>
// 				</form>
// 			</CardContent>
// 		</Card>
// 	);
// }
