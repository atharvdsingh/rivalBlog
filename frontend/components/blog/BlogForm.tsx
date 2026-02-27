"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogService } from "@/services/blog.service";
import type { Blog, CreateBlogPayload, UpdateBlogPayload } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface BlogFormProps {
    mode: "create" | "edit";
    initialData?: Blog;
}

export function BlogForm({ mode, initialData }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [summary, setSummary] = useState(initialData?.summary || "");
    const [isPublished, setIsPublished] = useState(
        initialData?.isPublished || false
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            return;
        }

        setLoading(true);

        try {
            if (mode === "create") {
                const payload: CreateBlogPayload = {
                    title: title.trim(),
                    content: content.trim(),
                    IsPublished: isPublished,
                    summary: summary.trim() || undefined,
                };
                await blogService.create(payload);
            } else if (initialData) {
                const payload: UpdateBlogPayload = {
                    title: title.trim(),
                    content: content.trim(),
                    IsPublished: isPublished,
                    summary: summary.trim() || undefined,
                };
                await blogService.update(initialData.id, payload);
            }
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Something went wrong";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle>{mode === "create" ? "Create New Blog" : "Edit Blog"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary">Summary (optional)</Label>
                        <Input
                            id="summary"
                            placeholder="Short summary for the feed"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your blog content..."
                            className="min-h-[200px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4 rounded border-border accent-primary"
                        />
                        <Label htmlFor="isPublished" className="cursor-pointer">
                            Publish immediately
                        </Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Create Blog" : "Save Changes"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
