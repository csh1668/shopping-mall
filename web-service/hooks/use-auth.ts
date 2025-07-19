import type { AuthError, Provider } from "@supabase/supabase-js";
import { useCallback } from "react";
import { createLogger } from "@/lib/logger";
import { supabase } from "@/lib/supabase-client";
import { useAuthStore } from "@/stores/auth-store";

const logger = createLogger("use-auth");

export type SupportedProvider = "kakao" | "google";

export function useAuth() {
	const store = useAuthStore();

	// 인증 초기화 및 상태 관리
	const init = useCallback(async () => {
		try {
			store.setLoading(true);
			store.setError(null);

			// 현재 세션 가져오기
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				logger.error("세션 가져오기 오류:", sessionError);
				store.setError(sessionError.message);
				store.setLoading(false);
				return;
			}

			if (session?.user) {
				store.setUser(session.user);
			} else {
				store.setUser(null);
			}

			store.setLoading(false);

			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange(async (event, session) => {
				logger.info("인증 상태 변경:", event, session?.user?.email);

				if (event === "SIGNED_IN" && session?.user) {
					store.setUser(session.user);
					store.setError(null);
					store.setLoading(false);
				} else if (event === "SIGNED_OUT") {
					store.reset();
				} else if (event === "TOKEN_REFRESHED" && session?.user) {
					store.setUser(session.user);
					store.setLoading(false);
				}
			});

			// 리스너 정리를 위한 cleanup 함수 반환
			return () => subscription.unsubscribe();
		} catch (error) {
			logger.error("인증 초기화 오류:", error);
			store.setError(
				error instanceof Error
					? error.message
					: "인증 초기화 중 오류가 발생했습니다.",
			);
			store.setLoading(false);
		}
	}, [store.setLoading, store.setError, store.setUser, store.reset]);

	// 소셜 로그인
	const signInWithProvider = useCallback(
		async (provider: SupportedProvider) => {
			try {
				store.setLoading(true);
				store.setError(null);

				const { error } = await supabase.auth.signInWithOAuth({
					provider: provider as Provider,
					options: {
						redirectTo: `${window.location.origin}/auth/callback`,
					},
				});

				if (error) {
					store.setError(error.message);
					store.setLoading(false);
					return { error };
				}

				return { error: null };
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "소셜 로그인 중 오류가 발생했습니다.";
				store.setError(errorMessage);
				store.setLoading(false);
				return { error: { message: errorMessage } as AuthError };
			}
		},
		[store.setLoading, store.setError],
	);

	// 로그아웃
	const signOut = useCallback(async () => {
		try {
			store.setLoading(true);
			const { error } = await supabase.auth.signOut();

			if (error) {
				store.setError(error.message);
				store.setLoading(false);
				return { error };
			}

			store.reset();
			return { error: null };
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "로그아웃 중 오류가 발생했습니다.";
			store.setError(errorMessage);
			store.setLoading(false);
			return { error: { message: errorMessage } as AuthError };
		}
	}, [store.setLoading, store.setError, store.reset]);

	return {
		user: store.user,
		loading: store.loading,
		error: store.error,

		init,
		signInWithProvider,
		signOut,
	};
}
