"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface AuthGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	redirectTo?: string;
}

export function AuthGuard({
	children,
	requireAuth = true,
	redirectTo = "/auth",
}: AuthGuardProps) {
	const { user, loading, init } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		init();
	}, [init]);

	useEffect(() => {
		if (!loading) {
			if (requireAuth && !user) {
				router.push(redirectTo);
			} else if (!requireAuth && user) {
				router.push("/");
			}
		}
	}, [user, loading, requireAuth, redirectTo, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (requireAuth && !user) {
		return null;
	}

	if (!requireAuth && user) {
		return null;
	}

	return <>{children}</>;
}
