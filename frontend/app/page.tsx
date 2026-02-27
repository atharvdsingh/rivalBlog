import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Shield, Users } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-24 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    Share your ideas with the{" "}
                    <span className="text-primary">world</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                    A secure, modern blogging platform. Write, publish, and engage with
                    readers through likes and comments.
                </p>
                <div className="flex gap-3">
                    <Button size="lg" asChild>
                        <Link href="/feed">
                            Explore Feed <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="border-t bg-muted/30">
                <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 sm:grid-cols-3">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">Write &amp; Publish</h3>
                        <p className="text-sm text-muted-foreground">
                            Create blogs with a clean editor. Publish instantly or save as
                            drafts.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">Engage</h3>
                        <p className="text-sm text-muted-foreground">
                            Like and comment on posts to connect with other writers.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">Secure</h3>
                        <p className="text-sm text-muted-foreground">
                            JWT authentication, password hashing, and protected routes keep
                            your data safe.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}