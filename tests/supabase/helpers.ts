import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import type { Database } from '@/types/database.types'

export const REQUIRED_SUPABASE_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

type Config = {
  url: string
  anonKey: string
  serviceRoleKey: string
}

function resolveConfig(): { missing: string[]; config?: Config } {
  const missing = REQUIRED_SUPABASE_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    return { missing }
  }

  return {
    missing: [],
    config: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    },
  }
}

const resolved = resolveConfig()
export const supabaseTestEnabled = resolved.missing.length === 0
export const missingSupabaseEnv = resolved.missing

export const serviceClient: SupabaseClient<Database> | null = supabaseTestEnabled
  ? createClient<Database>(resolved.config!.url, resolved.config!.serviceRoleKey, {
      auth: { persistSession: false },
    })
  : null

export function createAnonClient() {
  if (!supabaseTestEnabled) throw new Error('Supabase env missing')
  return createClient<Database>(resolved.config!.url, resolved.config!.anonKey, {
    auth: { persistSession: false },
  })
}

export const randomPassword = () => `T!${Math.random().toString(36).slice(2, 10)}Aa`

export interface TestUser {
  id: string
  email: string
  password: string
  role: string
}

export async function createAuthTestUser(role: string): Promise<TestUser> {
  if (!serviceClient) throw new Error('Supabase service client unavailable')
  const email = `test-${randomUUID()}@example.com`
  const password = randomPassword()

  const { data, error } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    throw error
  }

  const id = data.user!.id

  const { error: insertError } = await serviceClient
    .from('users')
    .insert({ id, email, role, name: role })

  if (insertError) {
    throw insertError
  }

  return { id, email, password, role }
}

export async function signInTestUser(email: string, password: string) {
  const client = createAnonClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }
  return { client, session: data.session }
}
