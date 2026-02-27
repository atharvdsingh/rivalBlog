"use client";

import { create } from "zustand";
import type { User } from "@/lib/types";

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setAuth: (user, token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        set({ user: null, token: null, isAuthenticated: false });
    },

    hydrate: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr) as User;
                    set({ user, token, isAuthenticated: true });
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }
        }
    },
}));
