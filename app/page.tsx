import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import {
    Flag,
    Trophy,
    Shield,
    Zap,
    Users,
    Terminal,
    ArrowRight
} from 'lucide-react'

const features = [
    {
        icon: Flag,
        title: 'Real-World Challenges',
        description: 'Tackle challenges inspired by real security vulnerabilities and CTF competitions.',
    },
    {
        icon: Terminal,
        title: 'Live Environments',
        description: 'Spin up isolated container instances for hands-on hacking practice.',
    },
    {
        icon: Trophy,
        title: 'Global Leaderboard',
        description: 'Compete with hackers worldwide and climb the rankings.',
    },
    {
        icon: Users,
        title: 'Team Play',
        description: 'Join or create teams to collaborate on challenges together.',
    },
    {
        icon: Shield,
        title: 'All Skill Levels',
        description: 'From beginner-friendly to insane difficulty — something for everyone.',
    },
    {
        icon: Zap,
        title: 'Dynamic Scoring',
        description: 'Points decay as more people solve — early birds get the worm.',
    },
]

const stats = [
    { value: '500+', label: 'Challenges' },
    { value: '50K+', label: 'Users' },
    { value: '1M+', label: 'Solves' },
    { value: '99.9%', label: 'Uptime' },
]

import { createSupabaseServerClient } from '@/lib/supabase/server'

// ... imports ...

export default async function LandingPage() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center py-20 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <Badge variant="secondary" className="mb-4">
                        🚀 New challenges added weekly
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Master Cybersecurity<br />
                        <span className="text-primary">Through Practice</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        The premier platform for Capture The Flag competitions.
                        Sharpen your skills with real-world security challenges.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {user ? (
                            <Button size="lg" asChild>
                                <Link href="/dashboard">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button size="lg" asChild>
                                <Link href="/dashboard/challenges">
                                    Start Hacking
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-muted/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Hackers Choose Us</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to level up your security skills in one platform.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <Card key={feature.title} className="bg-background">
                                <CardHeader>
                                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
                    <p className="text-muted-foreground mb-8">
                        Create a free account and tackle your first challenge in minutes.
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/signup">
                            Create Free Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 font-bold mb-4">
                                <Flag className="h-5 w-5 text-primary" />
                                CTF Platform
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Master cybersecurity through practice with real-world CTF challenges.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/dashboard/challenges" className="hover:text-primary">Challenges</Link></li>
                                <li><Link href="/dashboard/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
                                <li><Link href="/help/getting-started" className="hover:text-primary">Getting Started</Link></li>
                                <li><Link href="/docs/API.md" className="hover:text-primary">API Docs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                                <li><Link href="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
                                <li><Link href="/legal/sla" className="hover:text-primary">SLA</Link></li>
                                <li><Link href="/legal/security" className="hover:text-primary">Security</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2024 CTF Platform. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Link href="/legal/security" className="hover:text-primary flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                SOC 2 Compliant
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}