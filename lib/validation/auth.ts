import { z } from 'zod'

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export const signupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력하세요.'),
  password: z
    .string()
    .regex(passwordRegex, '비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.'),
  name: z.string().min(2, '이름은 2자 이상 입력하세요.'),
  phone: z
    .string()
    .min(9, '전화번호를 정확히 입력하세요.')
    .max(20, '전화번호는 20자 이하로 입력하세요.')
    .optional()
    .or(z.literal('')),
})

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
})

export type SignupFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
