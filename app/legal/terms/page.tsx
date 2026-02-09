import { Navbar } from '@/components/navbar'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
    FileText, 
    UserCheck, 
    ShieldAlert, 
    Copyright, 
    UserX, 
    Scale, 
    Gavel, 
    RefreshCw,
    AlertTriangle
} from 'lucide-react'

export const metadata = {
    title: 'Terms of Service | CTF Platform',
    description: 'Terms and conditions governing your use of CTF Platform.',
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto py-12 max-w-4xl px-4">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Gavel className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold">Terms of Service</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: February 9, 2026
                    </p>
                </div>

                <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border/60">
                    <p className="text-sm text-muted-foreground">
                        <strong>IMPORTANT:</strong> Please read these Terms of Service carefully before using CTF Platform. 
                        By accessing or using our platform, you agree to be bound by these terms. If you do not agree 
                        with any part of these terms, you may not use our services.
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>1. Acceptance of Terms</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                By creating an account, accessing, or using CTF Platform, you acknowledge that you have read, 
                                understood, and agree to be bound by these Terms of Service and our Privacy Policy. 
                                These terms apply to all visitors, users, and others who access or use the service.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You must be at least 13 years old to use this platform. If you are under 18, you must have 
                                parental or guardian consent. By using the platform, you represent and warrant that you meet 
                                these eligibility requirements.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <UserCheck className="h-5 w-5 text-primary" />
                                <CardTitle>2. User Accounts & Responsibilities</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                When you create an account, you agree to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Provide accurate, current, and complete information during registration</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Accept responsibility for all activities that occur under your account</li>
                                <li>Notify us immediately of any unauthorized access or security breach</li>
                                <li>Not create multiple accounts for the purpose of circumventing limits or restrictions</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                You are solely responsible for safeguarding your account credentials. We will not be liable 
                                for any loss or damage arising from your failure to protect your account information.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="h-5 w-5 text-primary" />
                                <CardTitle>3. Acceptable Use Policy</CardTitle>
                            </div>
                            <CardDescription>
                                Rules for fair play and platform usage
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground font-medium">You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>Share flags or solutions:</strong> Publicly or privately share challenge flags, 
                                walkthroughs, or detailed solutions before the challenge is retired</li>
                                <li><strong>Attack the infrastructure:</strong> Attempt to compromise, bypass, or abuse 
                                platform systems, other users&apos; accounts, or challenge infrastructure outside of intended scope</li>
                                <li><strong>Use automated tools:</strong> Employ brute force attacks, automated flag submission 
                                scripts, or other tools that give unfair advantages</li>
                                <li><strong>Create multiple accounts:</strong> Register multiple accounts to manipulate 
                                leaderboards, circumvent rate limits, or evade bans</li>
                                <li><strong>Engage in harassment:</strong> Harass, abuse, or harm other users through 
                                messages, profiles, or team names</li>
                                <li><strong>Upload malicious content:</strong> Distribute malware, exploits, or other 
                                harmful content through the platform</li>
                                <li><strong>Impersonate others:</strong> Pretend to be another user, administrator, or 
                                any other person or entity</li>
                                <li><strong>Violate laws:</strong> Use the platform for any illegal purpose or in violation 
                                of any local, state, national, or international law</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                Violation of these rules may result in immediate account suspension, permanent ban, 
                                and forfeiture of any subscriptions or achievements.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Copyright className="h-5 w-5 text-primary" />
                                <CardTitle>4. Intellectual Property</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                <strong>Platform Content:</strong> All content on CTF Platform, including but not limited to 
                                challenges, logos, designs, text, graphics, and software, is the property of CTF Platform 
                                or its licensors and is protected by copyright, trademark, and other intellectual property laws.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>User Content:</strong> By submitting content (write-ups, profile information, 
                                team names), you grant us a non-exclusive, worldwide, royalty-free license to use, 
                                reproduce, modify, and display such content in connection with operating and promoting 
                                the platform.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Open Source:</strong> Some challenges may incorporate open-source materials. 
                                Such materials are subject to their respective licenses.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <UserX className="h-5 w-5 text-primary" />
                                <CardTitle>5. Termination</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We reserve the right to suspend or terminate your account immediately, without prior 
                                notice or liability, for any reason, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Violation of these Terms of Service</li>
                                <li>Cheating or attempting to manipulate the platform</li>
                                <li>Engaging in behavior that harms other users or the platform</li>
                                <li>Prolonged account inactivity</li>
                                <li>At your request</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                Upon termination, your right to use the platform will immediately cease. All provisions 
                                of these terms which by their nature should survive termination shall survive, including 
                                ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Scale className="h-5 w-5 text-primary" />
                                <CardTitle>6. Limitation of Liability</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                CTF Platform and its operators shall not be liable for any indirect, incidental, special, 
                                consequential, or punitive damages, including without limitation, loss of profits, data, 
                                use, goodwill, or other intangible losses, resulting from:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Your access to or use of (or inability to access or use) the platform</li>
                                <li>Any conduct or content of any third party on the platform</li>
                                <li>Any content obtained from the platform</li>
                                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                In no event shall our total liability exceed the amount you paid us (if any) in the 
                                twelve (12) months preceding the claim, or $100 USD, whichever is greater.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Gavel className="h-5 w-5 text-primary" />
                                <CardTitle>7. Governing Law</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                These Terms shall be governed and construed in accordance with the laws of the United States, 
                                without regard to its conflict of law provisions. Any dispute arising from these terms 
                                shall be subject to the exclusive jurisdiction of the courts located in California, USA.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                If you are a consumer in the European Union, you may benefit from any mandatory provisions 
                                of the law of the country in which you are resident. Nothing in these terms affects your 
                                rights as a consumer to rely on such mandatory provisions of local law.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <RefreshCw className="h-5 w-5 text-primary" />
                                <CardTitle>8. Changes to Terms</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                                If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms 
                                taking effect. What constitutes a material change will be determined at our sole discretion.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                By continuing to access or use our platform after any revisions become effective, you 
                                agree to be bound by the revised terms. If you do not agree to the new terms, you are 
                                no longer authorized to use the platform.
                            </p>
                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Questions About These Terms?</h3>
                            <p className="text-sm text-muted-foreground">
                                If you have any questions about these Terms of Service, please contact us at{' '}
                                <a href="mailto:legal@ctfplatform.com" className="text-primary hover:underline">
                                    legal@ctfplatform.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
