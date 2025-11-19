import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'BNK Hackton PWA',
  description: 'Next + Tailwind + PWA starter',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body>{children}</body>
    </html>
  )
}
