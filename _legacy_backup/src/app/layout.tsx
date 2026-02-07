// ... imports ...
import { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { Montserrat, Montserrat_Alternates } from "next/font/google"

import { Footer } from "@/components/footer"
import { Logo } from "@/components/logo"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/utils/cn"
import { Analytics } from "@vercel/analytics/react"

import { Navigation } from "./navigation"

import "@/styles/globals.css"

export const dynamic = "force-dynamic"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
})

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Duckurity - Capture The Flag",
  description: "The next generation CTF platform.",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "font-sans antialiased min-h-screen flex flex-col bg-background text-foreground",
          montserrat.variable,
          montserratAlternates.variable
        )}
      >
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4">
            <Logo />
            <Navigation />
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto relative h-full max-w-[1440px] px-4">
            {children}
          </div>
        </main>

        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
