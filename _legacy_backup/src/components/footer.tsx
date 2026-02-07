import Link from "next/link"
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io5"

import { Logo } from "@/components/logo"

export function Footer() {
    return (
        <footer className="mt-8 flex flex-col gap-8 border-t border-border bg-card/30 py-12 lg:mt-32">
            <div className="container mx-auto flex flex-col justify-between gap-8 px-4 lg:flex-row">
                <div className="flex flex-col gap-4">
                    <Logo />
                    <p className="max-w-xs text-sm text-muted-foreground">
                        The next generation capture the flag platform for professionals and
                        enthusiasts.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-16">
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-foreground">Product</div>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/pricing" className="hover:text-primary transition-colors">
                                Pricing
                            </Link>
                            <Link href="/challenges" className="hover:text-primary transition-colors">
                                Challenges
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-foreground">Company</div>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/about-us" className="hover:text-primary transition-colors">
                                About Us
                            </Link>
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Terms
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-foreground">Support</div>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/support" className="hover:text-primary transition-colors">
                                Get Support
                            </Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-foreground">Follow us</div>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors">
                                <span className="flex items-center gap-2">
                                    <IoLogoTwitter size={18} /> <span>Twitter</span>
                                </span>
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                <span className="flex items-center gap-2">
                                    <IoLogoFacebook size={18} /> <span>Facebook</span>
                                </span>
                            </Link>
                            <Link href="#" className="hover:text-primary transition-colors">
                                <span className="flex items-center gap-2">
                                    <IoLogoInstagram size={18} /> <span>Instagram</span>
                                </span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-8 border-t border-border pt-8 text-center">
                <span className="text-xs text-muted-foreground">
                    Copyright {new Date().getFullYear()} © Duckurity. All rights reserved.
                </span>
            </div>
        </footer>
    )
}
