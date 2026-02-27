"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentService } from "@/services/comment.service";
import { useAuthStore } from "@/store/auth-store";
import { Loader2, Send } from "lucide-react";

interface CommentInputProps {
    blogId: string;
    onCommentAdded: () => void;
}

export function CommentInput({ blogId, onCommentAdded }: CommentInputProps) {
    const { isAuthenticated } = useAuthStore();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return (
            <p className="text-sm text-muted-foreground">
                Please login to leave a comment.
            </p>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await commentService.create(blogId, content.trim());
            setContent("");
            onCommentAdded();
        } catch {
            // silently fail — could add toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60px] flex-1"
            />
            <Button
                type="submit"
                size="icon"
                disabled={loading || !content.trim()}
                className="shrink-0 self-end"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
            </Button>
        </form>
    );
}
