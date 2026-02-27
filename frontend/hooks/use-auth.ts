"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth({ redirectTo = "/login" }: { redirectTo?: string } = {}) {
    const { isAuthenticated, user, token, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!isAuthenticated && !storedToken) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    return { isAuthenticated, user, token, logout };
}
