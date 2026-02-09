import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Check,
  X,
  Zap,
  Crown,
  Star,
  ArrowRight,
  RefreshCw,
  Ban,
  RotateCcw,
  Shield,
  Clock,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Billing & Subscriptions | CTF Platform Help",
  description: "Learn about subscription tiers, upgrading, managing billing, and refund policies.",
};

const tiers = [
  {
    name: "Free",
    icon: Star,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with CTFs",
    features: [
      { text: "Access to 100+ free challenges", included: true },
      { text: "Basic container instances (30 min)", included: true },
      { text: "Global and category leaderboards", included: true },
      { text: "Join public teams", included: true },
      { text: "Community Discord access", included: true },
      { text: "Email support", included: false },
      { text: "Extended container time", included: false },
      { text: "Priority support", included: false },
      { text: "Exclusive Pro challenges", included: false },
      { text: "Advanced analytics", included: false },
    ],
    cta: "Current Plan",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    price: "$9.99",
    period: "/month",
    description: "For serious hackers who want more",
    popular: true,
    features: [
      { text: "All Free tier features", included: true },
      { text: "200+ additional challenges", included: true },
      { text: "Extended containers (2 hours)", included: true },
      { text: "5 concurrent containers", included: true },
      { text: "Teams up to 15 members", included: true },
      { text: "Priority email support (24h)", included: true },
      { text: "API rate limit: 120/min", included: true },
      { text: "Advanced progress analytics", included: true },
      { text: "Custom profile themes", included: true },
      { text: "Exclusive Pro leaderboards", included: true },
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "default" as const,
  },
  {
    name: "Elite",
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    price: "$29.99",
    period: "/month",
    description: "Ultimate experience for professionals",
    features: [
      { text: "All Pro tier features", included: true },
      { text: "500+ Elite-only challenges", included: true },
      { text: "Unlimited container time", included: true },
      { text: "10 concurrent containers", included: true },
      { text: "Teams up to 50 members", included: true },
      { text: "Priority chat support (4h)", included: true },
      { text: "API rate limit: 300/min", included: true },
      { text: "Early access to new features", included: true },
      { text: "Custom team branding", included: true },
      { text: "1-on-1 mentorship sessions", included: true },
    ],
    cta: "Upgrade to Elite",
    ctaVariant: "outline" as const,
  },
];

const upgradeSteps = [
  {
    step: 1,
    title: "Choose Your Plan",
    description: "Visit the pricing page to compare features and select the tier that fits your needs.",
  },
  {
    step: 2,
    title: "Enter Payment Details",
    description: "We accept credit/debit cards via Stripe. Your payment information is securely encrypted.",
  },
  {
    step: 3,
    title: "Instant Access",
    description: "Your account is upgraded immediately. Access new challenges and features right away.",
  },
];

const managementFeatures = [
  {
    title: "View Billing History",
    description: "Access all past invoices and payment receipts",
    icon: CreditCard,
  },
  {
    title: "Update Payment Method",
    description: "Change your card or add a backup payment method",
    icon: RefreshCw,
  },
  {
    title: "Download Invoices",
    description: "Get PDF invoices for expense reports or reimbursement",
    icon: CreditCard,
  },
  {
    title: "Update Billing Info",
    description: "Change your billing address and company details",
    icon: Shield,
  },
];

const cancellationInfo = [
  {
    title: "What Happens When You Cancel",
    items: [
      "You keep Pro/Elite access until the end of your billing period",
      "No new charges will occur after cancellation",
      "Your team membership remains active (if under tier limits)",
      "Your solve history and progress are preserved",
    ],
  },
  {
    title: "What You'll Lose",
    items: [
      "Access to paid challenges after the billing period ends",
      "Extended container time limits",
      "Higher API rate limits",
      "Priority support access",
    ],
  },
];

const refundPolicy = [
  {
    period: "Within 7 days",
    eligibility: "Full refund if you haven't used paid features extensively",
    action: "Automatic upon request",
  },
  {
    period: "Within 30 days",
    eligibility: "Prorated refund based on usage",
    action: "Manual review required",
  },
  {
    period: "After 30 days",
    eligibility: "Generally not eligible unless technical issues",
    action: "Case-by-case basis",
  },
];

const faqs = [
  {
    question: "Can I switch between plans?",
    answer: "Yes! You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate applies at the next billing cycle.",
  },
  {
    question: "Is there a student discount?",
    answer: "Yes! Students with a valid .edu email can get 50% off Pro and Elite plans. Contact support with proof of enrollment to apply the discount.",
  },
  {
    question: "Can I pay annually?",
    answer: "Yes, annual billing is available with a 20% discount compared to monthly payments. Select 'Annual' during checkout.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express, Discover) through Stripe. PayPal is not currently supported.",
  },
  {
    question: "Will my subscription auto-renew?",
    answer: "Yes, subscriptions auto-renew by default to ensure uninterrupted access. You can disable auto-renew at any time in your billing settings.",
  },
  {
    question: "What happens to my team if I downgrade?",
    answer: "If your team exceeds the member limit of your new tier, you'll need to remove members or the team owner must upgrade. The team won't be automatically disbanded.",
  },
];

export default function BillingGuidePage() {
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
            <span className="text-foreground">Billing & Subscriptions</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about plans, payments, and account management
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-8">
        {/* Tier Comparison */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded">
              <CreditCard className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Subscription Tiers</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Choose the plan that fits your learning goals. Upgrade anytime as you progress.
          </p>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? "border-blue-500/50" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${tier.bgColor}`}>
                        <tier.icon className={`size-5 ${tier.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          {tier.popular && (
                            <Badge variant="default" className="text-xs">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs">
                          {tier.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{tier.price}</div>
                      <div className="text-xs text-muted-foreground">{tier.period}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="size-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="size-4 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${feature.included ? "" : "text-muted-foreground/50"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant={tier.ctaVariant}
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href="/pricing">
                        {tier.cta}
                        {tier.ctaVariant === "default" && <ArrowRight className="ml-2 size-3" />}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* How to Upgrade */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded">
              <Zap className="size-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">How to Upgrade</h2>
          </div>

          <div className="space-y-3">
            {upgradeSteps.map((step) => (
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

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="size-4 text-blue-500" />
                Secure Payments
              </h4>
              <p className="text-xs text-muted-foreground">
                All payments are processed securely through Stripe. We never store your 
                full credit card details on our servers.
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <RotateCcw className="size-4 text-green-500" />
                Easy Cancellation
              </h4>
              <p className="text-xs text-muted-foreground">
                Cancel anytime with no questions asked. Your access continues until 
                the end of your billing period.
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Managing Subscriptions */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded">
              <RefreshCw className="size-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Managing Your Subscription</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Access all your billing information and manage your subscription from the 
            Dashboard → Subscription page.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {managementFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <feature.icon className="size-4 text-primary" />
                    <CardTitle className="text-sm">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Subscription Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Billing Cycle</h4>
                  <p className="text-xs text-muted-foreground">
                    View your next billing date and amount. Change from monthly to annual 
                    (or vice versa) to adjust your billing cycle.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Auto-Renewal</h4>
                  <p className="text-xs text-muted-foreground">
                    Toggle automatic renewal on or off. Disabling auto-renew means your 
                    subscription will expire at the end of the current period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Cancellation Policy */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded">
              <Ban className="size-5 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Cancellation Policy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {cancellationInfo.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="size-3 mt-0.5 text-primary flex-shrink-0" />
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
              <CardTitle className="text-sm">How to Cancel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Go to Subscription Settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Dashboard → Subscription → Manage
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Click Cancel Subscription</h4>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll be asked to confirm your decision
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Confirm Cancellation</h4>
                  <p className="text-xs text-muted-foreground">
                    Your subscription remains active until the end date shown
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500" />
              Reactivation
            </h4>
            <p className="text-xs text-muted-foreground">
              You can reactivate your subscription at any time before or after it expires. 
              If you reactivate within 30 days of expiration, your progress and settings 
              are fully preserved. After 30 days, some data may be archived.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Refund Policy */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded">
              <RotateCcw className="size-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Refund Policy</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            We want you to be satisfied with your subscription. Our refund policy is designed 
            to be fair while preventing abuse.
          </p>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {refundPolicy.map((policy, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-24">
                      <Badge variant="outline" className="text-xs w-full justify-center">
                        {policy.period}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{policy.eligibility}</p>
                      <p className="text-xs text-muted-foreground mt-1">{policy.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm">Refund Eligibility Factors</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="size-3 mt-0.5 text-green-500" />
                <span>
                  <strong>Unused period:</strong> You haven&apos;t actively used the service during the refund period
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-3 mt-0.5 text-green-500" />
                <span>
                  <strong>Technical issues:</strong> Platform was unavailable or features didn&apos;t work as advertised
                </span>
              </li>
              <li className="flex items-start gap-2">
                <X className="size-3 mt-0.5 text-red-500" />
                <span>
                  <strong>Not eligible:</strong> Excessive usage, multiple refund requests, or violations of ToS
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-muted rounded p-4">
            <h4 className="font-medium text-sm mb-2">Requesting a Refund</h4>
            <p className="text-xs text-muted-foreground mb-3">
              To request a refund, contact support with:
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Your account email address</li>
              <li>• Date of purchase</li>
              <li>• Reason for refund request</li>
              <li>• Any relevant details (error messages, etc.)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Refunds are typically processed within 5-10 business days to your original payment method.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* FAQs */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded">
              <HelpCircle className="size-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-sm">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>
                Our billing support team is here to help with any subscription or payment questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" asChild>
                  <a href="mailto:billing@ctfplatform.com">
                    Contact Billing Support
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help#contact">
                    General Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/teams">
              ← Teams Guide
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              Back to Help Center ↑
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
