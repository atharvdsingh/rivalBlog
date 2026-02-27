"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { likeService } from "@/services/like.service";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import axios from "axios";

interface LikeButtonProps {
    blogId: string;
    initialCount: number;
    initialLiked: boolean;
}

export function LikeButton({
    blogId,
    initialCount,
    initialLiked,
}: LikeButtonProps) {
    const { isAuthenticated } = useAuthStore();
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (!isAuthenticated || loading) return;

        const wasLiked = liked;
        const prevCount = count;

        // Optimistic update
        setLiked(!wasLiked);
        setCount(wasLiked ? prevCount - 1 : prevCount + 1);

        setLoading(true);
        try {
            if (wasLiked) {
                const res = await likeService.unlike(blogId);
                setCount(res.data?.likesCount ?? (prevCount - 1));
            } else {
                const res = await likeService.like(blogId);
                setCount(res.data?.likesCount ?? (prevCount + 1));
            }
        } catch (error) {
            // 409 Conflict = already liked, so toggle to unlike instead
            if (axios.isAxiosError(error) && error.response?.status === 409 && !wasLiked) {
                try {
                    const res = await likeService.unlike(blogId);
                    setLiked(false);
                    setCount(res.data?.likesCount ?? (prevCount - 1));
                    return;
                } catch {
                    // fallthrough to rollback
                }
            }
            // Rollback on any other error
            setLiked(wasLiked);
            setCount(prevCount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={!isAuthenticated}
            className={cn(
                "gap-1.5 transition-colors",
                liked && "text-red-500 hover:text-red-600"
            )}
        >
            <Heart
                className={cn("h-4 w-4", liked && "fill-current")}
            />
            {count}
        </Button>
    );
}
