"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar } from "lucide-react";
import type { Blog } from "@/lib/types";

interface BlogCardProps {
    blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
    const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Link href={`/blog/${blog.slug}`}>
            <Card className="group h-full transition-all duration-200 hover:shadow-md hover:border-primary/30">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                            {blog.owner?.email?.split("@")[0] || "Anonymous"}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formattedDate}
                        </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                        {blog.title}
                    </h3>
                </CardHeader>

                <CardContent className="pb-3">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {blog.summary || blog.content?.slice(0, 150) + "..."}
                    </p>
                </CardContent>

                <CardFooter className="text-muted-foreground">
                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" />
                            {blog._count?.likes ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {blog._count?.comments ?? 0}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
