"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SocialButton } from "@/components/ui/social-button";
import { useAuth } from "@/hooks/use-auth";
import { createLogger } from "@/lib/logger";

const _logger = createLogger("auth-page");

export default function AuthPage() {
	const router = useRouter();
	const { signInWithProvider } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleSocialLogin = async (provider: "google" | "kakao") => {
		setIsLoading(true);
		try {
			await signInWithProvider(provider);
			router.push("/");
		} catch (error) {
			_logger.error("소셜 로그인 실패:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center p-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						로그인
					</CardTitle>
					<CardDescription className="text-center">
						ShopMall에 오신 것을 환영합니다
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					<div className="space-y-3">
						<SocialButton
							provider="google"
							onClick={() => handleSocialLogin("google")}
							disabled={isLoading}
						>
							Google로 로그인
						</SocialButton>
						<SocialButton
							provider="kakao"
							onClick={() => handleSocialLogin("kakao")}
							disabled={isLoading}
						>
							카카오로 로그인
						</SocialButton>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
