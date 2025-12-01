'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validation/auth'
import { redirect } from 'next/navigation'
import type { LoginActionState } from './state'

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const supabase = await createSupabaseServerClient()

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? '입력값을 확인하세요.' }
  }

  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { status: 'error', message: error.message }
  }

  redirect('/dashboard')
}
