import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Rocket,
  Flag,
  User,
  CreditCard,
  Users,
  ChevronDown,
  Mail,
  MessageSquare,
  ExternalLink,
  BookOpen,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | CTF Platform",
  description: "Find answers to your questions about CTF Platform. Browse documentation, FAQs, and get support.",
};

const quickLinks = [
  {
    title: "Getting Started",
    description: "New to CTF? Learn the basics and complete your first challenge.",
    icon: Rocket,
    href: "/help/getting-started",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Challenges",
    description: "Understanding challenge types, difficulty levels, and scoring.",
    icon: Flag,
    href: "/help/challenges",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Account",
    description: "Manage your profile, security settings, and API tokens.",
    icon: User,
    href: "/help/account",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Billing",
    description: "Subscriptions, upgrades, refunds, and payment information.",
    icon: CreditCard,
    href: "/help/billing",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Teams",
    description: "Create teams, invite members, and collaborate effectively.",
    icon: Users,
    href: "/help/teams",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

const faqs = [
  {
    question: "What is a CTF competition?",
    answer: "Capture The Flag (CTF) is a cybersecurity competition where participants solve security-related challenges to find hidden flags (text strings). These challenges test skills in areas like cryptography, web exploitation, reverse engineering, binary exploitation, and forensics. It's a fun and educational way to improve your security skills.",
  },
  {
    question: "Do I need prior experience to participate?",
    answer: "Not at all! We have challenges for all skill levels, from complete beginners to seasoned professionals. Our Getting Started guide will help you understand the basics, and our beginner challenges are designed to teach you fundamental concepts while you play.",
  },
  {
    question: "How does dynamic scoring work?",
    answer: "Dynamic scoring means challenge points decrease as more people solve them. The first solvers get the maximum points, and the point value gradually decreases to a minimum floor. This rewards early solvers and keeps the competition exciting throughout the event.",
  },
  {
    question: "What are container instances?",
    answer: "Container instances are isolated, temporary environments where you can safely exploit vulnerabilities. When you start a challenge with a container, you get your own private instance to hack. These containers are spun down after a period of inactivity or when you manually stop them.",
  },
  {
    question: "Can I compete in a team?",
    answer: "Yes! You can create a team or join an existing one. Team members can collaborate on challenges and share a combined score. Team challenges and competitions are a great way to learn from others and tackle harder problems together.",
  },
  {
    question: "Is there a free tier?",
    answer: "Absolutely! Our Free tier gives you access to a wide selection of challenges and all basic features. Pro and Elite tiers unlock additional challenges, extended container times, priority support, and other advanced features.",
  },
  {
    question: "How do I submit a flag?",
    answer: "Once you find a flag (typically in the format CTF{...}), navigate to the challenge page and enter it in the flag submission box. If correct, you'll receive points immediately. If incorrect, you can try again (with a small cooldown period to prevent brute forcing).",
  },
  {
    question: "What happens if I get stuck on a challenge?",
    answer: "We recommend taking breaks, trying different approaches, and using external resources to learn. Many challenges have hints available. You can also discuss general concepts (not specific solutions) with the community or your teammates.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="mr-1 size-3" />
              Documentation
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              How can we help?
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Search our documentation, browse FAQs, or contact our support team
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  className="pl-10 h-12 text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">/</kbd> to focus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">Browse by Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer">
                <CardHeader>
                  <div className={`w-10 h-10 rounded ${link.bgColor} flex items-center justify-center mb-3`}>
                    <link.icon className={`size-5 ${link.color}`} />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {link.title}
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}

          {/* Discord/Community Card */}
          <Card className="h-full border-dashed hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center mb-3">
                <MessageSquare className="size-5 text-indigo-500" />
              </div>
              <CardTitle className="text-base">Community Discord</CardTitle>
              <CardDescription>
                Join our Discord server to connect with other hackers and get help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ExternalLink className="ml-2 size-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto max-w-3xl px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Quick answers to common questions
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Collapsible key={index}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-left">
                        {faq.question}
                      </CardTitle>
                      <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </section>

      <Separator />

      {/* Contact Support Section */}
      <section id="contact" className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-muted-foreground">
            Our support team is here to assist you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="size-5 text-primary" />
              </div>
              <CardTitle className="text-base">Email Support</CardTitle>
              <CardDescription>
                Get a response within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:support@ctfplatform.com">
                  support@ctfplatform.com
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="size-5 text-indigo-500" />
              </div>
              <CardTitle className="text-base">Discord Community</CardTitle>
              <CardDescription>
                Chat with our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Join Server
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <Terminal className="size-5 text-amber-500" />
              </div>
              <CardTitle className="text-base">Bug Reports</CardTitle>
              <CardDescription>
                Report technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:bugs@ctfplatform.com">
                  bugs@ctfplatform.com
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Hours */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Pro & Elite members receive priority support with faster response times.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" />
              <span className="font-semibold">CTF Platform Help</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/help" className="hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="/help/getting-started" className="hover:text-foreground transition-colors">
                Getting Started
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
