import { createServerSideHelpers } from "@trpc/react-query/server";
import { supabase } from "@/lib/supabase-client";
import { appRouter } from "./router";

// tRPC Server Side
export const sTrpc = createServerSideHelpers({
	router: appRouter,
	ctx: {
		supabase: supabase,
		user: null,
		isAuthenticated: false,
	},
	// transformer: superjson,
});
