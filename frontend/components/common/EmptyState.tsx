import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export function EmptyState({
    title = "Nothing here yet",
    message = "Check back later for new content.",
}: EmptyStateProps) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}
