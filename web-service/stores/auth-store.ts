import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

export interface AuthStore {
	user: User | null;
	loading: boolean;
	error: string | null;

	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	loading: true,
	error: null,

	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
	reset: () => set({ user: null, loading: false, error: null }),
}));
