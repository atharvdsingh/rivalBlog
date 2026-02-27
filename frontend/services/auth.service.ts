import api from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";

export const authService = {
    register: (data: { email: string; password: string }) =>
        api.post<AuthResponse>("/auth/register", data),

    login: (data: { email: string; password: string }) =>
        api.post<AuthResponse>("/auth/login", data),

    getProfile: () => api.get<User>("/auth/profile"),
};
