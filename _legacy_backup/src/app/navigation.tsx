import Link from "next/link"
import { IoFlag, IoMenu, IoTrophy } from "react-icons/io5"

import { AccountMenu } from "@/components/account-menu"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getSession } from "@/features/account/queries/get-session"

import { signOut } from "./(auth)/auth-actions"

const navLinks = [
  { href: "/challenges", label: "Challenges", icon: IoFlag },
  { href: "/leaderboard", label: "Leaderboard", icon: IoTrophy },
]

export async function Navigation() {
  const session = await getSession()

  return (
    <div className="relative flex items-center gap-6">
      {/* Desktop nav links */}
      <nav className="hidden items-center gap-8 lg:flex">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {session ? (
        <AccountMenu signOut={signOut} />
      ) : (
        <>
          <div className="hidden lg:flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="flex-shrink-0" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <IoMenu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full bg-background border-border">
              <SheetHeader>
                <Logo />
                <SheetDescription className="py-8">
                  <nav className="flex flex-col gap-6">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        <div className="p-2 rounded-md bg-accent text-accent-foreground">
                          <Icon className="h-5 w-5" />
                        </div>
                        {label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8 flex flex-col gap-4">
                    <Button className="w-full" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  )
}
