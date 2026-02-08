'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
    Trophy,
    Flag,
    CreditCard,
    Menu
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navLinks = [
    { href: '/dashboard/challenges', label: 'Challenges', icon: Flag },
    { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
]

import { User } from '@supabase/supabase-js'

interface NavbarProps {
    user?: User | null
}

export function Navbar({ user }: NavbarProps) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-xl">
                    <Flag className="h-6 w-6 text-primary" />
                    <span>CTF Platform</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-primary',
                                pathname === link.href
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <form action="/auth/signout" method="post">
                                <Button variant="outline" type="submit">
                                    Sign Out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px]">
                        <div className="flex flex-col gap-6 pt-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 text-lg font-medium',
                                        pathname === link.href
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                            <Separator />
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
