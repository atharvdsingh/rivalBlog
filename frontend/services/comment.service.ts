import api from "@/lib/api";
import type { Comment } from "@/lib/types";

export const commentService = {
    create: (blogId: string, content: string) =>
        api.post<Comment>(`/blogs/${blogId}/comments`, { content }),

    getByBlogId: (blogId: string) =>
        api.get<Comment[]>(`/blogs/${blogId}/comments`),
};
