import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the routes you want to protect here
const protectedRoutes = [
  '/dashboard',
  '/ideas/new',
  '/messages',
  '/profile',
];

// Add the auth routes (should not be accessible if already logged in)
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirect to login if trying to access a protected route without a session
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path); // Optionally save where they were going
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    // Redirect to home if trying to access login/register while already logged in
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
