import { createRouteHandlerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerSupabaseClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_error`)
      }

      if (data.user) {
        // Check if user profile exists, if not create one
        const { data: existingProfile, error: profileError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // User profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
              avatar_url: data.user.user_metadata?.avatar_url || null,
              subscription_tier: 'free',
              subscription_status: 'active',
              settings: {
                privacy_level: 'private',
                notification_preferences: {
                  email_notifications: true,
                  push_notifications: true,
                },
                display_preferences: {
                  theme: 'light',
                  default_view: 'grid',
                },
              },
              stats: {
                total_collections: 0,
                total_resources: 0,
                followers_count: 0,
                following_count: 0,
              },
            })

          if (insertError) {
            console.error('Error creating user profile:', insertError)
          }
        }
      }
    } catch (error) {
      console.error('Error in auth callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_error`)
    }
  }

  // Redirect to dashboard on successful authentication
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
