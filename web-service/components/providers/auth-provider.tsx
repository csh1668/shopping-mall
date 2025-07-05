import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { init } = useAuthStore();

  useEffect(() => {
    init();
  }, [init]);

  return <>{children}</>;
}