import api from "@/lib/api";

export const likeService = {
    like: (blogId: string) => api.post(`/blogs/${blogId}/like`),

    unlike: (blogId: string) => api.delete(`/blogs/${blogId}/like`),
};
