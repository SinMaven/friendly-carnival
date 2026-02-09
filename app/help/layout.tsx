import Link from "next/link";
import { Metadata } from "next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navbar } from "@/components/navbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Flag,
  User,
  CreditCard,
  Users,
  Rocket,
  HelpCircle,
  MessageCircle,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | CTF Platform",
  description: "Documentation and help resources for CTF Platform",
};

const helpNavItems = [
  {
    title: "Getting Started",
    href: "/help/getting-started",
    icon: Rocket,
    description: "New user guide and basics",
  },
  {
    title: "Challenges",
    href: "/help/challenges",
    icon: Flag,
    description: "Solving challenges and flags",
  },
  {
    title: "Account",
    href: "/help/account",
    icon: User,
    description: "Profile and security settings",
  },
  {
    title: "Teams",
    href: "/help/teams",
    icon: Users,
    description: "Team collaboration",
  },
  {
    title: "Billing",
    href: "/help/billing",
    icon: CreditCard,
    description: "Subscriptions and payments",
  },
];

const supportItems = [
  {
    title: "FAQ",
    href: "/help#faq",
    icon: HelpCircle,
  },
  {
    title: "Contact Support",
    href: "/help#contact",
    icon: MessageCircle,
  },
];

export default async function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1">
          <Sidebar
            variant="inset"
            collapsible="icon"
            className="border-r"
          >
            <SidebarContent>
              <ScrollArea className="h-full">
                <SidebarGroup>
                  <SidebarGroupLabel>Documentation</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/help">
                            <Home className="size-4" />
                            <span>Help Center</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>Guides</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {helpNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>Support</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {supportItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="flex-1">
            <main className="flex-1">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
