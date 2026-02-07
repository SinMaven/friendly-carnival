import Link from "next/link"
import * as motion from "framer-motion/client"
import {
  IoFlag,
  IoFlash,
  IoLockClosed,
  IoShield,
  IoTerminal,
  IoTrophy,
} from "react-icons/io5"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getChallenges } from "@/features/challenges/queries/get-challenges"
import { getLeaderboard } from "@/features/challenges/queries/get-leaderboard"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [challenges, leaderboard] = await Promise.all([
    getChallenges(),
    getLeaderboard(5),
  ])

  const stats = {
    challenges: challenges.length,
    players: leaderboard.length,
    categories: [
      ...new Set(challenges.flatMap((c) => c.tags.map((t) => t.name))),
    ].length,
  }

  return (
    <div className="relative overflow-hidden py-16 lg:py-24">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center overflow-hidden">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="container relative z-10 m-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-24 text-center lg:mb-32"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <IoFlash className="h-4 w-4" />
            Live CTF Platform
          </motion.div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white lg:text-7xl">
            <span className="text-white">Duckurity</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-red-500 to-warm-gray-400 bg-clip-text text-transparent">
              Capture The Flag
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground lg:text-2xl">
            Master cybersecurity through hands-on challenges. Hack, learn, and
            compete with the best in web exploitation, cryptography, and reverse
            engineering.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/challenges" className="gap-2">
                <IoFlag className="h-5 w-5" />
                Start Hacking
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg"
              asChild
            >
              <Link href="/leaderboard" className="gap-2">
                <IoTrophy className="h-5 w-5" />
                Leaderboard
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="mb-24 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mb-32">
          <StatCard label="Active Challenges" value={stats.challenges} />
          <StatCard label="Categories" value={stats.categories} />
          <StatCard label="Active Players" value={`${stats.players}+`} />
        </div>

        {/* Features Grid */}
        <div className="mb-24 lg:mb-32">
          <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl text-white">
            Why Duckurity?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={IoShield}
              title="Real-World Challenges"
              description="Practice on challenges inspired by actual vulnerabilities and attack scenarios found in the wild."
            />
            <FeatureCard
              icon={IoTerminal}
              title="Dynamic Scoring"
              description="Points decrease as more players solve each challenge. Be fast to maximize your score and rank."
            />
            <FeatureCard
              icon={IoLockClosed}
              title="First Blood Rewards"
              description="Get exclusive recognition and bonus points for being the first to crack a new challenge."
            />
          </div>
        </div>

        {/* Top Players Preview */}
        {leaderboard.length > 0 && (
          <div className="mb-24">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Top Hackers</h2>
              <Link
                href="/leaderboard"
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
              >
                View all →
              </Link>
            </div>
            <Card className="overflow-hidden border-border bg-card/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-background/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Player
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leaderboard.map((entry, i) => (
                      <tr
                        key={entry.user_id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-lg">
                            {i === 0
                              ? "🥇"
                              : i === 1
                                ? "🥈"
                                : i === 2
                                  ? "🥉"
                                  : `#${i + 1}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {entry.username}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          {entry.total_points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-background px-6 py-16 text-center sm:px-12 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
            Ready to test your skills?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Join thousands of security enthusiasts. Learn by doing. Level up your
            hacking skills today.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/signup" className="gap-2">
              Create Free Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border-border bg-card/50 text-center transition-all hover:border-primary/50 hover:bg-card">
      <CardContent className="p-6">
        <div className="mb-2 text-4xl font-extrabold text-foreground">
          {value}
        </div>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <Card className="border-border bg-card/50 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
