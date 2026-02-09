'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Flag,
    Trophy,
    User,
    Users,
    CreditCard,
    Settings,
    LogOut,
    ChevronUp,
    HelpCircle,
} from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const mainNavItems = [
    { title: 'Overview', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Challenges', url: '/dashboard/challenges', icon: Flag },
    { title: 'Leaderboard', url: '/dashboard/leaderboard', icon: Trophy },
]

const accountNavItems = [
    { title: 'Profile', url: '/dashboard/profile', icon: User },
    { title: 'Team', url: '/dashboard/team', icon: Users },
    { title: 'Subscription', url: '/dashboard/subscription', icon: CreditCard },
    { title: 'Settings', url: '/dashboard/settings', icon: Settings },
]

const supportNavItems = [
    { title: 'Help Center', url: '/help', icon: HelpCircle },
]

import { Badge } from '@/components/ui/badge'
import { NotificationBell } from '@/components/notifications/notification-bell'

interface Subscription {
    prices?: {
        products?: {
            name?: string
        } | null
    } | null
}

export function AppSidebar({
    user,
    subscription,
    profile
}: {
    user: { email: string; id: string };
    subscription?: Subscription;
    profile?: { username?: string | null; avatar_url?: string | null; full_name?: string | null } | null;
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()

    const planName = subscription?.prices?.products?.name || 'Free Plan'

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center  bg-primary text-primary-foreground">
                                    <Flag className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">CTF Platform</span>
                                    <span className="truncate text-xs text-muted-foreground">Hack the planet</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="px-2 py-2 flex justify-end">
                    <NotificationBell />
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.url === '/dashboard' ? pathname === item.url : pathname.startsWith(item.url)}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {supportNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 ">
                                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || user.email} />
                                        <AvatarFallback className="">
                                            {(profile?.username || user.email)?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{profile?.username || user.email}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-xs text-muted-foreground">{planName}</span>
                                            {planName !== 'Free Plan' && (
                                                <Badge variant="outline" className="h-4 px-1 text-[10px] uppercase">
                                                    {planName.replace(' Plan', '')}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronUp className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 "
                                side="top"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/subscription">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Subscription
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
