'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

/**
 * Root Error Boundary
 * Catches errors in the app directory and displays a user-friendly error UI
 */
export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to error tracking service
        // TODO: Replace with Sentry or similar
        console.error('Application Error:', {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });

        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error);
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription className="text-base">
                        We apologize for the inconvenience. Our team has been notified of this error.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="rounded-md bg-muted p-4 mb-4">
                            <p className="text-sm font-mono text-destructive break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                        Error ID: {error.digest || 'unknown'}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button onClick={reset} className="w-full" variant="default">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
