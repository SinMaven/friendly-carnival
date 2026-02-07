import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
    return (
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
            <Card className="w-full max-w-md border-zinc-800 bg-black/50">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-200">Email</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/login" className="text-sm text-zinc-400 hover:text-red-500 transition-colors">
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
