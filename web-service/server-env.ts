import { z } from "zod";
import { PublicEnvSchema, publicEnv } from "./public-env";

// prevent this file from being imported on the client
if (typeof window !== "undefined") {
	throw new Error("server-env.ts should only be imported on the server.");
}

const ServerEnvSchema = z
	.object({
		NODE_ENV: z
			.enum(["development", "production"])
			.default(process.env.NODE_ENV as "development" | "production"),
		SUPABASE_SERVICE_ROLE_KEY: z
			.string()
			.min(1, "missing SUPABASE_SERVICE_ROLE_KEY"),
		DATABASE_URL: z.string().min(1, "missing DATABASE_URL"),
		DIRECT_URL: z.string().min(1, "missing DIRECT_URL"),
	})
	.merge(PublicEnvSchema);

export const serverEnv = ServerEnvSchema.parse({
	...publicEnv,
	NODE_ENV: process.env.NODE_ENV,
	SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
	DATABASE_URL: process.env.DATABASE_URL,
	DIRECT_URL: process.env.DIRECT_URL,
});
export type ServerEnv = z.infer<typeof ServerEnvSchema>;
