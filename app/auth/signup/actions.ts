'use server'

import { auth } from '@/lib/auth'
import { signupSchema } from '@/lib/validation/auth'
import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'
import type { SignupActionState } from './state'

export async function signupAction(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    birth: formData.get('birth'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? '입력값을 확인하세요.' }
  }

  const { email, password, name, phone } = parsed.data
  
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      return { status: 'error', message: error.message }
    }

    console.error('Unknown error during signup', error);
    return { status: 'error', message: '알 수 없는 오류가 발생했습니다.' }
  }
  redirect('/')
}
