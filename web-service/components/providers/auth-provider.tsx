import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { init } = useAuthStore();

	useEffect(() => {
		init();
	}, [init]);

	return <>{children}</>;
}
