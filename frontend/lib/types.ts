// ─── User ───────────────────────────────────────────
export interface User {
    id: string;
    email: string;
    createdAt: string;
}

// ─── Blog ───────────────────────────────────────────
export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    isPublished: boolean;
    createdAt: string;
    updateAt: string;
    ownerId: string;
    owner?: User;
    likes?: Like[];
    comments?: Comment[];
    _count?: {
        likes: number;
        comments: number;
    };
    isLiked?: boolean;
}

export interface CreateBlogPayload {
    title: string;
    content: string;
    IsPublished: boolean;
    summary?: string;
}

export interface UpdateBlogPayload {
    title?: string;
    content?: string;
    IsPublished?: boolean;
    summary?: string;
}

// ─── Like ───────────────────────────────────────────
export interface Like {
    id: string;
    userId: string;
    blogId: string;
    createdAt: string;
}

// ─── Comment ────────────────────────────────────────
export interface Comment {
    id: string;
    content: string;
    userId: string;
    blogId: string;
    createdAt: string;
    user?: User;
}

// ─── API Responses ──────────────────────────────────
export interface AuthResponse {
    access_token: string;
}

export interface FeedResponse {
    data: Blog[];
    total: number;
    limit: number;
    offset: number;
}

export interface PaginationParams {
    limit?: number;
    offset?: number;
}
