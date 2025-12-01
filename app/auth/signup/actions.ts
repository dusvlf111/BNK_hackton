'use server'

import { redirect } from 'next/navigation'
import { signupSchema } from '@/lib/validation/auth'
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase/server'

export type SignupActionState = {
  status: 'idle' | 'error'
  message?: string
}

export const signupInitialState: SignupActionState = { status: 'idle' }

export async function signupAction(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const supabase = createSupabaseServerClient()
  const admin = createSupabaseAdminClient()

  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    phone: formData.get('phone'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? '입력값을 확인하세요.' }
  }

  const { email, password, name, phone } = parsed.data

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    return { status: 'error', message: error?.message ?? '회원가입 중 오류가 발생했습니다.' }
  }

  const { error: profileError } = await admin
    .from('users')
    .upsert(
      { id: data.user.id, email, name, phone: phone || null, role: 'user' },
      { onConflict: 'id' },
    )

  if (profileError) {
    return { status: 'error', message: profileError.message }
  }

  redirect('/dashboard')
}
