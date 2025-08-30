// Utility functions for generating URLs with subdomain structure

/**
 * Generates the appropriate URL based on whether we're using subdomain structure
 * @param state - State slug (e.g., 'california')
 * @param city - City slug (optional)
 * @param isSubdomainEnabled - Whether subdomain routing is enabled
 * @returns The generated URL
 */
export function generateUrl(
  state: string,
  city?: string,
  isSubdomainEnabled: boolean = true
): string {
  const baseUrl = 'https://www.consignmentstores.site';
  
  if (isSubdomainEnabled) {
    // New subdomain structure
    if (city) {
      // City page: https://california.consignmentstores.site/victorville/
      return `https://${state}.consignmentstores.site/${city}/`;
    } else {
      // State page: https://california.consignmentstores.site/
      return `https://${state}.consignmentstores.site/`;
    }
  } else {
    // Old subdirectory structure (fallback)
    if (city) {
      // City page: https://www.consignmentstores.site/california/victorville/
      return `${baseUrl}/${state}/${city}/`;
    } else {
      // State page: https://www.consignmentstores.site/california/
      return `${baseUrl}/${state}/`;
    }
  }
}

/**
 * Generates the appropriate internal link for Next.js Link component
 * When running on a subdomain, we don't need to include the state in the path
 * @param state - State slug
 * @param city - City slug (optional)
 * @param currentHost - Current hostname
 * @returns The internal link path
 */
export function generateInternalLink(
  state: string,
  city?: string,
  currentHost?: string
): string {
  // Check if we're on a subdomain
  const isOnSubdomain = currentHost && 
    !currentHost.startsWith('www.') && 
    !currentHost.startsWith('localhost') &&
    currentHost.split('.').length >= 2;
  
  if (isOnSubdomain) {
    // We're already on a state subdomain
    const currentState = currentHost.split('.')[0];
    
    if (currentState === state) {
      // Same state - use relative paths
      return city ? `/${city}/` : '/';
    } else {
      // Different state - need full URL
      return generateUrl(state, city, true);
    }
  } else {
    // We're on the main domain - use the old path structure
    // This will trigger a redirect via middleware
    return city ? `/${state}/${city}/` : `/${state}/`;
  }
}

/**
 * Checks if the current environment is running on a subdomain
 * @param hostname - The hostname to check
 * @returns Whether it's a subdomain
 */
export function isSubdomain(hostname: string): boolean {
  if (!hostname) return false;
  
  const parts = hostname.split('.');
  
  // Check if it's a subdomain (not www and not localhost)
  return parts.length > 2 || 
    (parts.length === 2 && !parts[0].startsWith('www') && !parts[0].startsWith('localhost'));
}

/**
 * Extracts the state from a subdomain
 * @param hostname - The hostname to extract from
 * @returns The state slug or null
 */
export function getStateFromSubdomain(hostname: string): string | null {
  if (!isSubdomain(hostname)) return null;
  
  const parts = hostname.split('.');
  const subdomain = parts[0].replace('www.', '');
  
  const validStates = [
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
  
  return validStates.includes(subdomain) ? subdomain : null;
}