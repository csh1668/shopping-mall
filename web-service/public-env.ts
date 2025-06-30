import { z } from "zod";

export const PublicEnvSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().url().default(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().default(process.env.NEXT_PUBLIC_SUPABASE_URL || ""),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""),
});

export const publicEnv = PublicEnvSchema.parse({});
export type PublicEnv = z.infer<typeof PublicEnvSchema>;