'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Global Error Boundary
 * Catches errors that escape the root error boundary
 * This is the last line of defense for errors
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to error tracking service
        console.error('Global Application Error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <h1 className="text-4xl font-bold text-destructive">Critical Error</h1>
                    <p className="text-lg text-muted-foreground">
                        A critical error has occurred. Please refresh the page or try again later.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Try Again
                        </button>
                        <div>
                            <Link
                                href="/"
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="text-left text-xs bg-muted p-4 rounded overflow-auto">
                            {error.stack}
                        </pre>
                    )}
                </div>
            </body>
        </html>
    );
}
