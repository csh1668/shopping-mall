import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/public-env";

const supabaseUrl = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
