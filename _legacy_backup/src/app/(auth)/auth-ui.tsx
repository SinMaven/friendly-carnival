"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { IoLogoGithub, IoLogoGoogle, IoMail } from "react-icons/io5"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ActionResponse } from "@/types/action-response"

const titleMap = {
  login: "Welcome Back",
  signup: "Create an Account",
} as const

const descriptionMap = {
  login: "Enter your credentials to access your account.",
  signup: "Enter your information to create an account.",
} as const

export function AuthUI({
  mode,
  signInWithOAuth,
  signInWithEmail,
}: {
  mode: "login" | "signup"
  signInWithOAuth: (provider: "github" | "google") => Promise<ActionResponse>
  signInWithEmail: (email: string) => Promise<ActionResponse>
}) {
  const [pending, setPending] = useState(false)
  const [emailFormOpen, setEmailFormOpen] = useState(false)

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    const form = event.target as HTMLFormElement
    const email = form["email"].value
    const response = await signInWithEmail(email)

    if (response?.error) {
      toast({
        variant: "destructive",
        description: "An error occurred while authenticating. Please try again.",
      })
    } else {
      toast({
        description: `To continue, click the link in the email sent to: ${email}`,
      })
    }

    form.reset()
    setPending(false)
  }

  async function handleOAuthClick(provider: "google" | "github") {
    setPending(true)
    const response = await signInWithOAuth(provider)

    if (response?.error) {
      toast({
        variant: "destructive",
        description: "An error occurred while authenticating. Please try again.",
      })
      setPending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">{titleMap[mode]}</CardTitle>
          <CardDescription>{descriptionMap[mode]}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthClick("google")}
            disabled={pending}
            className="w-full py-6 text-base"
          >
            <IoLogoGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthClick("github")}
            disabled={pending}
            className="w-full py-6 text-base"
          >
            <IoLogoGithub className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Collapsible open={emailFormOpen} onOpenChange={setEmailFormOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                disabled={pending}
                className="w-full py-6 text-base"
                type="button"
              >
                <IoMail className="mr-2 h-5 w-5" />
                Email
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    autoFocus
                    required
                    className="h-11"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={pending}>
                  Sign In with Email
                </Button>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
          {mode === "signup" ? (
            <div>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          ) : (
            <div>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          )}

          <div className="text-xs">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
