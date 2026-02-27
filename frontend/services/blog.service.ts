import api from "@/lib/api";
import type {
    Blog,
    CreateBlogPayload,
    UpdateBlogPayload,
    PaginationParams,
} from "@/lib/types";

export const blogService = {
    create: (data: CreateBlogPayload) => api.post<Blog>("/blog", data),

    update: (id: string, data: UpdateBlogPayload) =>
        api.patch<Blog>(`/blog/${id}`, data),

    delete: (id: string) => api.delete(`/blog/${id}`),

    getBySlug: (slug: string) => api.get<Blog>(`/public/blog/${slug}`),

    getPublicFeed: (params?: PaginationParams) =>
        api.get("/public/feed", { params }),
};
