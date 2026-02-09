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
    Shield, 
    Lock, 
    Key, 
    Eye, 
    Fingerprint, 
    FileWarning,
    Mail,
    RefreshCw,
    Server,
    CheckCircle
} from 'lucide-react'

export const metadata = {
    title: 'Security | CTF Platform',
    description: 'Security documentation, policies, and measures for CTF Platform.',
}

export default function SecurityPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto py-12 max-w-4xl px-4">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold">Security Documentation</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Last updated: February 9, 2026
                    </p>
                </div>

                <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border/60">
                    <p className="text-sm text-muted-foreground">
                        At CTF Platform, security is not just a feature—it&apos;s foundational to everything we do. 
                        This document outlines our security measures, policies, and practices to keep your data 
                        and our platform secure.
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Security Measures</CardTitle>
                            </div>
                            <CardDescription>
                                Comprehensive security controls protecting our platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We implement defense-in-depth security measures across all layers of our infrastructure:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>
                                    <strong>Infrastructure Security:</strong> Cloud infrastructure secured with network 
                                    segmentation, firewalls, and intrusion detection systems
                                </li>
                                <li>
                                    <strong>DDoS Protection:</strong> Cloudflare-based protection against distributed 
                                    denial-of-service attacks with automatic mitigation
                                </li>
                                <li>
                                    <strong>Access Controls:</strong> Role-based access control (RBAC) with principle 
                                    of least privilege for all staff and systems
                                </li>
                                <li>
                                    <strong>Security Monitoring:</strong> 24/7 monitoring with automated alerting for 
                                    suspicious activities and anomalies
                                </li>
                                <li>
                                    <strong>Regular Audits:</strong> Continuous security scanning, quarterly penetration 
                                    testing by third-party security firms
                                </li>
                                <li>
                                    <strong>Code Security:</strong> Automated dependency scanning, static analysis (SAST), 
                                    and mandatory code reviews for all changes
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Lock className="h-5 w-5 text-primary" />
                                <CardTitle>Encryption</CardTitle>
                            </div>
                            <CardDescription>
                                How we protect your data in transit and at rest
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <RefreshCw className="h-4 w-4 text-primary" />
                                        <h4 className="font-medium">In Transit</h4>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>TLS 1.3 for all connections</li>
                                        <li>HSTS enabled with preloading</li>
                                        <li>Perfect Forward Secrecy (PFS)</li>
                                        <li>Strong cipher suites only</li>
                                        <li>Automatic HTTP to HTTPS redirect</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Server className="h-4 w-4 text-primary" />
                                        <h4 className="font-medium">At Rest</h4>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>AES-256 encryption for databases</li>
                                        <li>Encrypted file storage</li>
                                        <li>Encrypted backups</li>
                                        <li>Key management via AWS KMS</li>
                                        <li>Automatic key rotation</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">
                                All encryption keys are managed through a secure key management service (KMS) with 
                                strict access controls and automatic rotation policies.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Fingerprint className="h-5 w-5 text-primary" />
                                <CardTitle>Authentication Methods</CardTitle>
                            </div>
                            <CardDescription>
                                Secure ways to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm">Multi-Factor Authentication (MFA)</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Support for TOTP-based authenticator apps (Google Authenticator, Authy, 1Password). 
                                            Strongly recommended for all accounts; required for admin accounts.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm">OAuth Integration</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Secure sign-in via Google, GitHub, and other OAuth providers. No password 
                                            storage required when using OAuth.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm">Email/Password Authentication</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Secure password-based authentication with bcrypt hashing, rate limiting, 
                                            and breach detection.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm">Magic Links</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Passwordless authentication via secure, time-limited magic links sent to 
                                            your email.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Key className="h-5 w-5 text-primary" />
                                <CardTitle>Password Policies</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We enforce strong password requirements to protect your account:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Minimum 12 characters (16+ recommended)</li>
                                <li>Must include uppercase, lowercase, number, and special character</li>
                                <li>Password breach detection against Have I Been Pwned database</li>
                                <li>bcrypt hashing with salt (work factor 12)</li>
                                <li>Rate limiting on login attempts (5 attempts per 15 minutes per IP)</li>
                                <li>Account lockout after 10 failed attempts (30-minute cooldown)</li>
                                <li>Password history to prevent reuse of recent passwords</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                We strongly recommend using a password manager to generate and store unique, 
                                strong passwords for your accounts.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5 text-primary" />
                                <CardTitle>Session Management</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Secure session handling to protect your active sessions:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>
                                    <strong>Session Duration:</strong> Sessions expire after 30 days of inactivity 
                                    (configurable by users)
                                </li>
                                <li>
                                    <strong>Secure Cookies:</strong> HttpOnly, Secure, and SameSite=Strict flags on 
                                    all session cookies
                                </li>
                                <li>
                                    <strong>Concurrent Sessions:</strong> Users can view and revoke active sessions 
                                    from account settings
                                </li>
                                <li>
                                    <strong>Automatic Logout:</strong> Sessions invalidated on password change or 
                                    MFA configuration changes
                                </li>
                                <li>
                                    <strong>Device Tracking:</strong> Optional email notifications for new device logins
                                </li>
                                <li>
                                    <strong>CSRF Protection:</strong> State tokens required for all state-changing operations
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <FileWarning className="h-5 w-5 text-primary" />
                                <CardTitle>Vulnerability Disclosure Policy</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                We welcome security researchers and CTF participants to help improve our platform security. 
                                We commit to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li>Respond to vulnerability reports within 48 hours</li>
                                <li>Not pursue legal action against researchers acting in good faith</li>
                                <li>Provide recognition (with permission) for significant findings</li>
                                <li>Implement fixes and publicly disclose resolved issues</li>
                            </ul>
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">Scope</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                    In-scope: *.ctfplatform.com, API endpoints, mobile applications
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Out-of-scope: Third-party integrations, social engineering, physical attacks, 
                                    denial of service attacks
                                </p>
                            </div>
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">Rules of Engagement</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Do not access, modify, or delete data belonging to other users</li>
                                    <li>Do not disrupt platform availability or performance</li>
                                    <li>Do not publicly disclose vulnerabilities before we&apos;ve had a chance to fix them</li>
                                    <li>Provide detailed reports with steps to reproduce</li>
                                    <li>Allow up to 90 days for resolution before public disclosure</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <CardTitle>Security Contact</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                For security-related inquiries, vulnerability reports, or incident notifications:
                            </p>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium">Email: </span>
                                        <a href="mailto:security@ctfplatform.com" className="text-sm text-primary hover:underline">
                                            security@ctfplatform.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Key className="h-4 w-4 text-primary shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium">PGP Key: </span>
                                        <a href="/security/pgp-key.asc" className="text-sm text-primary hover:underline">
                                            Download Public Key
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-primary shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium">Bug Bounty: </span>
                                        <a href="https://hackerone.com/ctfplatform" className="text-sm text-primary hover:underline">
                                            HackerOne Program
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                For urgent security matters, please include &quot;[URGENT]&quot; in the subject line. 
                                We aim to acknowledge all security reports within 24 hours and provide regular 
                                updates until resolution.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-primary" />
                                <CardTitle>Compliance & Certifications</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Our security practices align with industry standards and regulations:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-2">
                                <li><strong>SOC 2 Type II:</strong> Annual audits of security controls</li>
                                <li><strong>GDPR Compliance:</strong> Data protection by design and default</li>
                                <li><strong>CCPA Compliance:</strong> California Consumer Privacy Act adherence</li>
                                <li><strong>PCI DSS:</strong> Payment card industry standards (via our payment processor)</li>
                                <li><strong>ISO 27001:</strong> Information security management alignment</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-4">
                                Compliance reports and certifications are available to Enterprise customers upon request 
                                under NDA.
                            </p>
                        </CardContent>
                    </Card>

                    <Separator className="my-8" />

                    <div className="flex items-start gap-4 p-6 bg-muted/50 rounded-lg">
                        <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Our Security Commitment</h3>
                            <p className="text-sm text-muted-foreground">
                                Security is an ongoing process. We continuously monitor, improve, and update our 
                                security practices to protect against evolving threats. If you have any questions 
                                or concerns about our security practices, please don&apos;t hesitate to reach out to 
                                our security team at{' '}
                                <a href="mailto:security@ctfplatform.com" className="text-primary hover:underline">
                                    security@ctfplatform.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
