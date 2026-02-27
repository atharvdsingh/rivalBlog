"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    {siteConfig.name}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-2 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/feed">Feed</Link>
                    </Button>

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    {user?.email?.split("@")[0]}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </nav>

                {/* Mobile hamburger */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t md:hidden">
                    <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
                        <Link
                            href="/feed"
                            className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                            onClick={() => setMobileOpen(false)}
                        >
                            Feed
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileOpen(false);
                                    }}
                                    className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
