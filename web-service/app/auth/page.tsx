"use client";

import { Check, Lock, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SocialButton } from "@/components/ui/social-button";
import { useAuthStore } from "@/stores/auth-store";
import { createLogger } from "@/utils/logger";

const logger = createLogger("AuthPage");

export default function AuthPage() {
	const router = useRouter();
	const { signInWithProvider } = useAuthStore();

	const [mode, setMode] = useState<"login" | "signup">("login");
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
		phone: "",
		agreeTerms: false,
		agreePrivacy: false,
		agreeMarketing: false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.email) {
			newErrors.email = "이메일을 입력해주세요";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "올바른 이메일 형식이 아닙니다";
		}

		if (!formData.password) {
			newErrors.password = "비밀번호를 입력해주세요";
		} else if (formData.password.length < 8) {
			newErrors.password = "비밀번호는 8자 이상이어야 합니다";
		}

		if (mode === "signup") {
			if (!formData.fullName) {
				newErrors.fullName = "이름을 입력해주세요";
			}

			if (!formData.confirmPassword) {
				newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
			} else if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
			}

			if (!formData.agreeTerms) {
				newErrors.agreeTerms = "이용약관에 동의해주세요";
			}

			if (!formData.agreePrivacy) {
				newErrors.agreePrivacy = "개인정보처리방침에 동의해주세요";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			if (mode === "login") {
				// TODO: signIn
				router.push("/");
			} else {
				// TODO: signUp
				setShowSuccess(true);
			}
		} catch (_error) {
			setErrors({
				submit:
					mode === "login"
						? "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요."
						: "회원가입에 실패했습니다. 다시 시도해주세요.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const toggleMode = () => {
		setMode(mode === "login" ? "signup" : "login");
		setErrors({});
		setFormData({
			email: "",
			password: "",
			confirmPassword: "",
			fullName: "",
			phone: "",
			agreeTerms: false,
			agreePrivacy: false,
			agreeMarketing: false,
		});
	};

	if (showSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
								<Check className="w-8 h-8 text-green-600" />
							</div>
							<div>
								<h2 className="text-xl font-semibold mb-2">회원가입 완료!</h2>
								<p className="text-muted-foreground">
									환영합니다! 이제 ShopMall의 모든 서비스를 이용하실 수
									있습니다.
								</p>
							</div>
							<Button onClick={() => router.push("/")} className="w-full">
								쇼핑 시작하기
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						{mode === "login" ? "로그인" : "회원가입"}
					</CardTitle>
					<CardDescription className="text-center">
						{mode === "login"
							? "ShopMall 계정으로 로그인하세요"
							: "ShopMall에 오신 것을 환영합니다"}
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* 소셜 로그인 */}
					<div className="space-y-3">
						<SocialButton
							provider="google"
							onClick={() => signInWithProvider("google")}
						>
							Google로 {mode === "login" ? "로그인" : "회원가입"}
						</SocialButton>
						<SocialButton
							provider="kakao"
							onClick={() => signInWithProvider("kakao")}
						>
							카카오로 {mode === "login" ? "로그인" : "회원가입"}
						</SocialButton>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								또는
							</span>
						</div>
					</div>

					{/* 폼 */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{mode === "signup" && (
							<FormField
								label="이름"
								icon={<User className="h-4 w-4" />}
								value={formData.fullName}
								onChange={(e) => handleInputChange("fullName", e.target.value)}
								error={errors.fullName}
								placeholder="홍길동"
							/>
						)}

						<FormField
							label="이메일"
							type="email"
							icon={<Mail className="h-4 w-4" />}
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							error={errors.email}
							placeholder="example@email.com"
						/>

						{mode === "signup" && (
							<FormField
								label="휴대폰 번호 (선택)"
								type="tel"
								icon={<Phone className="h-4 w-4" />}
								value={formData.phone}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								placeholder="010-1234-5678"
							/>
						)}

						<FormField
							label="비밀번호"
							icon={<Lock className="h-4 w-4" />}
							showPasswordToggle
							value={formData.password}
							onChange={(e) => handleInputChange("password", e.target.value)}
							error={errors.password}
							placeholder="8자 이상 입력해주세요"
						/>

						{mode === "signup" && (
							<FormField
								label="비밀번호 확인"
								icon={<Lock className="h-4 w-4" />}
								showPasswordToggle
								value={formData.confirmPassword}
								onChange={(e) =>
									handleInputChange("confirmPassword", e.target.value)
								}
								error={errors.confirmPassword}
								placeholder="비밀번호를 다시 입력해주세요"
							/>
						)}

						{mode === "signup" && (
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Checkbox
										id="terms"
										checked={formData.agreeTerms}
										onCheckedChange={(checked) =>
											handleInputChange("agreeTerms", checked as boolean)
										}
									/>
									<label
										htmlFor="terms"
										className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										<span className="text-destructive">*</span> 이용약관에
										동의합니다
									</label>
								</div>
								{errors.agreeTerms && (
									<p className="text-sm text-destructive">
										{errors.agreeTerms}
									</p>
								)}

								<div className="flex items-center space-x-2">
									<Checkbox
										id="privacy"
										checked={formData.agreePrivacy}
										onCheckedChange={(checked) =>
											handleInputChange("agreePrivacy", checked as boolean)
										}
									/>
									<label
										htmlFor="privacy"
										className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										<span className="text-destructive">*</span>{" "}
										개인정보처리방침에 동의합니다
									</label>
								</div>
								{errors.agreePrivacy && (
									<p className="text-sm text-destructive">
										{errors.agreePrivacy}
									</p>
								)}

								<div className="flex items-center space-x-2">
									<Checkbox
										id="marketing"
										checked={formData.agreeMarketing}
										onCheckedChange={(checked) =>
											handleInputChange("agreeMarketing", checked as boolean)
										}
									/>
									<label
										htmlFor="marketing"
										className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										마케팅 정보 수신에 동의합니다 (선택)
									</label>
								</div>
							</div>
						)}

						{errors.submit && (
							<p className="text-sm text-destructive text-center">
								{errors.submit}
							</p>
						)}

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<LoadingSpinner size="sm" />
							) : mode === "login" ? (
								"로그인"
							) : (
								"회원가입"
							)}
						</Button>
					</form>

					<div className="text-center">
						<Button variant="link" onClick={toggleMode} className="text-sm">
							{mode === "login"
								? "계정이 없으신가요? 회원가입"
								: "이미 계정이 있으신가요? 로그인"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
