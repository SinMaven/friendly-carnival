import { Skeleton } from '@/components/ui/skeleton';

/**
 * Root Loading State
 * Displayed while the root layout is loading
 */
export default function RootLoading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4">
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
}
