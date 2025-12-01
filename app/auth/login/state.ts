export type LoginActionState = {
  status: 'idle' | 'error'
  message?: string
}

export const loginInitialState: LoginActionState = { status: 'idle' }
