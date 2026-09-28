import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('user_session')?.value;

  let sessionUser: { id: string; nama: string; email: string; role: 'WARGA' | 'PETUGAS' | 'ADMIN' } | null = null;

  if (sessionCookie) {
    try {
      sessionUser = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      sessionUser = null;
    }
  }

  // 1. If user is logged in and visits /login or /register, redirect to their role home
  if (sessionUser && (pathname === '/login' || pathname === '/register')) {
    if (sessionUser.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    if (sessionUser.role === 'PETUGAS') return NextResponse.redirect(new URL('/petugas', request.url));
    return NextResponse.redirect(new URL('/warga', request.url));
  }

  // 2. Protected Routes check
  if (pathname.startsWith('/admin')) {
    if (!sessionUser) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', request.url));
    }
    if (sessionUser.role !== 'ADMIN') {
      // Redirect unauthorized user to their role home
      const redirectPath = sessionUser.role === 'PETUGAS' ? '/petugas' : '/warga';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  if (pathname.startsWith('/petugas')) {
    if (!sessionUser) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/petugas', request.url));
    }
    if (sessionUser.role !== 'PETUGAS' && sessionUser.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/warga', request.url));
    }
  }

  if (pathname.startsWith('/warga')) {
    if (!sessionUser) {
      return NextResponse.redirect(new URL('/login?callbackUrl=/warga', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/warga/:path*', '/petugas/:path*', '/admin/:path*', '/login', '/register'],
};
