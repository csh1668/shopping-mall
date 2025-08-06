import { loggerLink } from "@trpc/client";
import {
	createTRPCClient,
	createTRPCReact,
	httpBatchLink,
} from "@trpc/react-query";
import superjson from "superjson";
import { createLogger } from "@/lib/logger";
import { supabase } from "@/lib/supabase-client";
import type { AppRouter } from "./router";

const logger = createLogger("tRPC-Client");

// tRPC React Hooks
export const trpc = createTRPCReact<AppRouter>();

// tRPC Vanilla Client
export const vTrpc = createTRPCClient<AppRouter>({
	links: [
		loggerLink({
			enabled: () =>
				typeof window !== "undefined" && process.env.NODE_ENV === "development",
			colorMode: "css",
			withContext: true,
		}),
		httpBatchLink({
			url: "/api/trpc",
			transformer: superjson,
			async headers() {
				try {
					// 현재 세션에서 access_token 가져오기
					const {
						data: { session },
					} = await supabase.auth.getSession();

					return session?.access_token
						? { authorization: `Bearer ${session.access_token}` }
						: {};
				} catch (error) {
					logger.error("sTrpc: 헤더 설정 중 오류:", error);
					return {};
				}
			},
		}),
	],
});
