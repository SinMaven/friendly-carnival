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

import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  Flag,
  UserPlus,
  Target,
  LayoutDashboard,
  Trophy,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Terminal,
  Shield,
  Lock,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Getting Started | CTF Platform Help",
  description: "New to CTF? Learn the basics, register, and complete your first challenge.",
};

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up with your email or use OAuth providers like Google or GitHub.",
    icon: UserPlus,
    tips: [
      "Choose a unique username - this will be your public identity on the platform",
      "Use a strong, unique password",
      "Verify your email to unlock all features",
    ],
  },
  {
    number: "02",
    title: "Explore the Dashboard",
    description: "Get familiar with your personal dashboard and available features.",
    icon: LayoutDashboard,
    tips: [
      "View your stats, rank, and recent activity",
      "Track your progress across challenge categories",
      "Access your team information and settings",
    ],
  },
  {
    number: "03",
    title: "Choose Your First Challenge",
    description: "Start with beginner-friendly challenges to learn the ropes.",
    icon: Target,
    tips: [
      "Look for challenges tagged 'Beginner' or 'Easy'",
      "Read the challenge description carefully",
      "Check if hints are available",
    ],
  },
  {
    number: "04",
    title: "Find the Flag",
    description: "Solve the challenge and locate the hidden flag string.",
    icon: Flag,
    tips: [
      "Flags typically follow the format: CTF{some_text_here}",
      "Take notes as you work through the challenge",
      "Don't be afraid to research and learn new concepts",
    ],
  },
  {
    number: "05",
    title: "Submit and Score",
    description: "Submit the flag to earn points and climb the leaderboard.",
    icon: Trophy,
    tips: [
      "Submit flags through the challenge page",
      "Points are awarded immediately for correct submissions",
      "Dynamic scoring means early solves get more points",
    ],
  },
];

const whatIsCTF = [
  {
    title: "The Concept",
    description: "Capture The Flag (CTF) competitions are cybersecurity challenges where participants find hidden 'flags' by exploiting vulnerabilities, solving puzzles, or analyzing data.",
    icon: Flag,
  },
  {
    title: "Learning by Doing",
    description: "CTFs provide hands-on experience with real-world security scenarios. You'll learn practical skills that translate directly to cybersecurity careers.",
    icon: Lightbulb,
  },
  {
    title: "Safe Environment",
    description: "Our platform provides isolated, legal environments to practice hacking techniques without risking real systems or breaking laws.",
    icon: Shield,
  },
];

const dashboardFeatures = [
  {
    title: "Challenges",
    description: "Browse all available challenges, filter by category and difficulty, and track your progress.",
  },
  {
    title: "Leaderboard",
    description: "See how you rank against other players globally or within your team.",
  },
  {
    title: "Team Hub",
    description: "Manage your team membership, view team stats, and collaborate with teammates.",
  },
  {
    title: "Profile",
    description: "Customize your public profile, view your solve history, and showcase your achievements.",
  },
  {
    title: "Settings",
    description: "Update your account information, manage security settings, and configure preferences.",
  },
];

const scoringInfo = [
  {
    title: "Points System",
    content: "Each challenge is worth a certain number of points based on its difficulty. Harder challenges are worth more points.",
  },
  {
    title: "Dynamic Scoring",
    content: "As more people solve a challenge, its point value decreases. This rewards players who solve challenges early.",
  },
  {
    title: "Ranking",
    content: "Your rank is determined by your total points. Tiebreakers are based on the time of your most recent solve.",
  },
  {
    title: "Categories",
    content: "Track your progress in specific categories like Web, Crypto, Pwn, Reversing, and Forensics.",
  },
];

export default function GettingStartedPage() {
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
            <span className="text-foreground">Getting Started</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Getting Started Guide</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know to begin your CTF journey
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-8">
        {/* What is CTF Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded">
              <Flag className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">What is a CTF?</h2>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="text-muted-foreground leading-relaxed">
              Capture The Flag competitions are the best way to learn cybersecurity hands-on. 
              Originating from the hacker community, CTFs challenge you to solve security puzzles, 
              exploit vulnerabilities, and find hidden flags in a safe, legal environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {whatIsCTF.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <item.icon className="size-5 text-primary mb-2" />
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Registration Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded">
              <UserPlus className="size-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">How to Register</h2>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit the Signup Page</h3>
                    <p className="text-sm text-muted-foreground">
                      Go to{" "}
                      <Link href="/signup" className="text-primary hover:underline">
                        /signup
                      </Link>{" "}
                      or click the &quot;Sign Up&quot; button on the homepage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Fill in Your Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your email, choose a username, and set a secure password. 
                      Your username will be visible to other users.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Verify Your Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your inbox for a verification link. Click it to activate your account 
                      and unlock all features.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Add optional profile information like your country, bio, and social links 
                      to connect with the community.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded p-4 flex gap-3">
            <AlertCircle className="size-5 text-amber-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Account Security Tip</h4>
              <p className="text-xs text-muted-foreground mt-1">
                We strongly recommend enabling Two-Factor Authentication (2FA) in your account 
                settings after registration for added security.
              </p>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* First Challenge Walkthrough */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded">
              <Target className="size-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Your First Challenge Walkthrough</h2>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <Card key={step.number}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold text-muted-foreground">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon className="size-4 text-primary" />
                        <CardTitle className="text-base">{step.title}</CardTitle>
                      </div>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-16">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                      Tips:
                    </h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="size-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button asChild>
              <Link href="/dashboard/challenges">
                Browse Challenges
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Dashboard Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded">
              <LayoutDashboard className="size-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Understanding the Dashboard</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Your dashboard is command central for your CTF journey. Here&apos;s what you can do:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {dashboardFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Points and Ranking Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded">
              <Trophy className="size-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Earning Points & Ranking</h2>
          </div>

          <div className="grid gap-4">
            {scoringInfo.map((info) => (
              <Card key={info.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{info.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-muted rounded p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Terminal className="size-4" />
              Example Scoring
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Challenge:</span> Web Exploitation 101
              </p>
              <p>
                <span className="font-medium text-foreground">Base Points:</span> 100
              </p>
              <p>
                <span className="font-medium text-foreground">First Solver:</span> Gets 100 points
              </p>
              <p>
                <span className="font-medium text-foreground">50th Solver:</span> Gets ~70 points (dynamic decay)
              </p>
              <p>
                <span className="font-medium text-foreground">Minimum Points:</span> 25 points (floor value)
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Ready to Dive Deeper?</CardTitle>
              <CardDescription>
                Explore our detailed guides to master the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help/challenges">
                    <Target className="mr-2 size-4" />
                    Challenge Guide
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help/teams">
                    <Users className="mr-2 size-4" />
                    Teams Guide
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/help/account">
                    <Lock className="mr-2 size-4" />
                    Account Security
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              ← Back to Help Center
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/challenges">
              Challenges Guide →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
