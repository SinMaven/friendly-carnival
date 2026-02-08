import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/session'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireUser()
    const supabase = await createSupabaseServerClient()

    // Fetch subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .eq('user_id', user.id)
        .in('status', ['trialing', 'active'])
        .maybeSingle()

    return (
        <SidebarProvider>
            <AppSidebar user={{ email: user.email || '', id: user.id }} subscription={subscription} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
