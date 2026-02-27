"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        // Wait for hydration, then check
        const storedToken = localStorage.getItem("token");
        if (!isAuthenticated && !storedToken) {
            router.push("/login");
        }
    }, [isAuthenticated, token, router]);

    if (!isAuthenticated && typeof window !== "undefined" && !localStorage.getItem("token")) {
        return null;
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            {children}
        </div>
    );
}
