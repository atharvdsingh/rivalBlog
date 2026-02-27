"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Plus, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import type { Blog } from "@/lib/types";

export default function DashboardPage() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["my-blogs"],
        queryFn: () => blogService.getPublicFeed({ limit: 100, offset: 0 }),
    });

    const blogs: Blog[] = Array.isArray(data?.data)
        ? data.data
        : data?.data?.data ?? [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => blogService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
        },
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your blog posts
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/blogs/create">
                        <Plus className="mr-2 h-4 w-4" />
                        New Blog
                    </Link>
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            )}

            {!isLoading && blogs.length === 0 && (
                <EmptyState
                    title="No blogs yet"
                    message="Create your first blog post to get started."
                />
            )}

            {!isLoading && blogs.length > 0 && (
                <div className="space-y-3">
                    {blogs.map((blog) => (
                        <Card key={blog.id}>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex-1">
                                    <CardTitle className="text-base">{blog.title}</CardTitle>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge
                                            variant={blog.isPublished ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {blog.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {blog.isPublished && (
                                            <DropdownMenuItem asChild>
                                                <Link href={`/blog/${blog.slug}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => deleteMutation.mutate(blog.id)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            {blog.summary && (
                                <CardContent className="pt-0">
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {blog.summary}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
