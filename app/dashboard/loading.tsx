import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dashboard Loading State
 * Displayed while dashboard layout and data are loading
 */
export default function DashboardLoading() {
    return (
        <div className="flex h-screen">
            {/* Sidebar Skeleton */}
            <div className="w-64 border-r bg-sidebar p-4 space-y-6 hidden md:block">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    );
}
