"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { likeService } from "@/services/like.service";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

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

        // Optimistic update
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);

        setLoading(true);
        try {
            if (liked) {
                await likeService.unlike(blogId);
            } else {
                await likeService.like(blogId);
            }
        } catch {
            // Rollback on error
            setLiked(liked);
            setCount(count);
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
