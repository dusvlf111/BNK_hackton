import { env } from 'process'

export interface SupabaseHealthResult {
  ok: boolean
  status: number
  error?: string
}

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

function assertEnv(): { url: string; key: string } {
  const missing = REQUIRED_ENV_VARS.filter((key) => !env[key])
  if (missing.length > 0) {
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`)
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL as string,
    key: env.SUPABASE_SERVICE_ROLE_KEY as string,
  }
}

export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  const { url, key } = assertEnv()
  const endpoint = `${url.replace(/\/$/, '')}/auth/v1/settings`

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    return { ok: false, status: response.status, error: message }
  }

  return { ok: true, status: response.status }
}
