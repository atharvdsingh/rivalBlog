"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import { commentService } from "@/services/comment.service";
import { LikeButton } from "@/components/common/LikeButton";
import { CommentItem } from "@/components/comment/CommentItem";
import { CommentInput } from "@/components/comment/CommentInput";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Blog, Comment } from "@/lib/types";

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const {
        data: blogRes,
        isLoading: blogLoading,
        isError: blogError,
    } = useQuery({
        queryKey: ["blog", slug],
        queryFn: () => blogService.getBySlug(slug),
        enabled: !!slug,
    });

    const blog: Blog | undefined = blogRes?.data;

    const {
        data: commentsRes,
        refetch: refetchComments,
    } = useQuery({
        queryKey: ["comments", blog?.id],
        queryFn: () => commentService.getByBlogId(blog!.id),
        enabled: !!blog?.id,
    });

    const comments: Comment[] = Array.isArray(commentsRes?.data)
        ? commentsRes.data
        : [];

    if (blogLoading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="space-y-4">
                    <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-1/4 animate-pulse rounded bg-muted" />
                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            </div>
        );
    }

    if (blogError || !blog) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-10 text-center">
                <h2 className="text-2xl font-bold">Blog not found</h2>
                <p className="mt-2 text-muted-foreground">
                    The blog you&apos;re looking for doesn&apos;t exist or has been
                    unpublished.
                </p>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/feed">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Feed
                    </Link>
                </Button>
            </div>
        );
    }

    const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <article className="mx-auto max-w-3xl px-4 py-10">
            {/* Back link */}
            <Button variant="ghost" size="sm" asChild className="mb-6">
                <Link href="/feed">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Feed
                </Link>
            </Button>

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                    {blog.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">
                        {blog.owner?.email?.split("@")[0] || "Anonymous"}
                    </Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formattedDate}
                    </span>
                </div>
            </header>

            {/* Content */}
            <div className="prose prose-neutral max-w-none dark:prose-invert whitespace-pre-wrap leading-relaxed text-foreground">
                {blog.content}
            </div>

            {/* Like */}
            <div className="mt-8">
                <LikeButton
                    blogId={blog.id}
                    initialCount={blog._count?.likes ?? blog.likes?.length ?? 0}
                    initialLiked={blog.isLiked ?? false}
                />
            </div>

            <Separator className="my-8" />

            {/* Comments */}
            <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <MessageCircle className="h-5 w-5" />
                    Comments ({comments.length})
                </h2>

                <div className="mt-4 space-y-3">
                    <CommentInput
                        blogId={blog.id}
                        onCommentAdded={() => refetchComments()}
                    />
                    {comments.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))
                    )}
                </div>
            </section>
        </article>
    );
}
