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
import { Progress } from "@/components/ui/progress";
import {
  Flag,
  Globe,
  Lock,
  Binary,
  FileSearch,
  Server,
  Terminal,
  TrendingDown,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Cpu,
  Wifi,
  Shield,
  Code,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Challenges Guide | CTF Platform Help",
  description: "Learn about challenge categories, difficulty levels, flag submission, dynamic scoring, and container instances.",
};

const categories = [
  {
    id: "web",
    name: "Web Exploitation",
    description: "Exploit vulnerabilities in web applications. SQL injection, XSS, CSRF, authentication bypasses, and more.",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    skills: ["HTTP protocols", "JavaScript", "SQL", "Server-side logic"],
    difficulty: "Beginner to Expert",
  },
  {
    id: "crypto",
    name: "Cryptography",
    description: "Break encryption schemes, decode ciphers, and find weaknesses in cryptographic implementations.",
    icon: Lock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    skills: ["Math", "Encoding schemes", "Classic ciphers", "Modern crypto"],
    difficulty: "Intermediate to Expert",
  },
  {
    id: "pwn",
    name: "Binary Exploitation (Pwn)",
    description: "Exploit binary programs through memory corruption, buffer overflows, and ROP chains.",
    icon: Binary,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    skills: ["Assembly", "C/C++", "Memory management", "Debuggers"],
    difficulty: "Intermediate to Expert",
  },
  {
    id: "reverse",
    name: "Reverse Engineering",
    description: "Analyze compiled programs to understand their behavior and extract hidden information.",
    icon: Code,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    skills: ["Assembly", "Decompilers", "Static analysis", "Dynamic analysis"],
    difficulty: "Intermediate to Expert",
  },
  {
    id: "forensics",
    name: "Forensics",
    description: "Analyze files, network traffic, memory dumps, and disk images to find evidence and hidden data.",
    icon: FileSearch,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    skills: ["File formats", "Network protocols", "Data recovery", "Steganography"],
    difficulty: "Beginner to Expert",
  },
  {
    id: "misc",
    name: "Miscellaneous",
    description: "Everything else! OSINT, programming challenges, esoteric languages, and creative puzzles.",
    icon: Zap,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    skills: ["Python", "Research", "Creative thinking", "Various tools"],
    difficulty: "Beginner to Intermediate",
  },
];

const difficultyLevels = [
  {
    level: "Beginner",
    color: "bg-green-500",
    textColor: "text-green-500",
    description: "Perfect for newcomers. Requires basic understanding of the category fundamentals.",
    timeEstimate: "15-60 minutes",
  },
  {
    level: "Easy",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    description: "Straightforward challenges that test your understanding of core concepts.",
    timeEstimate: "30-90 minutes",
  },
  {
    level: "Medium",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    description: "Requires deeper knowledge and the ability to combine multiple techniques.",
    timeEstimate: "1-3 hours",
  },
  {
    level: "Hard",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    description: "Complex challenges that require advanced skills and creative problem-solving.",
    timeEstimate: "3-6 hours",
  },
  {
    level: "Expert",
    color: "bg-red-500",
    textColor: "text-red-500",
    description: "Extremely difficult challenges for seasoned professionals. May take days.",
    timeEstimate: "6+ hours",
  },
];

const flagSubmissionSteps = [
  {
    title: "Find the Flag",
    description: "Complete the challenge and locate the flag string. Flags usually follow the format CTF{...}",
    icon: Flag,
  },
  {
    title: "Navigate to Challenge",
    description: "Go back to the challenge page on the platform where you started.",
    icon: Globe,
  },
  {
    title: "Enter the Flag",
    description: "Paste the complete flag string in the submission box. Be careful with typos!",
    icon: Terminal,
  },
  {
    title: "Submit",
    description: "Click submit. If correct, you'll see a success message and receive points immediately.",
    icon: CheckCircle,
  },
];

const containerFeatures = [
  {
    title: "Isolated Environment",
    description: "Each container is completely isolated from other users and the host system.",
    icon: Shield,
  },
  {
    title: "Pre-configured Tools",
    description: "Containers come with common tools pre-installed for your convenience.",
    icon: Terminal,
  },
  {
    title: "Temporary Storage",
    description: "Files in containers are temporary. Download anything you want to keep.",
    icon: Clock,
  },
  {
    title: "Network Access",
    description: "Access containers via web browser or direct SSH when available.",
    icon: Wifi,
  },
];

export default function ChallengesGuidePage() {
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
            <span className="text-foreground">Challenges Guide</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Guide</h1>
          <p className="text-muted-foreground mt-2">
            Everything you need to know about solving challenges
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded">
              <Flag className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Challenge Categories</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Our challenges are organized into categories based on the type of security skill being tested. 
            Each category focuses on different aspects of cybersecurity.
          </p>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded ${category.bgColor} flex-shrink-0`}>
                      <category.icon className={`size-5 ${category.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {category.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-14">
                    <p className="text-xs text-muted-foreground mb-2">Key skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Difficulty Levels */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded">
              <TrendingDown className="size-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Difficulty Levels</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Each challenge is rated by difficulty to help you find appropriate challenges for your skill level.
          </p>

          <div className="space-y-4">
            {difficultyLevels.map((diff) => (
              <Card key={diff.level}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${diff.color} mt-1.5`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-medium ${diff.textColor}`}>{diff.level}</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {diff.timeEstimate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{diff.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Flag Submission */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded">
              <CheckCircle className="size-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">How to Submit Flags</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {flagSubmissionSteps.map((step, index) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <step.icon className="size-4 text-primary" />
                      <CardTitle className="text-sm">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500" />
              Important Notes
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Flag format is typically <code className="bg-background px-1.5 py-0.5 rounded text-xs">CTF{'{'}...{'}'}</code> unless specified otherwise
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Incorrect submissions have a short cooldown period to prevent brute-forcing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                Flags are case-sensitive - enter them exactly as found
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                You can submit the same flag multiple times (only first counts for points)
              </li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Dynamic Scoring */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded">
              <TrendingDown className="size-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Dynamic Scoring Explained</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Dynamic scoring keeps competitions exciting by rewarding early solvers. 
                As more people solve a challenge, its point value decreases.
              </p>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-sm">Scoring Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="block bg-muted p-3 rounded text-xs font-mono">
                    points = max_points - ((max_points - min_points) * (solves / expected_solves))
                  </code>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">First solver gets:</span>
                  <span className="font-medium">100% of base points</span>
                </div>
                <Progress value={100} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">25th solver gets:</span>
                  <span className="font-medium">~75% of base points</span>
                </div>
                <Progress value={75} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">100th solver gets:</span>
                  <span className="font-medium">~50% of base points</span>
                </div>
                <Progress value={50} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Floor value:</span>
                  <span className="font-medium">Minimum 20% of base points</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Example Scenario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                    <span className="text-sm font-medium">First Blood</span>
                    <Badge variant="default">500 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded">
                    <span className="text-sm">After 20 solves</span>
                    <Badge variant="secondary">375 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded">
                    <span className="text-sm">After 50 solves</span>
                    <Badge variant="secondary">250 pts</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm text-muted-foreground">Floor value</span>
                    <Badge variant="outline">100 pts</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded p-4">
                <h4 className="font-medium text-sm mb-2">Pro Tip</h4>
                <p className="text-xs text-muted-foreground">
                  Focus on newer challenges or categories with fewer solves to maximize your points. 
                  Check the solve count on each challenge card before starting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Container Instances */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded">
              <Server className="size-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Container Instances</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Some challenges provide isolated container environments for hands-on exploitation. 
            These are temporary, private instances that you control.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {containerFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded flex-shrink-0">
                  <feature.icon className="size-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">How to Use Containers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-sm">Start the Instance</h4>
                  <p className="text-xs text-muted-foreground">
                    Click the &quot;Start Instance&quot; button on the challenge page. 
                    Wait 10-30 seconds for the container to spin up.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-sm">Access the Service</h4>
                  <p className="text-xs text-muted-foreground">
                    Use the provided connection details (URL, port, or browser-based terminal) 
                    to interact with the challenge.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-sm">Solve & Stop</h4>
                  <p className="text-xs text-muted-foreground">
                    After solving, submit the flag and click &quot;Stop Instance&quot; to free up resources. 
                    Containers auto-stop after 2 hours of inactivity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-muted rounded p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Cpu className="size-4" />
                Resource Limits
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• 1-2 CPU cores per instance</li>
                <li>• 512MB - 2GB RAM depending on challenge</li>
                <li>• 30 minutes - 2 hour timeout</li>
                <li>• 1-3 concurrent instances per user (by tier)</li>
              </ul>
            </div>
            <div className="bg-muted rounded p-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="size-4" />
                Security Notes
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• No outbound internet from containers</li>
                <li>• Containers are destroyed on stop</li>
                <li>• No persistence between sessions</li>
                <li>• Shared challenges reset on each start</li>
              </ul>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Downloading Files */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-500/10 rounded">
              <Download className="size-5 text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold">Downloading Challenge Files</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Static Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Many challenges provide files for local analysis:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Download className="size-3 mt-0.5 text-primary" />
                    Click the download link on the challenge page
                  </li>
                  <li className="flex items-start gap-2">
                    <Terminal className="size-3 mt-0.5 text-primary" />
                    Use <code className="bg-muted px-1 rounded">wget</code> or{" "}
                    <code className="bg-muted px-1 rounded">curl</code> with the provided URL
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-primary" />
                    Verify file integrity using provided hashes
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Docker Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Some challenges provide Docker images:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Terminal className="size-3 mt-0.5 text-primary" />
                    Download the <code className="bg-muted px-1 rounded">docker-compose.yml</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <Play className="size-3 mt-0.5 text-primary" />
                    Run <code className="bg-muted px-1 rounded">docker-compose up</code>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="size-3 mt-0.5 text-primary" />
                    Access the challenge locally at the specified port
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2">File Safety</h4>
            <p className="text-xs text-muted-foreground">
              All downloadable files are scanned for malware, but you should still exercise caution. 
              Always analyze unknown files in isolated environments like virtual machines or containers. 
              Never run untrusted binaries directly on your host system.
            </p>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/getting-started">
              ← Getting Started
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/account">
              Account Guide →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
