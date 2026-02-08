import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Flag } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                {/* 404 Icon/Number */}
                <div className="space-y-2">
                    <div className="text-8xl font-bold text-muted-foreground/20">404</div>
                    <h1 className="text-2xl font-bold">Page Not Found</h1>
                    <p className="text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/dashboard">
                            <Flag className="h-4 w-4 mr-2" />
                            Return to Dashboard
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
