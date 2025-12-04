import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

export const signupSchema = z.object({
  email: z.email('유효한 이메일 주소를 입력하세요.'),
  password: z
    .string()
    .regex(passwordRegex, '비밀번호는 8자 이상이며 영문과 숫자를 포함해야 합니다.'),
  name: z.string().min(2, '이름은 2자 이상 입력하세요.'),
  phone: z
    .string()
    .min(9, '전화번호를 정확히 입력하세요.')
    .max(12, '전화번호는 12자 이하로 입력하세요.')
    .or(z.literal('')),
  birth: z.string().length(8, '올바른 생년월일을 입력하세요.'),
})

export const loginSchema = z.object({
  email: z.email('유효한 이메일 주소를 입력하세요.'),
  password: z.string().nonempty('비밀번호를 입력하세요.'),
})

export type SignupFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
