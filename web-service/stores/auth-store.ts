import type { AuthError, Provider, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase-client";

type SupportedProvider = "kakao" | "google";

export interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;

	init: () => Promise<void>;
	signInWithProvider: (
		provider: SupportedProvider,
	) => Promise<{ error: AuthError | null }>;
	signOut: () => Promise<{ error: AuthError | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	loading: true,
	error: null,

	// 인증 초기화 및 상태 관리
	init: async () => {
		try {
			set({ loading: true, error: null });

			// 현재 세션 가져오기
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) {
				console.error("세션 가져오기 오류:", sessionError);
				set({ loading: false, error: sessionError.message });
				return;
			}

			if (session?.user) {
				set({ user: session.user, loading: false });
			} else {
				set({ user: null, loading: false });
			}

			// 인증 상태 변경 리스너 설정
			supabase.auth.onAuthStateChange(async (event, session) => {
				console.log("인증 상태 변경:", event, session?.user?.email);

				if (event === "SIGNED_IN" && session?.user) {
					set({ user: session.user, loading: false, error: null });
				} else if (event === "SIGNED_OUT") {
					set({ user: null, loading: false, error: null });
				} else if (event === "TOKEN_REFRESHED" && session?.user) {
					set({ user: session.user, loading: false });
				}
			});
		} catch (error) {
			console.error("인증 초기화 오류:", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "인증 초기화 중 오류가 발생했습니다.",
				loading: false,
			});
		}
	},

	// 소셜 로그인
	signInWithProvider: async (provider: SupportedProvider) => {
		try {
			set({ loading: true, error: null });

			const { error } = await supabase.auth.signInWithOAuth({
				provider: provider as Provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				set({ error: error.message, loading: false });
				return { error };
			}

			return { error: null };
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "소셜 로그인 중 오류가 발생했습니다.";
			set({ error: errorMessage, loading: false });
			return { error: { message: errorMessage } as AuthError };
		}
	},

	// 로그아웃
	signOut: async () => {
		try {
			set({ loading: true, error: null });
			const { error } = await supabase.auth.signOut();

			if (error) {
				set({ error: error.message, loading: false });
				return { error };
			}

			set({ user: null, loading: false });
			return { error: null };
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "로그아웃 중 오류가 발생했습니다.";
			set({ error: errorMessage, loading: false });
			return { error: { message: errorMessage } as AuthError };
		}
	},
}));
