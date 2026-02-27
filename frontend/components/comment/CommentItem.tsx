"use client";

import { User } from "lucide-react";
import type { Comment } from "@/lib/types";

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className="flex gap-3 rounded-lg border p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                    {comment.user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
            </div>
        </div>
    );
}
