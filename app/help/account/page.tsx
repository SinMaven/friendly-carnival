import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Key,
  Shield,
  Smartphone,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Lock,
  Globe,
  Mail,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Account Management | CTF Platform Help",
  description: "Learn how to manage your profile, security settings, API tokens, and account deletion.",
};

const profileFields = [
  {
    field: "Username",
    description: "Your unique public identifier on the platform",
    editable: "Once only",
    icon: User,
  },
  {
    field: "Display Name",
    description: "Shown on your public profile and leaderboard",
    editable: "Anytime",
    icon: User,
  },
  {
    field: "Email",
    description: "Used for login and notifications",
    editable: "With verification",
    icon: Mail,
  },
  {
    field: "Bio",
    description: "Short description about yourself",
    editable: "Anytime",
    icon: User,
  },
  {
    field: "Country",
    description: "Shown on your profile and used for regional rankings",
    editable: "Anytime",
    icon: Globe,
  },
  {
    field: "Social Links",
    description: "GitHub, Twitter, LinkedIn, personal website",
    editable: "Anytime",
    icon: ExternalLink,
  },
  {
    field: "Avatar",
    description: "Profile picture (Gravatar or uploaded image)",
    editable: "Anytime",
    icon: User,
  },
];

const securityFeatures = [
  {
    title: "Password Requirements",
    items: [
      "Minimum 12 characters",
      "At least one uppercase letter",
      "At least one lowercase letter",
      "At least one number",
      "At least one special character",
    ],
  },
  {
    title: "Security Recommendations",
    items: [
      "Use a unique password (not reused elsewhere)",
      "Enable Two-Factor Authentication (2FA)",
      "Regularly review active sessions",
      "Keep your email account secure",
    ],
  },
];

const mfaSteps = [
  {
    step: 1,
    title: "Access Security Settings",
    description: "Go to Dashboard → Settings → Security",
  },
  {
    step: 2,
    title: "Enable 2FA",
    description: "Click 'Enable Two-Factor Authentication'",
  },
  {
    step: 3,
    title: "Choose Method",
    description: "Select Authenticator App (recommended) or Security Key",
  },
  {
    step: 4,
    title: "Scan QR Code",
    description: "Use your authenticator app to scan the displayed QR code",
  },
  {
    step: 5,
    title: "Verify Setup",
    description: "Enter the 6-digit code from your authenticator app",
  },
  {
    step: 6,
    title: "Save Backup Codes",
    description: "Store the backup codes in a secure location",
  },
];

const apiFeatures = [
  {
    title: "What You Can Do",
    items: [
      "List and filter challenges",
      "Submit flags programmatically",
      "View your profile and stats",
      "Access team information",
      "View leaderboards",
    ],
  },
  {
    title: "Rate Limits",
    items: [
      "Free tier: 60 requests per minute",
      "Pro tier: 120 requests per minute",
      "Elite tier: 300 requests per minute",
      "Flag submissions: 10 per minute",
    ],
  },
];

const apiBestPractices = [
  "Never commit API tokens to public repositories",
  "Use environment variables for token storage",
  "Rotate tokens regularly (every 90 days recommended)",
  "Revoke unused or compromised tokens immediately",
  "Use separate tokens for different applications",
];

const deletionConsequences = [
  {
    title: "What Gets Deleted",
    items: [
      "Your profile and personal information",
      "All API tokens and active sessions",
      "Team memberships (ownership transfers to another member)",
      "Saved preferences and settings",
    ],
  },
  {
    title: "What Stays",
    items: [
      "Your solve history (anonymized)",
      "Submitted flags and scores (anonymized)",
      "Write-ups you've published (if not deleted separately)",
    ],
  },
];

export default function AccountGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container max-w-4xl px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help Center
            </Link>
            <span>/</span>
            <span className="text-foreground">Account Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile, security settings, and account preferences
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-8">
        {/* Profile Settings */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded">
              <User className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Profile Settings</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Your profile information controls how you appear to other users on the platform. 
            Some fields can be edited anytime, while others have restrictions.
          </p>

          <div className="grid gap-3">
            {profileFields.map((field) => (
              <Card key={field.field}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <field.icon className="size-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">{field.field}</h3>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {field.editable}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2">Privacy Note</h4>
            <p className="text-xs text-muted-foreground">
              Your email address is never displayed publicly. Username and display name are always public. 
              You can make your country, bio, and social links private in your privacy settings.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Changing Password */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded">
              <Key className="size-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Changing Your Password</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {securityFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {feature.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Navigate to Settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Go to Dashboard → Settings → Security
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Enter Current Password</h4>
                  <p className="text-xs text-muted-foreground">
                    For security, you must verify your identity with your current password
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Set New Password</h4>
                  <p className="text-xs text-muted-foreground">
                    Enter and confirm your new password (must meet all requirements)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-sm">Save Changes</h4>
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Update Password&quot;. You&apos;ll be logged out of all other sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded">
            <AlertTriangle className="size-5 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Forgot Your Password?</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Use the{" "}
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  password reset page
                </Link>{" "}
                to receive a reset link via email. The link expires after 1 hour for security.
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* MFA Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded">
              <Shield className="size-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Enabling Multi-Factor Authentication (MFA)</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Two-Factor Authentication (2FA) adds an extra layer of security to your account. 
            Even if someone knows your password, they can&apos;t access your account without the second factor.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="size-4 text-primary" />
                  <CardTitle className="text-sm">Authenticator Apps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Recommended method. Compatible apps include:
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Google Authenticator</li>
                  <li>• Authy</li>
                  <li>• Microsoft Authenticator</li>
                  <li>• 1Password</li>
                  <li>• Bitwarden</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  <CardTitle className="text-sm">Security Keys (WebAuthn)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Most secure method using hardware keys:
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• YubiKey</li>
                  <li>• Titan Security Key</li>
                  <li>• SoloKeys</li>
                  <li>• Built-in biometric (Touch ID, Windows Hello)</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-medium mb-4">Setup Steps</h3>
          <div className="space-y-3">
            {mfaSteps.map((step) => (
              <Card key={step.step}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="size-4 text-red-500" />
              Important: Backup Codes
            </h4>
            <p className="text-xs text-muted-foreground">
              When you enable 2FA, you&apos;ll receive 10 backup codes. These are single-use codes that 
              can access your account if you lose your authenticator device. Store them securely 
              (e.g., in a password manager or printed in a safe place). If you lose both your 
              2FA device and backup codes, account recovery may take several days.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* API Tokens */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded">
              <Key className="size-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Managing API Tokens</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            API tokens allow you to interact with the platform programmatically. 
            Use them to build tools, scripts, or integrations with the CTF Platform API.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {apiFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {feature.items.map((item, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-sm">Creating a New Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Go to API Settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Dashboard → Settings → API Tokens
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Generate Token</h4>
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Create New Token&quot;, give it a descriptive name (e.g., &quot;CTF CLI Tool&quot;)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Copy Immediately</h4>
                  <p className="text-xs text-muted-foreground">
                    The token is only shown once. Copy it and store it securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted rounded p-4 mb-6">
            <h4 className="font-medium text-sm mb-3">Security Best Practices</h4>
            <ul className="space-y-2">
              {apiBestPractices.map((practice, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Shield className="size-3 mt-0.5 text-primary flex-shrink-0" />
                  {practice}
                </li>
              ))}
            </ul>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Example API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded p-3 font-mono text-xs overflow-x-auto">
                <code className="text-green-400"># List all challenges</code>
                <br />
                <code className="text-foreground">
                  curl -H <span className="text-yellow-400">&quot;Authorization: Bearer YOUR_TOKEN&quot;</span>{" "}
                  https://api.ctfplatform.com/v1/challenges
                </code>
                <br />
                <br />
                <code className="text-green-400"># Submit a flag</code>
                <br />
                <code className="text-foreground">
                  curl -X POST -H <span className="text-yellow-400">&quot;Authorization: Bearer YOUR_TOKEN&quot;</span>{" "}
                  -d <span className="text-yellow-400">&quot;flag=CTF&#123;...&#125;&quot;</span>{" "}
                  https://api.ctfplatform.com/v1/challenges/web-101/submit
                </code>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Account Deletion */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded">
              <Trash2 className="size-5 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Account Deletion</h2>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-5 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-sm text-red-500">Warning: This Cannot Be Undone</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Account deletion is permanent and irreversible. All your personal data will be removed. 
                  Make sure you understand the consequences before proceeding.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {deletionConsequences.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        {section.title === "What Gets Deleted" ? (
                          <Trash2 className="size-3 mt-0.5 text-red-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Delete Your Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-medium text-red-500">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Go to Account Settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Dashboard → Settings → Account → Delete Account
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-medium text-red-500">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Review Consequences</h4>
                  <p className="text-xs text-muted-foreground">
                    Read through what will be deleted and what will be retained
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-medium text-red-500">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Confirm Identity</h4>
                  <p className="text-xs text-muted-foreground">
                    Enter your password and 2FA code (if enabled) to verify ownership
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-medium text-red-500">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-sm">Type Confirmation</h4>
                  <p className="text-xs text-muted-foreground">
                    Type &quot;DELETE MY ACCOUNT&quot; to confirm you understand this is permanent
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-sm font-medium text-red-500">
                  5
                </div>
                <div>
                  <h4 className="font-medium text-sm">Grace Period</h4>
                  <p className="text-xs text-muted-foreground">
                    Your account enters a 7-day grace period. Log in during this time to cancel deletion. 
                    After 7 days, deletion is permanent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-start gap-3 p-4 bg-muted rounded">
            <AlertCircle className="size-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              If you&apos;re experiencing issues with the platform, consider contacting support first. 
              We&apos;re here to help and many problems can be resolved without account deletion.
            </p>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/challenges">
              ← Challenges Guide
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/teams">
              Teams Guide →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
