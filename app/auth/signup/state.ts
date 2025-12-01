export type SignupActionState = {
  status: 'idle' | 'error'
  message?: string
}

export const signupInitialState: SignupActionState = { status: 'idle' }
