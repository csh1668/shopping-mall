import { appRouter } from "./router";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { supabase } from "@/lib/supabase-client";

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
