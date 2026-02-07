import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    return (
        <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
            <Card className="w-full max-w-lg border-zinc-800 bg-black/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">Contact Support</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Need help? Send us a message and our team will get back to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-200">Email</Label>
                            <Input
                                id="email"
                                placeholder="you@example.com"
                                type="email"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-zinc-200">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="How can we help?"
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-zinc-200">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Describe your issue..."
                                className="min-h-[150px] bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
