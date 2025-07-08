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
			.default(process.env.SUPABASE_SERVICE_ROLE_KEY || ""),
	})
	.merge(PublicEnvSchema);

export const serverEnv = ServerEnvSchema.parse(publicEnv);
export type ServerEnv = z.infer<typeof ServerEnvSchema>;
