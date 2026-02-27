import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function BlogCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="mt-2 h-6 w-3/4 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="pb-3">
                <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-4">
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                </div>
            </CardFooter>
        </Card>
    );
}
