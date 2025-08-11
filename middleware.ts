import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Skip if already has trailing slash or is root
  if (pathname.endsWith('/') || pathname === '') {
    return NextResponse.next();
  }
  
  // Only apply to state and city routes (not root or other routes)
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // For state routes like /alabama -> /alabama/
  // For city routes like /alabama/birmingham -> /alabama/birmingham/
  if (pathSegments.length >= 1) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = pathname + '/';
    
    return NextResponse.redirect(newUrl, 301);
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
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
  ],
};