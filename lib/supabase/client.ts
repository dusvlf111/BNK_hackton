'use client'

import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database.types'

function getSupabaseBrowserConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase browser env vars')
  }

  return { url, key }
}

export function createSupabaseBrowserClient() {
  const { url, key } = getSupabaseBrowserConfig()
  return createBrowserClient<Database>(url, key)
}
