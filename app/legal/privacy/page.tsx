import { Navbar } from '@/components/navbar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, Lock, FileText, Clock, Server, Eye, Cookie, Mail } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy | CTF Platform',
    description: 'Learn how CTF Platform collects, uses, and protects your personal data.',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto py-12 max-w-4xl px-4">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: February 9, 2026
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-primary" />
                                <CardTitle>Data Collection</CardTitle>
                            </div>
                            <CardDescription>
                                What information we collect from you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We collect the following types of data to provide and improve our services:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Account Information:</strong> Email address, username, profile picture, and display name provided during registration</li>
                                <li><strong>Profile Information:</strong> Bio, social links, team affiliations, and preferences you choose to share</li>
                                <li><strong>Usage Data:</strong> Challenge attempts, submission history, leaderboard rankings, and progress statistics</li>
                                <li><strong>Technical Data:</strong> IP addresses, browser type, device information, and access timestamps for security and analytics</li>
                                <li><strong>Payment Information:</strong> Billing details processed securely through our payment provider (we do not store full payment card data)</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>How We Use Your Data</CardTitle>
                            </div>
                            <CardDescription>
                                Purposes for which we process your information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Authentication:</strong> To verify your identity and secure your account access</li>
                                <li><strong>Platform Functionality:</strong> To track challenge progress, calculate leaderboard rankings, and enable team features</li>
                                <li><strong>Analytics:</strong> To understand platform usage patterns and improve user experience</li>
                                <li><strong>Communication:</strong> To send important account notifications, challenge announcements, and newsletters (with opt-out)</li>
                                <li><strong>Security:</strong> To detect and prevent fraudulent activity, cheating attempts, and unauthorized access</li>
                                <li><strong>Subscription Management:</strong> To process payments and manage your premium features</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Server className="h-5 w-5 text-primary" />
                                <CardTitle>Data Storage & Security</CardTitle>
                            </div>
                            <CardDescription>
                                How and where your data is stored
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Your data is stored securely using industry-standard practices:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Primary Storage:</strong> Supabase PostgreSQL databases with encryption at rest</li>
                                <li><strong>Data Location:</strong> Data is primarily stored in US-based data centers with EU data residency options available</li>
                                <li><strong>Encryption:</strong> AES-256 encryption for data at rest; TLS 1.3 for data in transit</li>
                                <li><strong>Backups:</strong> Automated daily backups with 30-day retention, encrypted and geographically distributed</li>
                                <li><strong>Access Controls:</strong> Role-based access controls with principle of least privilege</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary" />
                                <CardTitle>Data Retention</CardTitle>
                            </div>
                            <CardDescription>
                                How long we keep your information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Active Accounts:</strong> Data retained indefinitely while your account remains active</li>
                                <li><strong>Inactive Accounts:</strong> Accounts inactive for 2 years may be flagged for review; notification sent 30 days before any action</li>
                                <li><strong>Deleted Accounts:</strong> Personal identifiers removed within 30 days; anonymized challenge data retained for statistics</li>
                                <li><strong>Logs:</strong> Security and access logs retained for 90 days</li>
                                <li><strong>Backups:</strong> Backup data retained for 30 days before permanent deletion</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-primary" />
                                <CardTitle>Your Rights (GDPR & CCPA)</CardTitle>
                            </div>
                            <CardDescription>
                                Rights you have regarding your personal data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Depending on your location, you have the following rights:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                                <li><strong>Right to Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                                <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format</li>
                                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing</li>
                                <li><strong>Right to Restrict Processing:</strong> Request limited processing of your data in certain circumstances</li>
                                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                To exercise any of these rights, please contact us at privacy@ctfplatform.com. 
                                We will respond within 30 days.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Cookie className="h-5 w-5 text-primary" />
                                <CardTitle>Cookies & Tracking</CardTitle>
                            </div>
                            <CardDescription>
                                Our use of cookies and similar technologies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We use cookies and similar tracking technologies to enhance your experience:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Essential Cookies:</strong> Required for platform functionality (authentication, session management, CSRF protection)</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand platform usage (Google Analytics, Plausible) - can be disabled</li>
                                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                <li><strong>Security Cookies:</strong> Used by Cloudflare Turnstile to protect against bots and abuse</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                You can manage cookie preferences through your browser settings. Note that disabling essential cookies 
                                may affect platform functionality.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Server className="h-5 w-5 text-primary" />
                                <CardTitle>Third-Party Services</CardTitle>
                            </div>
                            <CardDescription>
                                External services we use to operate the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We integrate with the following third-party services:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Supabase:</strong> Database, authentication, and storage services. Data processing governed by Supabase&apos;s DPA.</li>
                                <li><strong>Polar.sh:</strong> Subscription management and payment processing. Financial data handled per PCI-DSS standards.</li>
                                <li><strong>Cloudflare Turnstile:</strong> Bot detection and CAPTCHA services. IP addresses processed for security verification.</li>
                                <li><strong>Cloudflare:</strong> CDN and DDoS protection. May process request data for security purposes.</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                All third-party providers are vetted for security and compliance. We only share data 
                                necessary for the service to function.
                            </p>
                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Contact Us</h3>
                            <p className="text-sm text-muted-foreground">
                                If you have any questions about this Privacy Policy or wish to exercise your rights, 
                                please contact our Data Protection Officer at{' '}
                                <a href="mailto:privacy@ctfplatform.com" className="text-primary hover:underline">
                                    privacy@ctfplatform.com
                                </a>
                                . We aim to respond to all inquiries within 48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
