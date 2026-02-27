"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BlogForm } from "@/components/blog/BlogForm";
import { blogService } from "@/services/blog.service";
import type { Blog } from "@/lib/types";

export default function EditBlogPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading } = useQuery({
        queryKey: ["blog-edit", id],
        queryFn: () => blogService.getUserBlogs(),
        enabled: !!id,
    });

    const blogs: Blog[] = Array.isArray(data?.data) ? data.data : [];
    const blog = blogs.find((b) => b.id === id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-xl font-semibold">Blog not found</h2>
                <p className="mt-2 text-muted-foreground">
                    The blog you are trying to edit doesn&apos;t exist.
                </p>
            </div>
        );
    }

    return (
        <div>
            <BlogForm mode="edit" initialData={blog} />
        </div>
    );
}
