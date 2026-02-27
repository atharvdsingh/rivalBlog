import { siteConfig } from "@/config/site";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-muted-foreground">
                <p>
                    &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
                    reserved.
                </p>
                <p>
                    Built with Next.js &amp; NestJS
                </p>
            </div>
        </footer>
    );
}
