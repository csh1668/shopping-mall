import type { UserMetadata } from "@prisma/client";
import type { AuthError, Provider, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";

type MetaInfo = Omit<UserMetadata, "id" | "createdAt" | "updatedAt">;
type MetaInfoUpdate = Partial<MetaInfo>;

type SupportedProvider = "kakao" | "google";

export interface AuthState {
	user: User | null;
	metadata: MetaInfo | null;
	loading: boolean;
	error: string | null;

	// 초기화 및 상태 관리
	init: () => Promise<void>;
	signInWithProvider: (
		provider: SupportedProvider,
	) => Promise<{ error: AuthError | null }>;
	signOut: () => Promise<{ error: AuthError | null }>;
	updateUserMetadata: (
		metadata: MetaInfoUpdate,
	) => Promise<{ error: AuthError | null }>;
	loadUserMetadata: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	metadata: null,
	loading: true,
	error: null,

	// 초기화 및 상태 관리
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
				await get().loadUserMetadata();
			} else {
				set({ user: null, metadata: null, loading: false });
			}

			// 인증 상태 변경 리스너 설정
			supabase.auth.onAuthStateChange(async (event, session) => {
				console.log("인증 상태 변경:", event, session?.user?.email);

				if (event === "SIGNED_IN" && session?.user) {
					set({ user: session.user, loading: false, error: null });
					await get().loadUserMetadata();
				} else if (event === "SIGNED_OUT") {
					set({ user: null, metadata: null, loading: false, error: null });
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

			set({ user: null, metadata: null, loading: false });
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

	// 사용자 메타데이터 업데이트
	updateUserMetadata: async (metadata: MetaInfoUpdate) => {
		try {
			set({ loading: true, error: null });

			const updated = await prisma.userMetadata.update({
				where: {
					id: get().user?.id,
				},
				data: metadata,
			});

			set({ metadata: updated, loading: false });

			return { error: null };
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "사용자 정보 업데이트 중 오류가 발생했습니다.";
			set({ error: errorMessage, loading: false });
			return { error: { message: errorMessage } as AuthError };
		}
	},

	loadUserMetadata: async () => {
		try {
			const { user } = get();
			if (!user) return;

			const metadata = await prisma.userMetadata.findUnique({
				where: {
					id: user.id,
				},
				select: {
					email: true,
					fullName: true,
					phone: true,
					role: true,
				},
			});
			set({ metadata: metadata as MetaInfo });
		} catch (error) {
			console.error("사용자 메타데이터 로드 오류:", error);
		}
	},
}));
