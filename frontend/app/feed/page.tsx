"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/common/BlogCardSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Blog } from "@/lib/types";

const PAGE_SIZE = 9;

export default function FeedPage() {
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["feed", page],
        queryFn: () =>
            blogService.getPublicFeed({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }),
    });

    const feedResponse = data?.data;
    const blogs: Blog[] = feedResponse?.data ?? [];
    const total = feedResponse?.total ?? 0;
    const hasNext = (page + 1) * PAGE_SIZE < total;

    return (
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Public Feed</h1>
                <p className="mt-1 text-muted-foreground">
                    Discover the latest published blogs
                </p>
            </div>

            {isLoading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <BlogCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                    Failed to load feed. Please try again later.
                </div>
            )}

            {!isLoading && !isError && blogs.length === 0 && (
                <EmptyState
                    title="No blogs published yet"
                    message="Be the first to publish a blog!"
                />
            )}

            {!isLoading && blogs.length > 0 && (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {blogs.map((blog: Blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page + 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasNext}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
