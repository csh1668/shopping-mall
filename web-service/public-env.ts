import { z } from "zod";

export const PublicEnvSchema = z.object({
	NEXT_PUBLIC_SITE_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
	NEXT_PUBLIC_SUPABASE_URL: z
		.string()
		.url()
		.min(1, "missing NEXT_PUBLIC_SUPABASE_URL"),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z
		.string()
		.min(1, "missing NEXT_PUBLIC_SUPABASE_ANON_KEY"),
	NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY: z
		.string()
		.min(1, "missing NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY"),
});

export const publicEnv = PublicEnvSchema.parse({
	NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY:
		process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY,
});
export type PublicEnv = z.infer<typeof PublicEnvSchema>;
