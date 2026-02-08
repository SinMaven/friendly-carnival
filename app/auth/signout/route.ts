import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
}
