import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey || !serviceKey) {
    throw new Error('Missing Supabase server env vars')
  }

  return { url, anonKey, serviceKey }
}

export function createSupabaseServerClient() {
  const { url, anonKey } = getSupabaseConfig()
  const cookieStore = cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number } = {}) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: { path?: string } = {}) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}

export function createSupabaseAdminClient() {
  const { url, serviceKey } = getSupabaseConfig()
  return createClient<Database>(url, serviceKey, { auth: { persistSession: false } })
}
