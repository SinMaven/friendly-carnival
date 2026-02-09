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
  Users,
  Plus,
  UserPlus,
  Crown,
  Shield,
  User,
  Mail,
  Link2,
  LogOut,
  CheckCircle,
  AlertCircle,
  Trophy,
  Target,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Teams Guide | CTF Platform Help",
  description: "Learn how to create teams, join teams, manage roles, invites, and collaborate effectively.",
};

const teamBenefits = [
  {
    title: "Collaborative Solving",
    description: "Work together on difficult challenges, share insights, and learn from teammates.",
    icon: Target,
  },
  {
    title: "Combined Leaderboard",
    description: "Team scores are aggregated, competing as a group against other teams.",
    icon: Trophy,
  },
  {
    title: "Shared Resources",
    description: "Access shared notes, tools, and challenge progress within your team.",
    icon: MessageSquare,
  },
  {
    title: "Team-Only Competitions",
    description: "Some events and challenges are exclusive to team participation.",
    icon: Shield,
  },
];

const roles = [
  {
    name: "Owner",
    badge: "bg-red-500/10 text-red-500",
    icon: Crown,
    description: "Full control over the team. Can manage members, settings, and delete the team.",
    permissions: [
      "Transfer ownership",
      "Delete team",
      "Manage all members",
      "Edit team settings",
      "Manage invites",
      "View all team activity",
    ],
  },
  {
    name: "Admin",
    badge: "bg-blue-500/10 text-blue-500",
    icon: Shield,
    description: "Can manage members and invites but cannot delete the team or transfer ownership.",
    permissions: [
      "Invite new members",
      "Remove members (except Owner)",
      "Edit team info",
      "Manage team visibility",
      "View team activity",
    ],
  },
  {
    name: "Member",
    badge: "bg-green-500/10 text-green-500",
    icon: User,
    description: "Regular team member. Can solve challenges and view team progress.",
    permissions: [
      "Solve challenges for the team",
      "View team leaderboard position",
      "See team member activity",
      "Leave the team",
    ],
  },
];

const createSteps = [
  {
    step: 1,
    title: "Navigate to Teams",
    description: "Go to Dashboard → Team or click 'Create Team' if you're not in a team.",
  },
  {
    step: 2,
    title: "Choose Team Name",
    description: "Pick a unique name (3-32 characters). This can be changed later.",
  },
  {
    step: 3,
    title: "Set Visibility",
    description: "Choose between Public (searchable) or Private (invite-only).",
  },
  {
    step: 4,
    title: "Add Description",
    description: "Optional: Add a team description and website URL.",
  },
  {
    step: 5,
    title: "Create & Invite",
    description: "Your team is ready! Now invite members to join.",
  },
];

const joinMethods = [
  {
    method: "Invite Link",
    description: "Click an invite link shared by a team member",
    steps: [
      "Receive invite link from team member",
      "Click the link or visit /team/join?code=XXX",
      "Review team details",
      "Click 'Join Team'",
    ],
  },
  {
    method: "Direct Invite",
    description: "Accept a direct email or username invite",
    steps: [
      "Check notifications or email for invite",
      "Click 'View Invite'",
      "Review team details",
      "Click 'Accept Invite'",
    ],
  },
  {
    method: "Public Teams",
    description: "Search and join public teams",
    steps: [
      "Go to Dashboard → Team → Find Teams",
      "Search for teams by name",
      "Click on a team to view details",
      "Click 'Request to Join'",
      "Wait for admin approval",
    ],
  },
];

const inviteMethods = [
  {
    type: "Invite Link",
    description: "Generate a shareable link that anyone can use",
    pros: ["Easy to share in group chats", "No email required", "Can set expiration"],
    cons: ["Link could be shared outside intended group", "Less control over who joins"],
  },
  {
    type: "Email Invite",
    description: "Send invitation to specific email addresses",
    pros: ["Targeted invites", "Automatic notifications", "Can add personal message"],
    cons: ["Requires knowing email addresses", "Emails might go to spam"],
  },
  {
    type: "Username Invite",
    description: "Invite existing platform users by username",
    pros: ["Direct to existing users", "Instant notification", "No email needed"],
    cons: ["User must already have an account", "Requires exact username"],
  },
];

export default function TeamsGuidePage() {
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
            <span className="text-foreground">Teams Guide</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Teams Guide</h1>
          <p className="text-muted-foreground mt-2">
            Collaborate, compete, and conquer challenges together
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 py-8">
        {/* Benefits Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded">
              <Users className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Why Join a Team?</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Teams are the heart of collaborative CTF gameplay. Whether you&apos;re competing in 
            events or just practicing together, teams enhance the experience significantly.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {teamBenefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded">
                      <benefit.icon className="size-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Creating a Team */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/10 rounded">
              <Plus className="size-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold">Creating a Team</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Starting your own team makes you the Owner with full administrative privileges. 
            You can invite friends, classmates, or colleagues to join your team.
          </p>

          <div className="space-y-3">
            {createSteps.map((step) => (
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

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2">Team Size Limits</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• <strong>Free tier:</strong> Up to 5 members per team</li>
              <li>• <strong>Pro tier:</strong> Up to 15 members per team</li>
              <li>• <strong>Elite tier:</strong> Up to 50 members per team</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Joining a Team */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded">
              <UserPlus className="size-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold">Joining a Team</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            There are several ways to join an existing team. You can only be a member of one team at a time.
          </p>

          <div className="space-y-6">
            {joinMethods.map((method) => (
              <Card key={method.method}>
                <CardHeader>
                  <CardTitle className="text-base">{method.method}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {method.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500" />
              Important Note
            </h4>
            <p className="text-xs text-muted-foreground">
              If you&apos;re already in a team, you must leave it before joining another. 
              Your personal solve history stays with you, but team contributions remain with the original team.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Team Roles */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded">
              <Shield className="size-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold">Team Roles & Permissions</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Teams have a role-based permission system to help manage access and responsibilities.
          </p>

          <div className="space-y-4">
            {roles.map((role) => (
              <Card key={role.name}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${role.badge}`}>
                      <role.icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">{role.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                      <CardDescription className="text-xs mt-0.5">
                        {role.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-12">
                    <p className="text-xs text-muted-foreground mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs font-normal">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-muted rounded p-4">
            <h4 className="font-medium text-sm mb-2">Role Management</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Owners can promote members to Admin or demote Admins to Member</li>
              <li>• Ownership can be transferred to another team member</li>
              <li>• A team can have multiple Admins but only one Owner</li>
              <li>• Members cannot modify other members&apos; roles</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Team Invites */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-500/10 rounded">
              <Mail className="size-5 text-pink-500" />
            </div>
            <h2 className="text-xl font-semibold">Team Invites</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Admins and Owners can invite new members through various methods. 
            Choose the method that best fits your situation.
          </p>

          <div className="space-y-4">
            {inviteMethods.map((method) => (
              <Card key={method.type}>
                <CardHeader>
                  <CardTitle className="text-sm">{method.type}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-green-500 mb-1">Pros:</p>
                      <ul className="space-y-1">
                        {method.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-500 mb-1">Cons:</p>
                      <ul className="space-y-1">
                        {method.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <AlertCircle className="size-3 mt-0.5 text-red-500 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Managing Invites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Link2 className="size-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Invite Links</h4>
                  <p className="text-xs text-muted-foreground">
                    Links can be set to expire after 24 hours, 7 days, or never. 
                    You can revoke active links at any time from the team settings.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Pending Invites</h4>
                  <p className="text-xs text-muted-foreground">
                    View all pending invites in Team Settings → Invites. 
                    You can resend or cancel pending invites.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Leaving a Team */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded">
              <LogOut className="size-5 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold">Leaving a Team</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">As a Member</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Members can leave a team at any time without restrictions.
                </p>
                <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Go to Dashboard → Team</li>
                  <li>Click &quot;Leave Team&quot;</li>
                  <li>Confirm your decision</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">As an Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Admins can leave freely unless they are the last Admin (besides Owner).
                </p>
                <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Go to Dashboard → Team → Settings</li>
                  <li>Click &quot;Leave Team&quot;</li>
                  <li>If last Admin, promote another member first</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <Card className="border-red-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown className="size-4 text-red-500" />
                <CardTitle className="text-sm">As an Owner</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Owners cannot leave without either transferring ownership or deleting the team.
              </p>
              <div className="bg-muted rounded p-3">
                <p className="text-xs font-medium mb-2">Options:</p>
                <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Transfer ownership to another member, then leave</li>
                  <li>Delete the team entirely (cannot be undone)</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-muted rounded p-4">
            <h4 className="font-medium text-sm mb-2">What Happens When You Leave?</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• You lose access to team resources and shared notes</li>
              <li>• Your solves while in the team remain counted for the team score</li>
              <li>• You can join another team immediately or create your own</li>
              <li>• You keep your personal solve history and achievements</li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Team Best Practices */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded">
              <Trophy className="size-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold">Team Best Practices</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Use Discord, Slack, or similar for real-time communication
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Share findings and progress regularly
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Coordinate who&apos;s working on which challenge
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Ask for help when stuck - teams are for learning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Assign challenges based on individual strengths
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Keep shared notes and write-ups organized
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Set up shared tools and VPN if needed
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="size-3 mt-0.5 text-green-500 flex-shrink-0" />
                    Schedule practice sessions together
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/account">
              ← Account Guide
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help/billing">
              Billing Guide →
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
