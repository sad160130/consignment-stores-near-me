import { NextRequest, NextResponse } from 'next/server';

// List of valid state slugs
const VALID_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'district-of-columbia', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
  'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
  'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota',
  'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia',
  'washington', 'west-virginia', 'wisconsin', 'wyoming'
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // Skip middleware for static files, API routes, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Parse the hostname to extract subdomain
  const hostParts = hostname.split('.');
  
  // Debug logging
  console.log('Hostname:', hostname);
  console.log('Host parts:', hostParts);
  
  // Extract subdomain - should be the first part if it's not 'www'
  let subdomain = null;
  
  if (hostParts.length >= 2) {
    const firstPart = hostParts[0];
    // Check if it's a state subdomain (not www and not the main domain)
    if (firstPart !== 'www' && firstPart !== 'consignmentstores' && VALID_STATES.includes(firstPart)) {
      subdomain = firstPart;
    }
  }
  
  console.log('Detected subdomain:', subdomain);

  // Handle subdomain routing for state pages
  if (subdomain) {
    console.log('Processing state subdomain:', subdomain);
    // This is a state subdomain (e.g., california.consignmentstores.site)
    
    // Rewrite the URL internally to handle it with the existing Next.js routing
    const newUrl = url.clone();
    
    if (pathname === '/' || pathname === '') {
      // State homepage: california.consignmentstores.site/ -> /california/
      newUrl.pathname = `/${subdomain}/`;
    } else {
      // City page: california.consignmentstores.site/victorville/ -> /california/victorville/
      // Keep the pathname as is, but prepend the state
      const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      newUrl.pathname = `/${subdomain}/${cleanPath}`;
    }
    
    // Add trailing slash if missing
    if (!newUrl.pathname.endsWith('/')) {
      newUrl.pathname += '/';
    }
    
    // Debug the rewrite
    console.log('Rewriting from:', url.pathname, 'to:', newUrl.pathname);
    
    // Rewrite the request to the new pathname
    return NextResponse.rewrite(newUrl);
  }

  // Handle redirects from old subdirectory URLs to new subdomain URLs
  if (!subdomain || subdomain === 'www') {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 1) {
      const potentialState = pathSegments[0];
      
      if (VALID_STATES.includes(potentialState)) {
        // This is an old-style URL that needs to be redirected
        const newUrl = new URL(url);
        
        // Set the new hostname with subdomain
        newUrl.hostname = `${potentialState}.consignmentstores.site`;
        
        // Remove the state from the pathname
        const remainingPath = pathSegments.slice(1).join('/');
        newUrl.pathname = remainingPath ? `/${remainingPath}/` : '/';
        
        // Ensure trailing slash
        if (!newUrl.pathname.endsWith('/')) {
          newUrl.pathname += '/';
        }
        
        // Perform 301 redirect to the new subdomain URL
        return NextResponse.redirect(newUrl, { status: 301 });
      }
    }
  }

  // Handle trailing slashes for non-subdomain routes
  if (!pathname.endsWith('/') && pathname !== '') {
    const newUrl = url.clone();
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