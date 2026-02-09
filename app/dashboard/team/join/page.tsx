import { createSupabaseServerClient } from '@/lib/supabase/server'
import { JoinTeamForm } from '@/components/teams/join-team-form'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function JoinTeamPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams
    const code = typeof resolvedSearchParams.code === 'string' ? resolvedSearchParams.code : undefined

    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?next=/dashboard/team/join?code=' + (code || ''))
    }

    // Check if running on localhost for debugging context
    // const isLocalhost = process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost')

    // Check if user is already in a team
    const { data: membership } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .maybeSingle()

    if (membership) {
        redirect('/dashboard/team')
    }

    return (
        <div className="container max-w-lg py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Join a Team</h1>
                <p className="text-muted-foreground mt-2">
                    Enter your invite code below to join your teammates.
                </p>
            </div>

            <JoinTeamForm initialCode={code} />

            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Don't have a code? Ask your team captain for an invite link.</p>
            </div>
        </div>
    )
}
