import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = ['/auth/login', '/auth/register', '/', '/pricing']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('ns_token')?.value

  const isPublic = PUBLIC.some((r) => pathname === r || pathname.startsWith(r + '/'))

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  if (isPublic && token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
