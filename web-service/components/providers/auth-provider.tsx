import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { init } = useAuth();

	useEffect(() => {
		const cleanup = init();

		// cleanup 함수가 반환되면 useEffect cleanup에서 호출
		return () => {
			if (cleanup) {
				cleanup.then((cleanupFn) => {
					if (cleanupFn) cleanupFn();
				});
			}
		};
	}, [init]);

	return <>{children}</>;
}
