import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

const PROTECTED_PATHS = ['/dashboard', '/transactions', '/alerts']

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables in middleware')
  }

  return { url, anonKey }
}

export async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const { url, anonKey } = getSupabaseCredentials()
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map(({ name, value }) => ({ name, value }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set({ name, value, ...options })
          res.cookies.set({ name, value, ...options })
        })
      },
    },
  })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl
  const isAuthPath = pathname.startsWith('/auth')

  if (isProtectedPath(pathname) && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|sw\.js|workbox).*)'],
}
