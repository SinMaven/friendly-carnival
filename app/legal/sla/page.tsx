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
    Server, 
    Clock, 
    Zap, 
    Calendar, 
    Database, 
    Percent,
    AlertCircle,
    Mail
} from 'lucide-react'

export const metadata = {
    title: 'Service Level Agreement | CTF Platform',
    description: 'Service commitments, uptime guarantees, and support terms for CTF Platform.',
}

export default function SLAPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto py-12 max-w-4xl px-4">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Server className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold">Service Level Agreement</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: February 9, 2026
                    </p>
                </div>

                <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border/60">
                    <p className="text-sm text-muted-foreground">
                        This Service Level Agreement (&quot;SLA&quot;) outlines the service commitments, uptime guarantees, 
                        and support terms for CTF Platform. This SLA applies to all paid subscription tiers unless 
                        otherwise specified.
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Percent className="h-5 w-5 text-primary" />
                                <CardTitle>Service Availability</CardTitle>
                            </div>
                            <CardDescription>
                                Uptime commitment for platform services
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                                    <div className="text-xs text-muted-foreground">Free Tier Target</div>
                                    <div className="text-xs text-muted-foreground">~8.7h downtime/month</div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">99.95%</div>
                                    <div className="text-xs text-muted-foreground">Pro Tier Target</div>
                                    <div className="text-xs text-muted-foreground">~21m downtime/month</div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-primary mb-1">99.99%</div>
                                    <div className="text-xs text-muted-foreground">Enterprise Target</div>
                                    <div className="text-xs text-muted-foreground">~4m downtime/month</div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                <strong>Uptime Calculation:</strong> Uptime is calculated monthly as a percentage of 
                                total possible minutes (excluding scheduled maintenance and excluded events):
                            </p>
                            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                                Uptime % = (Total Minutes - Downtime Minutes) / Total Minutes × 100
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                <strong>Downtime</strong> is defined as the platform being completely inaccessible 
                                or returning 5xx errors for the majority of requests over a 5-minute period.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-primary" />
                                <CardTitle>Support Response Times</CardTitle>
                            </div>
                            <CardDescription>
                                Commitment to addressing your support requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-2 font-medium">Severity</th>
                                            <th className="text-left py-3 px-2 font-medium">Description</th>
                                            <th className="text-left py-3 px-2 font-medium">Free</th>
                                            <th className="text-left py-3 px-2 font-medium">Pro</th>
                                            <th className="text-left py-3 px-2 font-medium">Enterprise</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-3 px-2 font-medium text-destructive">Critical</td>
                                            <td className="py-3 px-2">Complete service outage</td>
                                            <td className="py-3 px-2">24 hours</td>
                                            <td className="py-3 px-2">4 hours</td>
                                            <td className="py-3 px-2">1 hour</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3 px-2 font-medium text-orange-500">High</td>
                                            <td className="py-3 px-2">Major feature impairment</td>
                                            <td className="py-3 px-2">48 hours</td>
                                            <td className="py-3 px-2">12 hours</td>
                                            <td className="py-3 px-2">4 hours</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3 px-2 font-medium text-yellow-500">Medium</td>
                                            <td className="py-3 px-2">Minor feature issues</td>
                                            <td className="py-3 px-2">5 days</td>
                                            <td className="py-3 px-2">48 hours</td>
                                            <td className="py-3 px-2">24 hours</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-2 font-medium text-green-500">Low</td>
                                            <td className="py-3 px-2">General questions, feature requests</td>
                                            <td className="py-3 px-2">10 days</td>
                                            <td className="py-3 px-2">5 days</td>
                                            <td className="py-3 px-2">48 hours</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                <strong>Response Time</strong> is defined as the time between ticket submission and 
                                our initial acknowledgment. Resolution times vary based on issue complexity.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Support hours: 9 AM - 6 PM UTC, Monday through Friday. Enterprise customers have 
                                access to 24/7 emergency support for critical issues.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-primary" />
                                <CardTitle>Incident Response Procedures</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                When a service-impacting incident occurs, we follow these procedures:
                            </p>
                            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground ml-2">
                                <li>
                                    <strong>Detection:</strong> Our monitoring systems automatically detect anomalies. 
                                    Critical incidents trigger immediate on-call alerts.
                                </li>
                                <li>
                                    <strong>Communication (Within 15 min):</strong> A status update is posted to our 
                                    status page at{' '}
                                    <a href="https://status.ctfplatform.com" className="text-primary hover:underline">
                                        status.ctfplatform.com
                                    </a>
                                </li>
                                <li>
                                    <strong>Investigation:</strong> Our engineering team begins immediate investigation 
                                    to identify root cause and impact scope.
                                </li>
                                <li>
                                    <strong>Updates (Every 30 min):</strong> Status page updates provided every 30 minutes 
                                    during active incidents until resolution.
                                </li>
                                <li>
                                    <strong>Resolution:</strong> Once resolved, a final status update confirms restoration 
                                    of normal service.
                                </li>
                                <li>
                                    <strong>Post-Incident Review:</strong> Within 72 hours, a post-incident report is 
                                    published summarizing root cause, impact, and preventive measures.
                                </li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-primary" />
                                <CardTitle>Scheduled Maintenance</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We periodically perform scheduled maintenance to improve platform performance and security.
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>
                                    <strong>Notice Period:</strong> Minimum 7 days advance notice for planned maintenance 
                                    that may impact service availability
                                </li>
                                <li>
                                    <strong>Maintenance Windows:</strong> Scheduled during low-traffic periods 
                                    (typically Sunday 2-6 AM UTC)
                                </li>
                                <li>
                                    <strong>Duration:</strong> Maintenance windows typically do not exceed 4 hours
                                </li>
                                <li>
                                    <strong>Communication:</strong> Email notifications sent to all registered users; 
                                    in-app banners displayed 48 hours in advance
                                </li>
                                <li>
                                    <strong>Emergency Maintenance:</strong> In rare cases of critical security updates, 
                                    shorter notice may be provided with advance notification where possible
                                </li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                Scheduled maintenance time does not count toward uptime calculations.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Database className="h-5 w-5 text-primary" />
                                <CardTitle>Data Backup Guarantees</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We implement comprehensive backup strategies to protect your data:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>
                                    <strong>Frequency:</strong> Automated daily backups of all user data and challenge configurations
                                </li>
                                <li>
                                    <strong>Retention:</strong> Daily backups retained for 30 days; weekly backups retained for 90 days
                                </li>
                                <li>
                                    <strong>Storage:</strong> Backups stored across multiple geographically distributed regions
                                </li>
                                <li>
                                    <strong>Encryption:</strong> All backups encrypted at rest using AES-256
                                </li>
                                <li>
                                    <strong>Recovery Time Objective (RTO):</strong> 4 hours for complete platform recovery
                                </li>
                                <li>
                                    <strong>Recovery Point Objective (RPO):</strong> Maximum 24 hours of data loss in worst-case scenario
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Percent className="h-5 w-5 text-primary" />
                                <CardTitle>Service Credits for Downtime</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                If we fail to meet the uptime commitment for your subscription tier, you are eligible 
                                for service credits as follows:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-2 font-medium">Monthly Uptime</th>
                                            <th className="text-left py-3 px-2 font-medium">Service Credit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-border/50">
                                            <td className="py-3 px-2">99.0% - 99.9%</td>
                                            <td className="py-3 px-2">10% of monthly subscription fee</td>
                                        </tr>
                                        <tr className="border-b border-border/50">
                                            <td className="py-3 px-2">95.0% - 99.0%</td>
                                            <td className="py-3 px-2">25% of monthly subscription fee</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-2">&lt; 95.0%</td>
                                            <td className="py-3 px-2">50% of monthly subscription fee</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                <strong>To claim a credit:</strong> Submit a request within 30 days of the month in 
                                which the downtime occurred to{' '}
                                <a href="mailto:support@ctfplatform.com" className="text-primary hover:underline">
                                    support@ctfplatform.com
                                </a>{' '}
                                with your account details and incident references.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Service credits are applied to future invoices or refunded if no future payments are due. 
                                Maximum credit per month cannot exceed one month&apos;s subscription fee.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-primary" />
                                <CardTitle>Exclusions</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                The following circumstances are excluded from uptime calculations and SLA commitments:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Scheduled maintenance windows and announced emergency maintenance</li>
                                <li>Factors outside our reasonable control (force majeure, internet backbone failures, third-party DNS issues)</li>
                                <li>Client-side issues (your internet connection, browser problems, local network issues)</li>
                                <li>Violations of our Terms of Service or Acceptable Use Policy</li>
                                <li>Circumstances where you have not followed platform documentation or best practices</li>
                                <li>DDoS attacks exceeding our mitigation capacity (defined as attacks over 100 Gbps)</li>
                                <li>Third-party service failures outside our control (payment processors, identity providers)</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                        <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Questions About This SLA?</h3>
                            <p className="text-sm text-muted-foreground">
                                For SLA inquiries or to request service credits, contact us at{' '}
                                <a href="mailto:support@ctfplatform.com" className="text-primary hover:underline">
                                    support@ctfplatform.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
