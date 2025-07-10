import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function createTRPCContext() {
	const supabase = await getSupabaseServerClient();

	// 현재 사용자 정보 가져오기
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			console.warn("TRPC 컨텍스트 생성 중 오류 발생:", error);
		}

		return {
			supabase,
			user,
			isAuthenticated: !!user,
		};
	} catch (error) {
		console.error("TRPC 컨텍스트 생성 중 오류 발생:", error);
		return {
			supabase,
			user: null,
			isAuthenticated: false,
		};
	}
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
