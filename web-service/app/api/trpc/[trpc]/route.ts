import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@/server/context";
import { appRouter } from "@/server/router";
import { serverEnv } from "@/server-env";

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createTRPCContext(),
		onError({ error, path, type }) {
			if (serverEnv.NODE_ENV === "development") {
				console.error("[tRPC] onError", { type, path, error });
			}
		},
	});

export { handler as GET, handler as POST };
