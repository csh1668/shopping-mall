"use client";

import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export default function SignUpPage() {
	const _router = useRouter();
	const { signUp } = useAuthStore();

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [agreements, setAgreements] = useState({
		terms: false,
		privacy: false,
		marketing: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// 유효성 검사
		if (formData.password !== formData.confirmPassword) {
			setError("비밀번호가 일치하지 않습니다.");
			setLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			setError("비밀번호는 최소 6자 이상이어야 합니다.");
			setLoading(false);
			return;
		}

		if (!agreements.terms || !agreements.privacy) {
			setError("필수 약관에 동의해주세요.");
			setLoading(false);
			return;
		}

		const { error } = await signUp(
			formData.email,
			formData.password,
			formData.fullName,
		);

		if (error) {
			setError(error.message || "회원가입에 실패했습니다.");
		} else {
			setSuccess(true);
		}

		setLoading(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleAgreementChange = (
		key: keyof typeof agreements,
		checked: boolean,
	) => {
		setAgreements((prev) => ({
			...prev,
			[key]: checked,
		}));
	};

	if (success) {
		return (
			<AuthGuard requireAuth={false}>
				<div className="min-h-screen bg-background flex items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardContent className="p-8 text-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<Check className="h-8 w-8 text-green-600" />
							</div>
							<h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
							<p className="text-muted-foreground mb-6">
								이메일 인증을 완료하면 모든 서비스를 이용하실 수 있습니다.
							</p>
							<div className="space-y-3">
								<Link href="/auth/login">
									<Button className="w-full">로그인하기</Button>
								</Link>
								<Link href="/">
									<Button variant="outline" className="w-full bg-transparent">
										홈으로 가기
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</AuthGuard>
		);
	}

	return (
		<AuthGuard requireAuth={false}>
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<Link href="/">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-2xl font-bold">회원가입</h1>
							<p className="text-muted-foreground">
								ShopMall 회원이 되어보세요
							</p>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>새 계정 만들기</CardTitle>
							<CardDescription>
								아래 정보를 입력하여 계정을 생성하세요
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								{error && (
									<Alert variant="destructive">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								<div className="space-y-2">
									<Label htmlFor="fullName">이름</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
										<Input
											id="fullName"
											name="fullName"
											type="text"
											placeholder="홍길동"
											value={formData.fullName}
											onChange={handleChange}
											className="pl-10"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">이메일</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
										<Input
											id="email"
											name="email"
											type="email"
											placeholder="example@email.com"
											value={formData.email}
											onChange={handleChange}
											className="pl-10"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">비밀번호</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
										<Input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											placeholder="최소 6자 이상"
											value={formData.password}
											onChange={handleChange}
											className="pl-10 pr-10"
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">비밀번호 확인</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
										<Input
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="비밀번호를 다시 입력하세요"
											value={formData.confirmPassword}
											onChange={handleChange}
											className="pl-10 pr-10"
											required
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4 text-muted-foreground" />
											) : (
												<Eye className="h-4 w-4 text-muted-foreground" />
											)}
										</Button>
									</div>
								</div>

								{/* 약관 동의 */}
								<div className="space-y-3 pt-4">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="terms"
											checked={agreements.terms}
											onCheckedChange={(checked) =>
												handleAgreementChange("terms", checked as boolean)
											}
										/>
										<Label htmlFor="terms" className="text-sm cursor-pointer">
											<span className="text-red-500">*</span> 이용약관에
											동의합니다
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="privacy"
											checked={agreements.privacy}
											onCheckedChange={(checked) =>
												handleAgreementChange("privacy", checked as boolean)
											}
										/>
										<Label htmlFor="privacy" className="text-sm cursor-pointer">
											<span className="text-red-500">*</span> 개인정보
											처리방침에 동의합니다
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="marketing"
											checked={agreements.marketing}
											onCheckedChange={(checked) =>
												handleAgreementChange("marketing", checked as boolean)
											}
										/>
										<Label
											htmlFor="marketing"
											className="text-sm cursor-pointer"
										>
											마케팅 정보 수신에 동의합니다 (선택)
										</Label>
									</div>
								</div>

								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "가입 중..." : "회원가입"}
								</Button>

								<div className="text-center text-sm">
									<span className="text-muted-foreground">
										이미 계정이 있으신가요?{" "}
									</span>
									<Link
										href="/auth/login"
										className="text-primary hover:underline"
									>
										로그인
									</Link>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</AuthGuard>
	);
}
