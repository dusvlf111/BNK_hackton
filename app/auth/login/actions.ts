'use server'

import { auth } from '@/lib/auth'
import { loginSchema } from '@/lib/validation/auth'
import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { LoginActionState } from './state'

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? '입력값을 확인하세요.' }
  }

  const { email, password } = parsed.data
  try {
    const data = await auth.api.signInEmail({
      body: {
        email, // required
        password, // required
        rememberMe: true,
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    })
  } catch (error) {
    if (error instanceof APIError) {
      return { status: 'error', message: error.message }
    }
    
    console.error('Unknown error during login', error)
    return { status: 'error', message: '알 수 없는 오류가 발생했습니다.' }
  }
  redirect('/')
}
