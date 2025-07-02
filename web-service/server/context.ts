import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { serverEnv } from '../server-env'

export async function createTRPCContext() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // 현재 사용자 정보 가져오기
  const { data: { user }, error } = await supabase.auth.getUser()

  return {
    supabase,
    user,
    error,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>> 